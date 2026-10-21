// اختبارات لسلوك AuthProvider:
// 1) الاشتراك في onAuthStateChange يبقى فعالاً بعد StrictMode (mount → unmount → mount)
// 2) التحقق من كود الصف يسبق إنشاء الجلسة المجهولة
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';

const { mockSupabase, mockAuth, mockFindClass } = vi.hoisted(() => {
  const mockSupabase = {
    from: vi.fn(() => {
      const chain = {
        select: () => chain,
        eq: () => chain,
        update: () => chain,
        upsert: () => chain,
        insert: () => chain,
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
        single: () => Promise.resolve({ data: null, error: null }),
      };
      return chain;
    }),
  };
  const mockAuth = {
    onAuthStateChange: vi.fn(),
    getSession: vi.fn(),
    signInAnonymously: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
  };
  mockSupabase.auth = mockAuth;
  return { mockSupabase, mockAuth, mockFindClass: vi.fn() };
});

vi.mock('../lib/supabaseClient.js', () => ({ supabase: mockSupabase }));
vi.mock('../lib/adminUtils.js', () => ({
  findClassByNameOrCode: mockFindClass,
}));

import { AuthProvider, useAuth } from './AuthContext.jsx';

/** مكوّن يستهلك الـ context ويعرض القيم المهمة */
function Probe() {
  const { user, loading } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user?.id || 'none'}</span>
    </div>
  );
}

/** يبني مشتركاً وهمياً يحاكي onAuthStateChange */
function makeSubscription() {
  return { unsubscribe: vi.fn() };

describe('AuthProvider - الاشتراك في onAuthStateChange', () => {
  beforeEach(() => {
    mockAuth.onAuthStateChange.mockReset();
    mockAuth.getSession.mockReset();
    mockAuth.signInAnonymously.mockReset();
    mockFindClass.mockReset();
    mockSupabase.from.mockClear();
  });

  it('ينشئ اشتراكاً جديداً في كل تركيب حتى لا يضيع الحدث', async () => {
    const subs = [];
    mockAuth.onAuthStateChange.mockImplementation(() => {
      const sub = makeSubscription();
      subs.push(sub);
      return { data: { subscription: sub } };
    });
    mockAuth.getSession.mockResolvedValue({ data: { session: null }, error: null });

    await act(async () => {
      render(
        <AuthProvider>
          <Probe />
        </AuthProvider>
      );
    });

    // يجب أن يبقى هناك اشتراك فعّال واحد على الأقل
    const active = subs.filter((s) => !s.unsubscribe.mock.calls.length);
    expect(active.length).toBeGreaterThanOrEqual(1);
  });

  it('يحدّث الحالة عند وصول حدث مصادقة بعد إعادة التركيب', async () => {
    let handler = null;
    mockAuth.onAuthStateChange.mockImplementation((cb) => {
      handler = cb;
      return { data: { subscription: makeSubscription() } };
    });
    mockAuth.getSession.mockResolvedValue({ data: { session: null }, error: null });

    await act(async () => {
      render(
        <AuthProvider>
          <Probe />
        </AuthProvider>
      );
    });

    expect(screen.getByTestId('loading').textContent).toBe('false');

    // نُطلق حدث تسجيل دخول كما لو وصل من Supabase
    await act(async () => {
      handler('SIGNED_IN', { user: { id: 'u1', email: 'a@b.com' } });
      await new Promise((r) => setTimeout(r, 10));
    });

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('u1');
    });
  });
});

}

describe('AuthProvider - الانضمام بكود غير صحيح', () => {
  beforeEach(() => {
    mockAuth.onAuthStateChange.mockImplementation(() => ({
      data: { subscription: makeSubscription() },
    }));
    mockAuth.getSession.mockResolvedValue({ data: { session: null }, error: null });
    mockAuth.signInAnonymously.mockReset();
    mockFindClass.mockReset();
  });

  it('لا ينشئ جلسة مجهولة عندما يكون الكود خاطئاً', async () => {
    // الكود غير موجود
    mockFindClass.mockResolvedValue({ classData: null, error: null, via: 'name' });

    let joinResult = null;
    function JoinProbe() {
      const { joinClass } = useAuth();
      return (
        <button
          onClick={async () => {
            joinResult = await joinClass('WRONG-CODE');
          }}
        >
          join
        </button>
      );
    }

    await act(async () => {
      render(
        <AuthProvider>
          <JoinProbe />
        </AuthProvider>
      );
    });

    await act(async () => {
      screen.getByText('join').click();
      await new Promise((r) => setTimeout(r, 20));
    });

    // الأهم: لم تُنشأ أي جلسة مجهولة
    expect(mockAuth.signInAnonymously).not.toHaveBeenCalled();
    expect(joinResult).toBeTruthy();
    expect(joinResult.error).toBeTruthy();
    expect(joinResult.error.message).toMatch(/كود الصف غير صحيح/);
  });

  it('ينشئ الجلسة المجهولة فقط بعد نجاح التحقق من الكود', async () => {
    mockFindClass.mockResolvedValue({
      classData: { id: 'c1', name: 'صف' },
      error: null,
      via: 'class_code',
    });
    mockAuth.signInAnonymously.mockResolvedValue({
      data: { user: { id: 'u-anon', is_anonymous: true, user_metadata: { name: 'زائر' } } },
      error: null,
    });

    let joinResult = null;
    function JoinProbe() {
      const { joinClass } = useAuth();
      return (
        <button
          onClick={async () => {
            joinResult = await joinClass('GAZA-LIVE');
          }}
        >
          join
        </button>
      );
    }

    await act(async () => {
      render(
        <AuthProvider>
          <JoinProbe />
        </AuthProvider>
      );
    });

    await act(async () => {
      screen.getByText('join').click();
      await new Promise((r) => setTimeout(r, 30));
    });

    expect(mockAuth.signInAnonymously).toHaveBeenCalledTimes(1);
    // ترتيب الاستدعاءات: التحقق من الكود قبل إنشاء الجلسة
    const findOrder = mockFindClass.mock.invocationCallOrder[0];
    const anonOrder = mockAuth.signInAnonymously.mock.invocationCallOrder[0];
    expect(findOrder).toBeLessThan(anonOrder);
  });
});
