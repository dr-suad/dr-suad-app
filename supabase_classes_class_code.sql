-- ============================================================
-- إضافة عمود class_code إلى جدول classes
-- (مطلوب لربط الطلاب بكود الصف)
--
-- ترتيب التنفيذ مهم:
--   1) إضافة العمود
--   2) نقل الأكواد من الاسم (مع منع التكرار)
--   3) توليد أكواد للصفوف المتبقية
--   4) إنشاء الفهرس الفريد (بعد تعبئة البيانات لتفادي التعارض)
-- ============================================================

-- 1) إضافة العمود إن لم يكن موجوداً
alter table public.classes
  add column if not exists class_code text;

-- 2) نقل الأكواد الموجودة داخل الاسم ("اسم الصف [CODE]") إلى العمود الجديد
--    (لا يُفقد الكود الأصلي — بل يُستخرج ويُخزَّن في class_code)
--    شرط "not exists" يمنع تعارض الأكواد المكرّرة بين الصفوف.
update public.classes c
set class_code = upper(substring(c.name from '\[([^\]]+)\]'))
where (c.class_code is null or c.class_code = '')
  and c.name ~ '\[([^\]]+)\]'
  and not exists (
    select 1 from public.classes x
    where x.id <> c.id
      and x.class_code = upper(substring(c.name from '\[([^\]]+)\]'))
  );

-- 3) الصفوف التي لا تملك أي كود: نولّد لها كوداً فريداً مشتقاً من المعرّف
update public.classes
set class_code = 'GAZA-' || substr(replace(id::text, '-', ''), 1, 6)
where class_code is null or class_code = '';

-- 4) فهرس فريد على الأكواد غير الفارغة
--    (يُنشأ بعد التعبئة حتى لا يفشل بسبب أكواد مكرّرة داخل الأسماء)
create unique index if not exists classes_class_code_key
  on public.classes (class_code)
  where class_code is not null and class_code <> '';

-- 5) (اختياري) تغيير العمود 'code' القديم إن كان موجوداً ومصدراً للكود
-- update public.classes set class_code = code where class_code is null and code is not null;

-- ============================================================
-- التحقق: نفّذ هذا الاستعلام بعد التشغيل
-- select id, name, class_code from public.classes;
-- ============================================================
