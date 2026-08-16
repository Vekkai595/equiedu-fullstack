import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, BarChart3, Download, GraduationCap, School, ShieldCheck, UsersRound } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { equiedu } from '@/api/equieduClient';
import { useI18n } from '@/lib/I18nContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const mean = (values) => values.length ? values.reduce((sum, value) => sum + Number(value || 0), 0) / values.length : null;

export default function Impacto() {
  const { t } = useI18n();
  const [gradeFilter, setGradeFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const { data: diagnostics = [] } = useQuery({
    queryKey: ['diagnostics'],
    queryFn: () => equiedu.entities.DiagnosticResponse.list('-created_date', 5000),
  });

  const validDiagnostics = diagnostics.filter((item) => item.completed_flow && item.total_questions > 0 && item.school_code && item.class_code);
  const classOptions = useMemo(() => [...new Set(validDiagnostics.map((item) => `${item.school_code} · ${item.class_code}`))].sort(), [validDiagnostics]);
  const filtered = validDiagnostics.filter((item) => {
    if (gradeFilter !== 'all' && String(item.grade) !== gradeFilter) return false;
    if (classFilter !== 'all' && `${item.school_code} · ${item.class_code}` !== classFilter) return false;
    return true;
  });

  const schoolCount = new Set(filtered.map((item) => item.school_code)).size;
  const classesCount = new Set(filtered.map((item) => `${item.school_code}|${item.class_code}|${item.grade}`)).size;
  const overallAverage = mean(filtered.map((item) => item.score_pct));

  const classAverages = Object.values(filtered.reduce((acc, item) => {
    const key = `${item.school_code}|${item.class_code}|${item.grade}`;
    if (!acc[key]) acc[key] = { key, school: item.school_code, classCode: item.class_code, grade: item.grade, values: [] };
    acc[key].values.push(Number(item.score_pct));
    return acc;
  }, {})).map((group) => ({ ...group, count: group.values.length, average: mean(group.values) })).sort((a, b) => `${a.school}${a.classCode}`.localeCompare(`${b.school}${b.classCode}`));

  const subjectAverages = Object.values(filtered.reduce((acc, item) => {
    (item.subject_scores || []).forEach((subject) => {
      const key = subject.subject || 'Não informado';
      if (!acc[key]) acc[key] = { subject: key, weightedCorrect: 0, total: 0 };
      acc[key].weightedCorrect += Number(subject.correct || 0);
      acc[key].total += Number(subject.total || 0);
    });
    return acc;
  }, {})).map((subject) => ({ ...subject, average: subject.total ? Math.round((subject.weightedCorrect / subject.total) * 100) : 0 })).sort((a, b) => b.average - a.average);

  const exportData = () => {
    const payload = {
      exported_at: new Date().toISOString(),
      notice: 'Dados anônimos armazenados localmente. Não contém nomes de estudantes.',
      filters: { grade: gradeFilter, class: classFilter },
      summary: { applications: filtered.length, schools: schoolCount, classes: classesCount, overall_average: overallAverage },
      class_averages: classAverages,
      subject_averages: subjectAverages,
      responses: filtered,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `equiedu-resultados-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const stats = [
    { label: t('applications'), value: filtered.length, icon: UsersRound },
    { label: t('average'), value: overallAverage == null ? '—' : `${overallAverage.toFixed(1)}%`, icon: BarChart3 },
    { label: t('classes'), value: classesCount, icon: GraduationCap },
    { label: t('schools'), value: schoolCount, icon: School },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Badge variant="outline" className="mb-4 border-success/30 bg-success/5 text-success"><ShieldCheck className="mr-1 h-3.5 w-3.5" />{t('resultsEyebrow')}</Badge>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{t('resultsTitle')}</h1>
          <p className="mt-3 text-lg leading-8 text-muted-foreground">{t('resultsBody')}</p>
        </div>
        <Button variant="outline" onClick={exportData} disabled={filtered.length === 0}><Download className="mr-2 h-4 w-4" />{t('export')}</Button>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:max-w-2xl">
        <div>
          <label className="mb-2 block text-xs font-semibold text-muted-foreground">{t('filterGrade')}</label>
          <Select value={gradeFilter} onValueChange={(value) => { setGradeFilter(value); setClassFilter('all'); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">{t('allGrades')}</SelectItem><SelectItem value="5">{t('grade5')}</SelectItem><SelectItem value="9">{t('grade9')}</SelectItem></SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold text-muted-foreground">{t('filterClass')}</label>
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">{t('allClasses')}</SelectItem>{classOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="mt-10 border-dashed">
          <CardContent className="px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-muted"><BarChart3 className="h-8 w-8 text-muted-foreground" /></div>
            <h2 className="mt-5 font-heading text-xl font-bold">{t('noDataTitle')}</h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">{t('noDataBody')}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map(({ label, value, icon: Icon }) => (
              <Card key={label}><CardContent className="p-5"><Icon className="h-5 w-5 text-secondary" /><p className="mt-4 font-heading text-3xl font-bold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></CardContent></Card>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
            <div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" /><p>{t('smallGroupWarning')}</p></div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-lg">{t('classAverages')}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {classAverages.map((group) => (
                  <div key={group.key} className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl border p-4">
                    <div><p className="font-semibold">{group.school} · {group.classCode}</p><p className="text-xs text-muted-foreground">{group.grade}º · {group.count} {t('learners')}</p></div>
                    <div className="text-right"><p className="text-2xl font-bold">{group.count >= 5 ? `${group.average.toFixed(1)}%` : '—'}</p>{group.count < 5 && <p className="text-[11px] text-amber-700 dark:text-amber-400">n &lt; 5</p>}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">{t('subjectAverages')}</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={Math.max(260, subjectAverages.length * 55)}>
                  <BarChart data={subjectAverages} layout="vertical" margin={{ left: 24, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <YAxis type="category" dataKey="subject" width={100} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="average" fill="hsl(var(--secondary))" radius={[0, 7, 7, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
