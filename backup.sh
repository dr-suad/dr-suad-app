#!/bin/bash
cd "$(dirname "$0")"
cd ..
zip -r "dr-suad-app-backup-$(date +%Y%m%d).zip" "dr.suad app" \
  -x "dr.suad app/node_modules/*" \
  -x "dr.suad app/dist/*" \
  -x "dr.suad app/.git/*"
echo "تم إنشاء النسخة الاحتياطية بنجاح!"
