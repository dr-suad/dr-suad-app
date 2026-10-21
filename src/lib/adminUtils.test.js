// اختبارات لبحث الصف بالكود (findClassByNameOrCode)
import { describe, it, expect, beforeEach, vi } from 'vitest';

// نحاكي عميل Supabase قبل استيراد الوحدة
// vi.hoisted ضروري لأن vi.mock يُرفع إلى أعلى الملف (hoisting)
const { mockSupabase } = vi.hoisted(() => ({
  mockSupabase: { from: vi.fn() },
}));

vi.mock('../lib/supabaseClient.js', () => ({
  supabase: mockSupabase,
}));

import { findClassByNameOrCode, extractClassCode, resetSchemaCache } from '../lib/adminUtils.js';

/**
 * محاكي ذكي لـ chainable query: from().select().eq().like().limit()
 * يعتمد على وسيط الاستعلام (select/eq/like) لتحديد النتيجة، وليس على ترتيب النداءات.
 */
function installSupabaseMock(handler) {
  mockSupabase.from.mockImplementation(() => {
    const q = { selectCols: null, eqCol: null, eqVal: null, likeVal: null };

    const resolve = () => {
      const result = handler({
        select: q.selectCols,
        eqCol: q.eqCol,
        eqVal: q.eqVal,
        likeVal: q.likeVal,
      }) || { data: null, error: null };
      return Promise.resolve(result);
    };

    const chain = {
      select: (cols) => { q.selectCols = cols; return chain; },
      eq: (col, val) => { q.eqCol = col; q.eqVal = val; return chain; },
      like: (col, val) => { q.likeVal = val; return chain; },
      limit: resolve,
      maybeSingle: resolve,
      // يسمح بالانتظار المباشر (.then) بدون limit
      then: (res, rej) => resolve().then(res, rej),
    };
    return chain;
  });
}

/** معالج افتراضي: أعمدة class_code و code مفقودة، والبحث بالاسم يعمل */
function defaultHandler({ select, eqCol, likeVal }) {
  if (select && select.includes('class_code')) {
    return { data: null, error: MISSING_COLUMN_ERROR };
  }
  if (eqCol === 'code') {
    return { data: null, error: MISSING_COLUMN_ERROR };
  }
  if (likeVal) {
    return { data: CLASSES, error: null };
  }
  return { data: [], error: null };
}

const MISSING_COLUMN_ERROR = {
  code: '42703',
  message: 'column classes.class_code does not exist',
};

const CLASSES = [
  { id: 'c1', name: 'صف البث [GAZA-LIVE]' },
  { id: 'c2', name: 'صف الاختبار [TEST-1234]' },
  { id: 'c3', name: 'صف بلا كود' },
];

describe('findClassByNameOrCode', () => {
  beforeEach(() => {
    mockSupabase.from.mockReset();
    sessionStorage.clear();
    resetSchemaCache();
  });

  it('يرفض الكود الفارغ دون إجراء أي استعلام', async () => {
    const res = await findClassByNameOrCode('   ');
    expect(res.classData).toBeNull();
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  it('يجد الصف عبر عمود class_code إن كان موجوداً', async () => {
    installSupabaseMock(({ select }) =>
      select && select.includes('class_code')
        ? { data: [{ id: 'x1', name: 'الصف', class_code: 'GAZA-LIVE' }], error: null }
        : { data: [], error: null }
    );

    const res = await findClassByNameOrCode('gaza-live');

    expect(res.error).toBeNull();
    expect(res.via).toBe('class_code');
    expect(res.classData.id).toBe('x1');
  });

  it('يتجاهل عمود class_code المفقود ويكمل بالبحث في الاسم', async () => {
    installSupabaseMock(defaultHandler);

    const res = await findClassByNameOrCode('GAZA-LIVE');

    expect(res.error).toBeNull();
    expect(res.classData.id).toBe('c1');
  });

  it('لا يختار صفاً لا يطابق كوده بدقة (يتجاهل التطابق الجزئي)', async () => {
    installSupabaseMock(defaultHandler);

    const res = await findClassByNameOrCode('TEST');

    expect(res.classData).toBeNull();
    expect(res.error).toBeNull();
  });

  it('يتذكر العمود المفقود ولا يعيد استعلامه', async () => {
    installSupabaseMock(defaultHandler);

    await findClassByNameOrCode('GAZA-LIVE');
    const callsAfterFirst = mockSupabase.from.mock.calls.length;

    // نداء ثانٍ → يجب تخطي عمودي class_code و code
    await findClassByNameOrCode('GAZA-LIVE');
    const callsAfterSecond = mockSupabase.from.mock.calls.length;

    expect(callsAfterSecond - callsAfterFirst).toBe(2); // فقط name exact + name like
    expect(JSON.parse(sessionStorage.getItem('dr_suad_classes_schema_v1')).missing)
      .toEqual(expect.arrayContaining(['class_code', 'code']));
  });

  it('يعيد خطأ قاعدة البيانات غير المتعلق بالعمود', async () => {
    const realError = { code: '42501', message: 'permission denied for table classes' };
    installSupabaseMock(() => ({ data: null, error: realError }));

    const res = await findClassByNameOrCode('GAZA-LIVE');

    expect(res.classData).toBeNull();
    expect(res.error).toBe(realError);
  });
});

describe('extractClassCode', () => {
  it('يقرأ الكود من عمود class_code', () => {
    expect(extractClassCode({ class_code: 'ABC-123' })).toBe('ABC-123');
  });

  it('يقرأ الكود المدمج في الاسم', () => {
    expect(extractClassCode({ name: 'صف البث [GAZA-LIVE]' })).toBe('GAZA-LIVE');
  });

  it('يعيد نصاً فارغاً عند عدم وجود كود', () => {
    expect(extractClassCode({ name: 'صف بلا كود' })).toBe('');
    expect(extractClassCode(null)).toBe('');
  });
});
