import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ClipboardCheck, Database, GraduationCap, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/lib/I18nContext';

export default function HeroSection() {
  const { t } = useI18n();
  const safeguards = [
    { icon: ShieldCheck, label: t('heroPrivacy') },
    { icon: ClipboardCheck, label: t('heroEditable') },
    { icon: Database, label: t('heroOffline') },
  ];

  return (
    <section className="relative overflow-hidden border-b bg-background">
      <div className="hero-grid absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-accent/15 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:px-8 lg:py-28">
        <div className="max-w-3xl">
          <Badge variant="outline" className="mb-5 border-primary/25 bg-primary/5 px-3 py-1 text-primary">{t('heroEyebrow')}</Badge>
          <h1 className="text-balance font-heading text-4xl font-bold leading-[1.06] tracking-[-0.035em] text-foreground sm:text-5xl lg:text-6xl">
            {t('heroTitle')}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">{t('heroBody')}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="h-12 px-6 shadow-lg shadow-primary/15">
              <Link to="/diagnostico"><GraduationCap className="mr-2 h-5 w-5" />{t('heroDiagnostic')}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6">
              <Link to="/pesquisa">{t('heroMethod')}<ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="h-12 px-6">
              <Link to="/admin">{t('heroManage')}</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
            {safeguards.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><Icon className="h-4 w-4 text-success" />{label}</span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:mx-0">
          <div className="rounded-[2rem] border bg-card/90 p-6 shadow-2xl shadow-primary/10 backdrop-blur md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">{t('heroStatus')}</p>
                <p className="mt-2 text-lg font-semibold leading-snug">{t('heroStatusValue')}</p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><GraduationCap className="h-6 w-6" /></div>
            </div>
            <div className="mt-7 space-y-4">
              {[t('step1Title'), t('step2Title'), t('step3Title'), t('step4Title')].map((label, index) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${index === 0 ? 'bg-success text-white' : 'bg-muted text-muted-foreground'}`}>
                    {index === 0 ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
                  </div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${index === 0 ? 'w-full bg-success' : index === 1 ? 'w-2/5 bg-primary/35' : 'w-0'}`} /></div>
                </div>
              ))}
            </div>
            <div className="mt-7 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground">
              <strong className="text-foreground">5º ano → EFAI</strong><span className="mx-2">·</span><strong className="text-foreground">9º ano → EFAF</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
