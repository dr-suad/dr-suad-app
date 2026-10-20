import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function StudentHome() {
  const { user, profile, setClassCode, signOut } = useAuth();
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [classCode, setClassCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // إذا كان هناك كود صف معلق من دور الاختيار
    const pending = localStorage.getItem('pending_class_code');
    if (pending && !profile?.class_id) {
      setClassCodeInput(pending);
      setShowCodeInput(true);
      localStorage.removeItem('pending_class_code');
    }
  }, [profile?.class_id]);

  const handleJoinClass = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // إذا لم يكن هناك مستخدم مسجل، نخزن الكود محلياً لاستخدامه عند تسجيل الدخول
      if (!user) {
        localStorage.setItem('pending_class_code', classCodeInput.toUpperCase());
        setShowCodeInput(false);
        return;
      }
      const { error: err } = await setClassCode(classCodeInput);
      if (err) throw err;
      setShowCodeInput(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => { await signOut(); };

  // إذا لم يكن هناك ملف شخصي بعد، ننتظر
  if (!user && !profile) {
    // زائر بالكامل — نعرض شاشة إدخال الكود مباشرة
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow border border-gray-100 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">مرحباً يا بطل! 🧒</h2>
          <p className="text-gray-600 mb-6">أنت تدخل كزائر. يرجى إدخال كود الصف الذي أعطاه لك معلمك للانضمام.</p>
          <form onSubmit={handleJoinClass} className="space-y-4">
            <input type="text" value={classCode} onChange={(e) => setClassCodeInput(e.target.value.toUpperCase())}
              placeholder="CLASS-XXXX" required maxLength="10"
              className="w-full px-4 py-2 border border-gray-300 rounded uppercase focus:ring-2 focus:ring-sunshine-500 outline-none" />
            <button type="submit" disabled={loading || !classCode}
              className="w-full px-4 py-2 bg-sunshine text-[#2D2D2D] font-bold rounded disabled:opacity-50">
              {loading ? 'جاري الحفظ...' : 'احفظ الكود'}
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <p className="text-xs text-gray-400 mt-4">سيتم تفعيل الربط تلقائياً عند تسجيل دخولك لاحقاً.</p>
          </form>
        </div>
      </div>
    );
  }

  if (!user) return <div className="p-6 text-center">جاري التحميل...</div>;

  // إذا لم يتم ربط الطالب بصف، نعرض شاشة إدخال الكود
  if (!profile?.class_id) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow border border-gray-100 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">مرحباً يا بطل! 🧒</h2>
          <p className="text-gray-600 mb-6">لم يتم ربطك بصف بعد. يرجى إدخال كود الصف الذي أعطاه لك معلمك.</p>
          <form onSubmit={handleJoinClass} className="space-y-4">
            <input type="text" value={classCode} onChange={(e) => setClassCodeInput(e.target.value.toUpperCase())}
              placeholder="GAZA-4A" required maxLength="10"
              className="w-full px-4 py-2 border border-gray-300 rounded uppercase focus:ring-2 focus:ring-sunshine-500 outline-none" />
            <button type="submit" disabled={loading || !classCode}
              className="w-full px-4 py-2 bg-sunshine text-[#2D2D2D] font-bold rounded disabled:opacity-50">
              {loading ? 'جاري الربط...' : 'انضم إلى صفك'}
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>
        </div>
      </div>
    );
  }

  // الطالب مرتبط بصف - نعرض الصفحة الرئيسية
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">مرحباً، {profile?.full_name || 'البطل'} 🎓</h1>
            <p className="text-gray-600">صفك: {profile.class_id}</p>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-coral text-white font-bold rounded hover:bg-red-600">
            تسجيل الخروج
          </button>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100 text-center">
          <p className="text-gray-600">مرحباً بك في صفحة التعلم! اختر درساً من القائمة أعلاه للبدء.</p>
        </div>
      </div>
    </div>
  );
}