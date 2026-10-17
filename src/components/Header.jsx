import { motion } from 'framer-motion';

export default function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="brand">
          <h1>د. سعاد قريني</h1>
          <p>معلمة رياضيات — الصفوف من الأول إلى الرابع الأساسي وفق المنهاج الفلسطيني</p>
        </div>
        <div className="header-actions">
          <button className="menu-toggle" aria-label="فتح القائمة الرئيسية">
            ≡
          </button>
        </div>
      </div>
      <nav className="main-nav">
        <ul className="nav-list">
          <li><a href="#/home">الرئيسية</a></li>
          <li><a href="#/classes">الصفوف</a></li>
          <li><a href="#/plans">الخطط الفصلية</a></li>
          <li><a href="#/preparations">التحضيرات</a></li>
          <li><a href="#/worksheets">أوراق العمل</a></li>
          <li><a href="#/videos">الفيديوهات التعليمية</a></li>
          <li><a href="#/games">الألعاب التعليمية</a></li>
          <li><a href="#/assessment">التقييم</a></li>
          <li><a href="#/about">عن المعلمة</a></li>
        </ul>
      </nav>
    </header>
  );
}