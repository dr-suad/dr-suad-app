// تهيئة بيئة الاختبار
import '@testing-library/react';

// بديل بسيط لـ matchMedia (بيئات jsdom لا تدعمه)
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// تنظيف sessionStorage بين الاختبارات (ذاكرة مخطط الأعمدة)
if (typeof beforeEach === 'function') {
  beforeEach(() => {
    sessionStorage.clear();
  });
}
