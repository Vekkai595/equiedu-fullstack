import React from 'react';
import { BookOpenCheck, ChartNoAxesCombined, HandHeart, UsersRound } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/lib/I18nContext';

export default function ProblemSection() {
  const { t } = useI18n();
  const steps = [
    { icon: UsersRound, title: t('step1Title'), body: t('step1Body'), tone: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { icon: BookOpenCheck, title: t('step2Title'), body: t('step2Body'), tone: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
    { icon: ChartNoAxesCombined, title: t('step3Title'), body: t('step3Body'), tone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    { icon: HandHeart, title: t('step4Title'), body: t('step4Body'), tone: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' },
  ];

  return (
    <section className="bg-muted/40 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-secondary">EquiEdu</p>
          <h2 className="mt-3 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">{t('bridgeTitle')}</h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">{t('bridgeBody')}</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, body, tone }) => (
            <Card key={title} className="group border bg-card/80 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <CardContent className="p-6">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}><Icon className="h-5 w-5" /></div>
                <h3 className="mt-5 font-heading text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
