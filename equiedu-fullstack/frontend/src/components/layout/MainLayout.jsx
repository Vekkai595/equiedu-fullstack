import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AccessibilityPanel from '@/components/AccessibilityPanel';
import { useI18n } from '@/lib/I18nContext';

export default function MainLayout() {
  const { t, isGuarani } = useI18n();
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 text-sm font-medium">
        {t('skip')}
      </a>
      <Header />
      {isGuarani && (
        <div className="border-b border-amber-300/60 bg-amber-50 px-4 py-2 text-center text-xs text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100" role="note">
          {t('gnNotice')}
        </div>
      )}
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <AccessibilityPanel />
    </div>
  );
}
