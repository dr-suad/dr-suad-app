-- جدول دعوات المعلمات: يتيح للدكتورة دعوة معلمة دون إنشاء حساب لها (يتجنب rate limit)
-- المعلمة تنشئ حسابها بنفسها ثم تدخل كود الدعوة لربط نفسها بالمدرسة
CREATE TABLE IF NOT EXISTS teacher_invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  used BOOLEAN DEFAULT false,
  used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- فهارس للبحث السريع بالكود والبريد
CREATE INDEX IF NOT EXISTS idx_teacher_invites_code ON teacher_invites(code);
CREATE INDEX IF NOT EXISTS idx_teacher_invites_email ON teacher_invites(email);

-- سياسات RLS: قراءة وكتابة مفتوحة (الجدول إداري بكود سري)
ALTER TABLE teacher_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read all invites" ON teacher_invites;
CREATE POLICY "Allow read all invites" ON teacher_invites FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert invites" ON teacher_invites;
CREATE POLICY "Allow insert invites" ON teacher_invites FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update invites" ON teacher_invites;
CREATE POLICY "Allow update invites" ON teacher_invites FOR UPDATE USING (true);
