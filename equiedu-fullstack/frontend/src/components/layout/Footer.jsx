import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/I18nContext';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-auto border-t bg-slate-950 text-slate-100" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_.8fr_.8fr]">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <svg width="38" height="38" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <path d="M8 36V12C8 10.9 8.9 10 10 10H38C39.1 10 40 10.9 40 12V36C40 37.1 39.1 38 38 38H10C8.9 38 8 37.1 8 36Z" fill="#38bdf8" opacity=".95" />
                <path d="M12 30C12 30 18 22 24 22C30 22 36 30 36 30" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="24" cy="17" r="4" fill="#facc15" />
              </svg>
              <div><p className="font-heading text-xl font-bold">EquiEdu</p><p className="text-xs text-slate-400">Educação para Todos</p></div>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-400">{t('footerMission')}</p>
            <p className="mt-3 text-xs text-slate-500">Projeto escolar da Falcon Robots para a TBR 2026 · idealização e desenvolvimento de Samuel Borba.</p>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{t('footerNav')}</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li><Link className="hover:text-white" to="/diagnostico">{t('navDiagnostic')}</Link></li>
              <li><Link className="hover:text-white" to="/oportunidades">{t('navOpportunities')}</Link></li>
              <li><Link className="hover:text-white" to="/impacto">{t('navResults')}</Link></li>
              <li><Link className="hover:text-white" to="/pesquisa">{t('navResearch')}</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{t('footerInfo')}</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li><Link className="hover:text-white" to="/privacidade">{t('privacy')}</Link></li>
              <li><Link className="hover:text-white" to="/acessibilidade">{t('accessibility')}</Link></li>
              <li><Link className="hover:text-white" to="/fontes">{t('sources')}</Link></li>
              <li><Link className="hover:text-white" to="/admin">{t('navManage')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-500">EquiEdu · protótipo em cocriação · 2026</div>
      </div>
    </footer>
  );
}
