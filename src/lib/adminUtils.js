// أدوات لوحة الإشراف: توليد الأكواد تلقائياً

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
