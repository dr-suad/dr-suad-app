import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

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
        return null;
      }
      const email = (authUser.email || existing?.email || '').toLowerCase();

      // 2) إذا كان صف موجود، نعود بدوره — مع ترقية تلقائية للبريد المعروف
      if (existing) {
        let targetRole = existing.role;
        const KNOWN_ADMIN_EMAILS = ['suadamal2001@gmail.com'];
        if (KNOWN_ADMIN_EMAILS.includes(email)) targetRole = 'admin';
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
          setProfile(finalP);
          return finalP;
        }
        setProfile(existing);
        return existing;
      }

      // 3) لا يوجد صف → تحديد الدور تلقائياً
      let autoRole = fallbackRole;
      const KNOWN_ADMIN_EMAILS2 = ['suadamal2001@gmail.com'];
      if (KNOWN_ADMIN_EMAILS2.includes(email)) {
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
        name: authUser.user_metadata?.name || 'مستخدم',
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
        setProfile(payload);
        return payload;
      }
      const finalProfile = created || payload;
      setProfile(finalProfile);
      return finalProfile;
    } catch (err) {
      console.warn('ensureProfile:', err?.message || err);
      return null;
    }
  }, []);

  useEffect(() => {
    // منع التشغيل المتكرر
    if (initialized.current) return;
    initialized.current = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && session.user) {
          setUser(session.user);
          // جلب أو إنشاء تلقائي — أول مستخدم يصبح admin (يصلح 406 لغياب الصف)
          await ensureProfile(session.user);
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

    return () => subscription.unsubscribe();
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

  const signInAnonymously = useCallback(async () => {
    const { data, error } = await supabase.auth.signInAnonymously();
    return { data, error };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setProfile(null);
      initialized.current = false; // إعادة التعيين للسماح بإعادة التشغيل
    }
    return { error };
  }, []);

  const setClassCode = useCallback(async (code) => {
    if (!user) return { error: new Error('No user') };
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('id')
      .eq('class_code', code)
      .maybeSingle();
    if (classError || !classData) {
      return { error: classError || new Error('كود الصف غير صحيح') };
    }
    const { data, error } = await supabase
      .from('profiles')
      .update({ class_id: classData.id })
      .eq('id', user.id)
      .select()
      .maybeSingle();
    if (error) return { error };
    if (!data) return { error: new Error('تعذر تحديث الملف الشخصي (تحقق من سياسات RLS)') };
    setProfile(data);
    return { data, error: null };
  }, [user]);

  const forceSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    setUser(null);
    setProfile(null);
    setLoading(false);
    initialized.current = false;
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
    signIn,
    signUp,
    signOut,
    signInAnonymously,
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
