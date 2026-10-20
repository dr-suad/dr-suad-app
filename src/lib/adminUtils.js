// ============================================================
// خدمة كود الصف — تتعامل مع المخطط بمرونة
// ============================================================
//
// ملاحظة مهمة: جدول classes في قاعدة البيانات الحالية يحتوي:
//   id, name, teacher_id, school_id, created_at
// ولا يحتوي عمود "class_code" إلا إذا تم تطبيق:
//   supabase_classes_class_code.sql
//
// لذلك تحاول هذه الوحدة الكتابة في "class_code" أولاً، وعند الفشل
// بسبب غياب العمود، تتراجع إلى البحث في "name" (كود مدمج في الاسم)
// كحل احتياطي يعمل فوراً بدون أي تعديل على قاعدة البيانات.

import { supabase } from './supabaseClient.js';

/** كود العمود غير موجود في المخطط */
function isMissingColumn(error) {
  if (!error) return false;
  const code = error.code || '';
  const msg = error.message || '';
  return code === '42703' || code === 'PGRST204' || /does not exist|Could not find the .* column/i.test(msg);
}

// ذاكرة مؤقتة للمخطط: أعمدة معروفة بأنها غير موجودة — تمنع تكرار الطلبات الفاشلة
const missingColumns = new Set();

/** هل نعلم مسبقاً أن العمود غير متاح؟ */
function isKnownMissing(col) {
  return missingColumns.has(col);
}

/** هل نعلم مسبقاً أن العمود متاح؟ */
const knownColumns = new Set();
function isKnownPresent(col) {
  return knownColumns.has(col);
}

function markColumn(col, present) {
  if (present) {
    knownColumns.add(col);
    missingColumns.delete(col);
  } else {
    missingColumns.add(col);
    knownColumns.delete(col);
  }
}

/**
 * جلب صف بالاسم (الكود) — يعمل مع المخطط الحالي بدون عمود class_code
 */
export async function findClassByNameOrCode(code) {
  const clean = (code || '').trim().toUpperCase();
  if (!clean) return { classData: null, error: null, via: null };

  // 1) محاولة أول: عمود class_code (إن كان موجوداً)
  if (!isKnownMissing('class_code')) {
    const { data: byClassCode, error: err1 } = await supabase
      .from('classes')
      .select('id, name, class_code')
      .eq('class_code', clean)
      .maybeSingle();

    if (!err1 && byClassCode) return { classData: byClassCode, error: null, via: 'class_code' };
    if (err1) {
      if (isMissingColumn(err1)) {
        markColumn('class_code', false);
      } else {
        return { classData: null, error: err1, via: null };
      }
    } else if (isKnownPresent('class_code')) {
      // العمود موجود لكن لا يوجد صف بهذا الكود → لا نكمل
      return { classData: null, error: null, via: 'class_code' };
    }
  }

  // 2) محاولة ثانية: عمود code (مخططات أخرى)
  if (!isKnownMissing('code')) {
    const { data: byCode, error: err2 } = await supabase
      .from('classes')
      .select('id, name, class_code')
      .eq('code', clean)
      .maybeSingle();

    if (!err2 && byCode) return { classData: byCode, error: null, via: 'code' };
    if (err2) {
      if (isMissingColumn(err2)) {
        markColumn('code', false);
      } else {
        return { classData: null, error: err2, via: null };
      }
    } else if (isKnownPresent('code')) {
      return { classData: null, error: null, via: 'code' };
    }
  }

  // 3) حل احتياطي: الاسم نفسه يساوي الكود (select بدون class_code لتفادي الخطأ)
  const { data: byName, error: err3 } = await supabase
    .from('classes')
    .select('id, name')
    .eq('name', clean)
    .maybeSingle();

  if (err3) {
    if (!isMissingColumn(err3)) return { classData: null, error: err3, via: null };
  } else if (byName) {
    return { classData: byName, error: null, via: 'name' };
  }

  // 4) حل احتياطي: الكود مدمج داخل الاسم بصيغة "اسم الصف [CODE]"
  const { data: byNameLike, error: err4 } = await supabase
    .from('classes')
    .select('id, name')
    .like('name', `%${clean}%`);

  if (err4) {
    if (isMissingColumn(err4)) return { classData: null, error: null, via: 'name' };
    return { classData: null, error: err4, via: null };
  }

  const match = (byNameLike || []).find((row) => extractClassCode(row) === clean);
  if (match) return { classData: match, error: null, via: 'name' };

  return { classData: null, error: null, via: 'name' };
}

/**
 * إنشاء صف جديد مع كود.
 * - إن كان عمود class_code متاحاً → يُخزَّن الكود فيه.
 * - وإلا → يُخزَّن الكود في "name" بصيغة: "اسم الصف [CODE]"
 */
export async function createClassWithCode({ name, teacherId = null, schoolId = null, code }) {
  const finalCode = (code || '').trim().toUpperCase();
  const baseName = (name || 'صف').trim();

  // 1) محاولة مع class_code
  const payload = { name: baseName, teacher_id: teacherId, school_id: schoolId, class_code: finalCode };
  const { data, error } = await supabase
    .from('classes')
    .insert([payload])
    .select()
    .maybeSingle();

  if (!error) {
    markColumn('class_code', true);
    return { classData: data, error: null, via: 'class_code' };
  }
  if (!isMissingColumn(error)) return { classData: null, error, via: null };
  markColumn('class_code', false);

  // 2) تراجع: تخزين الكود داخل "name"
  const fallbackName = finalCode ? `${baseName} [${finalCode}]` : baseName;
  const { data: fb, error: fbErr } = await supabase
    .from('classes')
    .insert([{ name: fallbackName, teacher_id: teacherId, school_id: schoolId }])
    .select()
    .maybeSingle();

  if (fbErr) return { classData: null, error: fbErr, via: null };
  return { classData: fb, error: null, via: 'name' };
}

