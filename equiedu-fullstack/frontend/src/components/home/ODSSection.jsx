import React from 'react';
import { CheckCircle2, Flag, GraduationCap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/lib/I18nContext';

export default function ODSSection() {
  const { t } = useI18n();
  const principles = [t('principle1'), t('principle2'), t('principle3'), t('principle4')];
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Card className="overflow-hidden border-primary/20 bg-primary text-primary-foreground shadow-xl shadow-primary/10">
          <CardContent className="p-7 md:p-9">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10"><GraduationCap className="h-6 w-6" /></div>
            <h2 className="mt-6 font-heading text-2xl font-bold sm:text-3xl">{t('whyTitle')}</h2>
            <p className="mt-4 leading-7 text-primary-foreground/80">{t('whyBody')}</p>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/10 p-4"><p className="text-3xl font-bold">5º</p><p className="text-xs text-primary-foreground/70">EFAI</p></div>
              <div className="rounded-2xl bg-white/10 p-4"><p className="text-3xl font-bold">9º</p><p className="text-xs text-primary-foreground/70">EFAF</p></div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <div className="rounded-3xl border bg-card p-7 md:p-8">
            <div className="flex items-center gap-3"><Flag className="h-5 w-5 text-secondary" /><h2 className="font-heading text-2xl font-bold">{t('principlesTitle')}</h2></div>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {principles.map((principle) => <li key={principle} className="flex gap-3 text-sm leading-6"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-success" />{principle}</li>)}
            </ul>
          </div>
          <div className="rounded-3xl border border-secondary/25 bg-secondary/5 p-7 md:p-8">
            <h3 className="font-heading text-xl font-bold">{t('odsTitle')}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{t('odsBody')}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['ODS 4', 'ODS 10', 'ODS 17'].map((ods) => <span key={ods} className="rounded-full border border-secondary/25 bg-background px-3 py-1 text-xs font-bold text-secondary">{ods}</span>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
