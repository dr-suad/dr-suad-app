import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { findClassByNameOrCode } from '../lib/adminUtils.js';

const AuthContext = createContext(null);

// بريد الإدارة المعتمد (يُستخدم لتحديد الدور عند تعذّر جلب الملف من قاعدة البيانات)
const KNOWN_ADMIN_EMAILS = ['suadamal2001@gmail.com'];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // يدمج الملف الجديد مع الحالة الحالية مع الحفاظ على class_id
  // (لتفادي سباق بين ensureProfile و setClassCode)
  const mergeProfile = useCallback((incoming) => {
    if (!incoming) return incoming;
    setProfile((prev) => {
      if (!prev || prev.id !== incoming.id) return incoming;
      if (!incoming.class_id && prev.class_id) return { ...incoming, class_id: prev.class_id };
      return incoming;
    });
    return incoming;
  }, []);

  // تحديد الدور الافتراضي من بيانات المصادقة (بدون استعلام قاعدة بيانات)
  const guessRole = useCallback((authUser, fallbackRole = 'student') => {
    const email = (authUser?.email || '').toLowerCase();
    if (authUser?.is_anonymous) return 'student';
    if (KNOWN_ADMIN_EMAILS.includes(email)) return 'admin';
    if (email.includes('teacher') || email.includes('mueallima')) return 'teacher';
    return fallbackRole;
  }, []);

  const ensureProfile = useCallback(async (authUser, fallbackRole = 'student') => {
    if (!authUser) return null;
    try {
      // 1) جلب الملف من Supabase بشكل إجباري (م 아니고 من localStorage)
      const { data: existing, error: fetchErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();
      if (fetchErr) {
        console.warn('Profile fetch:', fetchErr.message);
        // ملف احتياطي حتى لا يعلّق التطبيق على شاشة التحميل
        const fallback = {
          id: authUser.id,
          name: authUser.user_metadata?.name || (authUser.is_anonymous ? 'زائر' : 'مستخدم'),
          role: guessRole(authUser, fallbackRole),
          class_id: null,
        };
        mergeProfile(fallback);
        return fallback;
      }
      const email = (authUser.email || existing?.email || '').toLowerCase();

      // 2) إذا كان صف موجود، نعود بدوره — مع ترقية تلقائية للبريد المعروف
      if (existing) {
        let targetRole = existing.role;
        // المستخدم المجهول (زائر) دائماً طالب — لا ترقية له
        if (authUser.is_anonymous) {
          targetRole = 'student';
        } else if (KNOWN_ADMIN_EMAILS.includes(email)) targetRole = 'admin';
        else if (email.includes('teacher') || email.includes('mueallima')) targetRole = 'teacher';
        // إذا تم تمرير دور محدد من واجهة المستخدم وكان مختلفاً عن الدور المخزن، نستخدمه ونحدث Supabase
        else if (fallbackRole && fallbackRole !== existing.role) {
          targetRole = fallbackRole;
        }

        if (targetRole !== existing.role) {
          const { data: upgraded, error: upErr } = await supabase
            .from('profiles')
            .update({ role: targetRole })
            .eq('id', authUser.id)
            .select()
            .maybeSingle();
          const finalP = !upErr && upgraded ? upgraded : { ...existing, role: targetRole };
          mergeProfile(finalP);
          return finalP;
        }
        mergeProfile(existing);
        return existing;
      }

      // 3) لا يوجد صف → تحديد الدور تلقائياً
      let autoRole = fallbackRole;
      if (authUser.is_anonymous) {
        // الزائر المجهول طالب دائماً
        autoRole = 'student';
      } else if (KNOWN_ADMIN_EMAILS.includes(email)) {
        autoRole = 'admin';
      } else if (email.includes('teacher') || email.includes('mueallima')) {
        autoRole = 'teacher';
      } else {
        try {
          const { count, error: countErr } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });
          if (!countErr && (count === 0 || count === null)) autoRole = 'admin';
        } catch {
          // إذا فشل العد بسبب RLS، نلتزم بالدور الافتراضي
        }
      }
      const payload = {
        id: authUser.id,
        name: authUser.user_metadata?.name || (authUser.is_anonymous ? 'زائر' : 'مستخدم'),
        role: autoRole,
      };
      const { data: created, error: insertErr } = await supabase
        .from('profiles')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .maybeSingle();
      console.log('Upsert profile result:', created, insertErr);
      if (insertErr) {
        console.warn('Profile auto-create:', insertErr.message);
        mergeProfile(payload);
        return payload;
      }
      const finalProfile = created || payload;
      mergeProfile(finalProfile);
      return finalProfile;
    } catch (err) {
      console.warn('ensureProfile:', err?.message || err);
      // ملف احتياطي عند أي خطأ غير متوقع (RLS/شبكة) حتى لا يعلّق التطبيق
      const fallback = {
        id: authUser.id,
        name: authUser.user_metadata?.name || (authUser.is_anonymous ? 'زائر' : 'مستخدم'),
        role: guessRole(authUser, fallbackRole),
        class_id: null,
      };
      mergeProfile(fallback);
      return fallback;
    }
  }, [mergeProfile, guessRole]);

  useEffect(() => {
    // ملاحظة: لا نستخدم حارس "initialized" هنا لأن React StrictMode
    // يركّب المكوّن مرتين (mount → unmount → mount). الحارس كان يمنع
    // إعادة الاشتراك في ثاني تركيب بينما كان الاشتراك الأول قد تم
    // إلغاؤه في التنظيف، فيضيع حدث onAuthStateChange ولا تُحدَّث الحالة أبداً.
    // الاشتراك هنا آمن للتكرار: كل تركيب ينشئ اشتراكه ويلغيه عند التنظيف.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session && session.user) {
          setUser(session.user);
          // جلب أو إنشاء الملف تلقائياً — نؤجله خارج المعالج لتفادي
          // الجمود (deadlock) عند استدعاء Supabase داخل onAuthStateChange
          setTimeout(() => {
            ensureProfile(session.user).catch((err) => {
              console.warn('Profile auto-create:', err?.message || err);
            });
          }, 0);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.error('Session error:', error.message);
        setLoading(false);
        return;
      }
      if (session && session.user) {
        setUser(session.user);
        await ensureProfile(session.user);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [ensureProfile]); // إزالة profile من dependencies لمنع الوميض

  const signIn = useCallback(async (email, password, role = 'student') => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.user) {
      // تحديث الملف الشخصي بالدور المختار — لا نمنع تسجيل الدخول إذا فشل تحديث الملف
      try {
        await ensureProfile({ ...data.user, email }, role);
      } catch (profileErr) {
        console.warn('Profile update skipped during sign-in:', profileErr?.message || profileErr);
        setProfile({ id: data.user.id, name: email, role, email });
      }
    }
    return { data, error };
  }, [ensureProfile]);

  const signUp = useCallback(async (email, password, name, role) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (name || '').trim();
    // تحقق مبكر قبل الاتصال بـ Supabase لرسائل أوضح
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
      return { data: null, error: new Error('Email address is invalid') };
    }
    if (!password || password.length < 6) {
      return { data: null, error: new Error('Password should be at least 6 characters') };
    }
    if (!cleanName) {
      return { data: null, error: new Error('الاسم مطلوب لإنشاء الحساب') };
    }
    const finalRole = role === 'admin' ? 'admin' : role === 'teacher' ? 'teacher' : 'student';
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: { data: { name: cleanName, role: finalRole } },
    });
    if (error) return { data, error };
    if (data.user) {
      // إنشاء الصف مباشرة — أول مستخدم admin، والباقي حسب الدور المطلوب
      await ensureProfile(
        { ...data.user, email: cleanEmail, user_metadata: { name: cleanName, role: finalRole } },
        finalRole,
      );
    }
    return { data, error: null };
  }, [ensureProfile]);

  /**
   * دخول كزائر — ينشئ حساباً مجهولاً (anonymous) بدور طالب.
   * يُستخدم لتجربة سريعة بدون كود صف.
   */
  const signInAnonymously = useCallback(async () => {
    // إذا كان المستخدم زائراً بالفعل (anonymous) نكتفي بتحديث ملفه
    if (user?.is_anonymous) {
      await ensureProfile(user, 'student');
      return { data: { user }, error: null };
    }
    // مستخدم مسجّل الدخول: نخرج أولاً حتى نبدأ جلسة زائر نظيفة
    if (user) {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    }
    const { data, error } = await supabase.auth.signInAnonymously({
      options: { data: { name: 'زائر' } },
    });
    if (error) return { data: null, error };

    // إنشاء ملف الطالب (دور student) — guest لا يرتبط بصف
    if (data?.user) {
      try {
        await ensureProfile(data.user, 'student');
      } catch (profileErr) {
        console.warn('Guest profile creation skipped:', profileErr?.message || profileErr);
      }
    }
    return { data, error: null };
  }, [user, ensureProfile]);

  const setClassCode = useCallback(async (code, targetUser, preResolvedClass) => {
    const activeUser = targetUser || user;
    if (!activeUser) return { error: new Error('No user') };
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) return { error: new Error('يرجى إدخال كود الصف') };

    // البحث في class_code / code / name بالترتيب حسب توافر العمود
    // (يمكن تمرير classData جاهزاً لتفادي تكرار البحث)
    let classData = preResolvedClass || null;
    if (!classData) {
      const { classData: found, error: findErr } = await findClassByNameOrCode(cleanCode);
      if (findErr) return { error: findErr };
      if (!found) {
        return { error: new Error('كود الصف غير صحيح — تأكد من الكود لدى معلمك') };
      }
      classData = found;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ class_id: classData.id })
      .eq('id', activeUser.id)
      .select()
      .maybeSingle();
    if (error) return { error };
    if (!data) return { error: new Error('تعذر تحديث الملف الشخصي (تحقق من سياسات RLS)') };
    setProfile(data);
    return { data, error: null };
  }, [user]);


  /**
   * joinClass(code) - يتحقق من الكود أولاً، ثم ينشئ حساباً مجهولاً (إن لزم)
   * ويربط الحساب بالصف.
   *
   * مهم: التحقق من الكود يسبق إنشاء الجلسة حتى لا يُسجَّل الطالب
   * كمجهول (زائر) عند إدخال كود خاطئ — لأن ذلك كان يُفتح واجهة الطفل
   * ويُفقد رسالة الخطأ.
   */
  const joinClass = useCallback(async (code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) return { error: new Error('يرجى إدخال كود الصف') };

    // 1) تحقق من صحة الكود قبل أي تسجيل دخول
    const { classData, error: findErr } = await findClassByNameOrCode(cleanCode);
    if (findErr) return { error: findErr };
    if (!classData) {
      return { error: new Error('كود الصف غير صحيح — تأكد من الكود لدى معلمك') };
    }

    // 2) إنشاء حساب مجهول فقط بعد نجاح التحقق
    let activeUser = user;
    if (!activeUser) {
      const { data, error } = await supabase.auth.signInAnonymously({
        options: { data: { name: 'زائر' } },
      });
      if (error) return { error };
      activeUser = data?.user;
      if (activeUser) {
        try {
          await ensureProfile(activeUser, 'student');
        } catch (profileErr) {
          console.warn('Guest profile creation skipped:', profileErr?.message || profileErr);
        }
      }
    }

    // 3) ربط الحساب بالصف
    const { data, error } = await setClassCode(cleanCode, activeUser, classData);
    if (error) return { error };
    return { data, error: null };
  }, [user, ensureProfile, setClassCode]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setProfile(null);
    }
    return { error };
  }, []);

  const forceSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    setUser(null);
    setProfile(null);
    setLoading(false);
  }, []);

  // جلب الملف الشخصي من Supabase وتحديث الحالة — يُستدعى بعد أي تحديث (ربط مدرسة، إلخ)
  const refreshProfile = useCallback(async () => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      console.warn('refreshProfile:', err?.message || err);
      return null;
    }
  }, [user]);

  const value = {
    user,
    profile,
    loading,
    // "وضع التجربة" = زائر مجهول لم ينضم لأي صف.
    // الطالب الذي انضم بكود صف يصبح مجهولاً أيضاً (لأننا نستخدم
    // signInAnonymously) لكن يجب ألا يظهر له شريط التجربة.
    isGuest: !!user?.is_anonymous && !profile?.class_id,
    signIn,
    signUp,
    signOut,
    signInAnonymously,
    joinClass,
    setClassCode,
    forceSignOut,
    refreshProfile,
    setProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
