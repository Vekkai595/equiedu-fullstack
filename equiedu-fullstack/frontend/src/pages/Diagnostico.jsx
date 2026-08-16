import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, ArrowLeft, ArrowRight, BarChart3, BookOpenCheck, CheckCircle2, ClipboardList, GraduationCap, Settings2, ShieldCheck } from 'lucide-react';
import { equiedu } from '@/api/equieduClient';
import { useI18n } from '@/lib/I18nContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const parseOptions = (value) => {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  return String(value || '').split(/\r?\n|\s*\|\s*/).map((item) => item.trim()).filter(Boolean);
};

const normalizedLanguage = (value) => ({ pt: 'pt-BR', 'pt-br': 'pt-BR', guarani: 'gn', avane: 'gn' }[String(value || '').toLowerCase()] || value || 'pt-BR');

const isValidatedQuestion = (question, grade) => {
  const correctIndex = Number(question.correct_index);
  return String(question.grade) === String(grade)
    && question.status === 'validada'
    && question.active !== false
    && question.active !== 'false'
    && parseOptions(question.options).length >= 2
    && Number.isInteger(correctIndex)
    && correctIndex >= 1
    && correctIndex <= parseOptions(question.options).length;
};

const sanitizeCode = (value) => value.toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 20);

export default function Diagnostico() {
  const { t, locale } = useI18n();
  const queryClient = useQueryClient();
  const [phase, setPhase] = useState('setup');
  const [grade, setGrade] = useState('5');
  const [schoolCode, setSchoolCode] = useState('');
  const [classCode, setClassCode] = useState('');
  const [questions, setQuestions] = useState([]);
  const [usedFallback, setUsedFallback] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data: bank = [] } = useQuery({
    queryKey: ['question-bank'],
    queryFn: () => equiedu.entities.QuestionBank.list('order', 1000),
  });

  const available = useMemo(() => {
    const validated = bank.filter((question) => isValidatedQuestion(question, grade));
    const exact = validated.filter((question) => normalizedLanguage(question.language) === locale);
    if (exact.length) return { questions: exact, fallback: false };
    const portuguese = validated.filter((question) => normalizedLanguage(question.language) === 'pt-BR');
    return { questions: portuguese, fallback: locale !== 'pt-BR' && portuguese.length > 0 };
  }, [bank, grade, locale]);

  const begin = () => {
    if (!schoolCode || !classCode || available.questions.length === 0) return;
    setQuestions([...available.questions].sort((a, b) => Number(a.order || 0) - Number(b.order || 0)));
    setUsedFallback(available.fallback);
    setQuestionIndex(0);
    setAnswers({});
    setResult(null);
    setPhase('questions');
  };

  const currentQuestion = questions[questionIndex];
  const options = currentQuestion ? parseOptions(currentQuestion.options) : [];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  const finish = async () => {
    if (loading) return;
    setLoading(true);
    const questionResults = questions.map((question) => {
      const selectedIndex = Number(answers[question.id]);
      const correctIndex = Number(question.correct_index) - 1;
      return {
        question_id: question.id,
        subject: question.subject || 'Não informado',
        skill: question.skill || '',
        selected_index: selectedIndex,
        correct: selectedIndex === correctIndex,
      };
    });
    const correctCount = questionResults.filter((item) => item.correct).length;
    const subjectMap = questionResults.reduce((acc, item) => {
      const key = item.subject;
      if (!acc[key]) acc[key] = { subject: key, correct: 0, total: 0 };
      acc[key].total += 1;
      if (item.correct) acc[key].correct += 1;
      return acc;
    }, {});
    const subjectScores = Object.values(subjectMap).map((item) => ({ ...item, score_pct: Math.round((item.correct / item.total) * 100) }));
    const payload = {
      session_id: `anon_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      grade,
      school_code: schoolCode,
      class_code: classCode,
      interface_language: locale,
      question_language: usedFallback ? 'pt-BR' : locale,
      used_language_fallback: usedFallback,
      question_ids: questions.map((question) => question.id),
      question_results: questionResults,
      subject_scores: subjectScores,
      correct_count: correctCount,
      total_questions: questions.length,
      score_pct: Math.round((correctCount / questions.length) * 100),
      data_status: 'real_application',
      completed_flow: true,
    };
    const saved = await equiedu.entities.DiagnosticResponse.create(payload);
    setResult(saved);
    queryClient.invalidateQueries({ queryKey: ['diagnostics'] });
    setPhase('completed');
    setLoading(false);
  };

  if (phase === 'completed' && result) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-success/30 shadow-xl shadow-success/5">
          <div className="h-2 bg-success" />
          <CardContent className="p-6 sm:p-10">
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-success/10 text-success"><CheckCircle2 className="h-8 w-8" /></div>
              <div className="flex-1">
                <Badge variant="outline" className="mb-3">{grade}º ano · {schoolCode} · {classCode}</Badge>
                <h1 className="font-heading text-3xl font-bold">{t('resultTitle')}</h1>
                <p className="mt-2 text-muted-foreground">{t('resultBody')}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-[.8fr_1.2fr]">
              <div className="rounded-3xl bg-primary p-6 text-primary-foreground">
                <p className="text-sm text-primary-foreground/70">{t('resultScore')}</p>
                <p className="mt-2 text-5xl font-bold">{result.score_pct}%</p>
                <p className="mt-2 text-sm text-primary-foreground/80">{t('resultCorrect', { correct: result.correct_count, total: result.total_questions })}</p>
              </div>
              <div className="rounded-3xl border p-6">
                <h2 className="font-heading font-bold">{t('resultBySubject')}</h2>
                <div className="mt-4 space-y-4">
                  {result.subject_scores.map((subject) => (
                    <div key={subject.subject}>
                      <div className="mb-1 flex justify-between gap-3 text-sm"><span>{subject.subject}</span><strong>{subject.score_pct}%</strong></div>
                      <Progress value={subject.score_pct} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild><Link to="/impacto"><BarChart3 className="mr-2 h-4 w-4" />{t('viewResults')}</Link></Button>
              <Button asChild variant="outline"><Link to="/oportunidades">{t('explore')}<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              <Button variant="ghost" onClick={() => { setPhase('setup'); setSchoolCode(''); setClassCode(''); }}>{t('back')}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === 'questions' && currentQuestion) {
    const isLast = questionIndex === questions.length - 1;
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
            <span>{t('questionOf', { current: questionIndex + 1, total: questions.length })}</span>
            <span className="font-semibold">{grade}º · {classCode}</span>
          </div>
          <Progress value={((questionIndex + 1) / questions.length) * 100} className="mt-3 h-2" />
          {usedFallback && <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">{t('languageFallback')}</div>}
        </div>

        <Card className="shadow-lg shadow-primary/5">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge>{currentQuestion.subject || t('subject')}</Badge>
              {currentQuestion.skill && <Badge variant="outline">{currentQuestion.skill}</Badge>}
            </div>
            <CardTitle className="text-balance text-xl leading-8 sm:text-2xl">{currentQuestion.statement}</CardTitle>
            {currentQuestion.support_text && <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">{currentQuestion.support_text}</p>}
          </CardHeader>
          <CardContent>
            <RadioGroup value={currentAnswer === undefined ? '' : String(currentAnswer)} onValueChange={(value) => setAnswers((current) => ({ ...current, [currentQuestion.id]: Number(value) }))} className="space-y-3">
              {options.map((option, index) => (
                <label key={`${currentQuestion.id}-${index}`} htmlFor={`${currentQuestion.id}-${index}`} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${currentAnswer === index ? 'border-primary bg-primary/5 ring-2 ring-primary/10' : 'hover:border-primary/40 hover:bg-muted/40'}`}>
                  <RadioGroupItem value={String(index)} id={`${currentQuestion.id}-${index}`} className="mt-0.5" />
                  <span className="leading-6"><strong className="mr-2 text-primary">{String.fromCharCode(65 + index)}.</strong>{option}</span>
                </label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="mt-6 flex items-center justify-between gap-3">
          <Button variant="outline" onClick={() => questionIndex === 0 ? setPhase('setup') : setQuestionIndex((index) => index - 1)}><ArrowLeft className="mr-2 h-4 w-4" />{t('back')}</Button>
          {isLast ? (
            <Button onClick={finish} disabled={currentAnswer === undefined || loading} className="bg-success text-success-foreground hover:bg-success/90"><CheckCircle2 className="mr-2 h-4 w-4" />{t('finish')}</Button>
          ) : (
            <Button onClick={() => setQuestionIndex((index) => index + 1)} disabled={currentAnswer === undefined}>{t('next')}<ArrowRight className="ml-2 h-4 w-4" /></Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
        <div>
          <Badge variant="outline" className="mb-4 border-secondary/30 bg-secondary/5 text-secondary">{t('diagnosticEyebrow')}</Badge>
          <h1 className="text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">{t('diagnosticTitle')}</h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">{t('diagnosticBody')}</p>
          <div className="mt-7 space-y-3">
            {[
              { icon: ShieldCheck, text: t('heroPrivacy') },
              { icon: BookOpenCheck, text: t('principle2') },
              { icon: ClipboardList, text: t('principle3') },
            ].map(({ icon: Icon, text }) => <div key={text} className="flex items-center gap-3 text-sm"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span>{text}</div>)}
          </div>
        </div>

        <Card className="border-primary/15 shadow-xl shadow-primary/5">
          <CardContent className="space-y-6 p-6 sm:p-8">
            <div className="space-y-3">
              <Label>{t('grade')}</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                {[['5', t('grade5')], ['9', t('grade9')]].map(([value, label]) => (
                  <button key={value} type="button" onClick={() => setGrade(value)} className={`rounded-2xl border p-4 text-left transition ${grade === value ? 'border-primary bg-primary/5 ring-2 ring-primary/10' : 'hover:border-primary/40'}`}>
                    <span className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">{value}º</span><span className="text-sm font-semibold leading-5">{label}</span></span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="school-code">{t('schoolCode')}</Label>
                <Input id="school-code" value={schoolCode} onChange={(event) => setSchoolCode(sanitizeCode(event.target.value))} placeholder="ESC-01" autoComplete="off" />
                <p className="text-xs leading-5 text-muted-foreground">{t('schoolCodeHelp')}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="class-code">{t('classCode')}</Label>
                <Input id="class-code" value={classCode} onChange={(event) => setClassCode(sanitizeCode(event.target.value))} placeholder="5A-01" autoComplete="off" />
                <p className="text-xs leading-5 text-muted-foreground">{t('classCodeHelp')}</p>
              </div>
            </div>

            <div className={`rounded-2xl border p-4 ${available.questions.length ? 'border-success/30 bg-success/5' : 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30'}`}>
              {available.questions.length ? (
                <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-success" /><p className="text-sm font-semibold">{t('questionsAvailable', { count: available.questions.length })}</p></div>
              ) : (
                <div className="flex items-start gap-3"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" /><div><p className="font-semibold">{t('noQuestionsTitle')}</p><p className="mt-1 text-sm text-muted-foreground">{t('noQuestionsBody')}</p><Button asChild variant="link" className="mt-2 h-auto p-0 text-amber-800 dark:text-amber-300"><Link to="/admin"><Settings2 className="mr-2 h-4 w-4" />{t('goManage')}</Link></Button></div></div>
              )}
            </div>

            <Button size="lg" className="h-12 w-full" onClick={begin} disabled={!schoolCode || !classCode || available.questions.length === 0}>
              <GraduationCap className="mr-2 h-5 w-5" />{t('start')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