/**
 * استخراج كود الصف من سجل صف (يتعامل مع الحالتين)
 */
export function extractClassCode(classRow) {
  if (!classRow) return '';
  if (classRow.class_code) return classRow.class_code;
  const name = classRow.name || '';
  const m = name.match(/\[([^\]]+)\]/);
  return m ? m[1] : '';
}

// توليد كود معلمة عشوائي من 6 أحرف/أرقام (بدون حروف ملتبسة I,O,0,1)
/**
 * مثال: "K7M2P9" — يُستخدم ككود دخول للطالب أو كود ربط للمعلمة
 */
export function generateStudentCode() {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const rand = (typeof crypto !== 'undefined' && crypto.getRandomValues)
    ? (() => { const a = new Uint32Array(6); crypto.getRandomValues(a); return [...a]; })()
    : Array.from({ length: 6 }, () => Math.floor(Math.random() * 0xffffffff));
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += alphabet[rand[i] % alphabet.length];
  }
  return code;
}

/**
 * توليد كود دعوة معلمة: "TCH-XXXX" — 4 رموز عشوائية ببادئة ثابتة
 * يُستخدم لربط حساب المعلمة (التي تنشئه بنفسها) بالمدرسة دون rate limit
 */
export function generateInviteCode() {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const rand = (typeof crypto !== 'undefined' && crypto.getRandomValues)
    ? (() => { const a = new Uint32Array(4); crypto.getRandomValues(a); return [...a]; })()
    : Array.from({ length: 4 }, () => Math.floor(Math.random() * 0xffffffff));
  let suffix = '';
  for (let i = 0; i < 4; i++) {
    suffix += alphabet[rand[i] % alphabet.length];
  }
  return `TCH-${suffix}`;
}

// تحويل الحروف العربية الشائعة إلى لاتينية للبادئة
const AR_MAP = {
  'ا': 'A', 'أ': 'A', 'إ': 'A', 'آ': 'A', 'ب': 'B', 'ت': 'T', 'ث': 'T',
  'ج': 'J', 'ح': 'H', 'خ': 'K', 'د': 'D', 'ذ': 'D', 'ر': 'R', 'ز': 'Z',
  'س': 'S', 'ش': 'S', 'ص': 'S', 'ض': 'D', 'ط': 'T', 'ظ': 'Z', 'ع': 'A',
  'غ': 'G', 'ف': 'F', 'ق': 'Q', 'ك': 'K', 'ل': 'L', 'م': 'M', 'ن': 'N',
  'ه': 'H', 'ة': 'A', 'و': 'W', 'ي': 'Y', 'ى': 'A', 'ء': 'A', 'ئ': 'A', 'ؤ': 'W',
};

/**
 * توليد كود مدرسة فريد: "مدرسة الأمل" -> "AML-X7K9"
 * - أول 3 حروف لاتينية من الاسم (أو تحويل من العربية، أو SCH كافتراضي)
 * - شرطة + 4 أحرف/أرقام عشوائية (بدون حروف ملتبسة I,O,0,1)
 */
export function generateSchoolCode(name = '') {
  const clean = (name || '').trim();
  // حروف لاتينية موجودة في الاسم
  const latin = clean.replace(/[^A-Za-z]/g, '').toUpperCase();
  let prefix = '';
  if (latin.length >= 3) {
    prefix = latin.slice(0, 3);
  } else {
    // تحويل من العربية
    const transliterated = [...clean]
      .map((ch) => AR_MAP[ch] || '')
      .join('')
      .replace(/[^A-Z]/g, '');
    prefix = (transliterated.slice(0, 3) || 'SCH').padEnd(3, 'X');
  }
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let suffix = '';
  const rand = (typeof crypto !== 'undefined' && crypto.getRandomValues)
    ? (() => { const a = new Uint32Array(4); crypto.getRandomValues(a); return [...a]; })()
    : Array.from({ length: 4 }, () => Math.floor(Math.random() * 0xffffffff));
  for (let i = 0; i < 4; i++) {
    suffix += alphabet[rand[i] % alphabet.length];
  }
  return `${prefix}-${suffix}`;
}

/** 
 * توليد كود صف تلقائياً: "CLS4-X7K9" 
 * - أول 4 أحرف من اسم الصف (أو CLS كافتراضي) 
 * - شرطة + 4 أحرف/أرقام عشوائية (بدون حروف ملتبسة I,O,0,1) 
 */ 
export function generateClassCode(className = '') { 
  const clean = (className || '').trim(); 
  const latin = clean.replace(/[^A-Za-z\u0600-\u06FF]/g, '').toUpperCase(); 
  let prefix = ''; 
  if (latin.length >= 4) { 
    prefix = latin.slice(0, 4); 
  } else { 
    const transliterated = [...clean] 
      .map((ch) => AR_MAP[ch] || ch) 
      .join('') 
      .replace(/[^A-Z0-9]/g, ''); 
    prefix = (transliterated.slice(0, 4) || 'CLS').padEnd(4, 'X'); 
  } 
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; 
  let suffix = ''; 
  const rand = (typeof crypto !== 'undefined' && crypto.getRandomValues) 
    ? (() => { const a = new Uint32Array(4); crypto.getRandomValues(a); return [...a]; })() 
    : Array.from({ length: 4 }, () => Math.floor(Math.random() * 0xffffffff)); 
  for (let i = 0; i < 4; i++) { 
    suffix += alphabet[rand[i] % alphabet.length]; 
  } 
  return `CLS${prefix}-${suffix}`; 
}
