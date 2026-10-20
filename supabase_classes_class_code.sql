-- ============================================================
-- إضافة عمود class_code إلى جدول classes
-- (مطلوب لربط الطلاب بكود الصف)
-- ============================================================

-- 1) إضافة العمود إن لم يكن موجوداً
alter table public.classes
  add column if not exists class_code text;

-- 2) فهرس فريد (يسمح بتكرار القيم الفارغة، وال.Null فقط واحد)
create unique index if not exists classes_class_code_key
  on public.classes (class_code)
  where class_code is not null;

-- 3) إرجاع الصفوف التي لا تملك كوداً إلى صورة افتراضية
update public.classes
set class_code = 'GAZA-' || substr(replace(id::text, '-', ''), 1, 6)
where class_code is null or class_code = '';

-- 4) (اختياري) تغيير العمود 'code' القديم إن كان موجوداً ومصدراً للكود
-- update public.classes set class_code = code where class_code is null and code is not null;

-- ============================================================
-- التحقق: نفّذ هذا الاستعلام بعد التشغيل
-- select id, name, class_code from public.classes;
-- ============================================================
