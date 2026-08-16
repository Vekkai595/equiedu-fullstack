import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpenCheck, CheckCircle2, ClipboardList, GraduationCap, Handshake, Lightbulb, LockKeyhole, School, UsersRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const teacherRequests = [
  'Indicar quais matérias devem compor o diagnóstico do 5º e do 9º ano.',
  'Sugerir habilidades essenciais que representem o aprendizado acumulado em cada etapa.',
  'Fornecer ou revisar questões, alternativas, gabarito e fonte curricular.',
  'Avaliar linguagem, dificuldade, tempo de aplicação e acessibilidade.',
  'Ajudar a interpretar resultados sem rotular estudantes, turmas ou escolas.',
];

const method = [
  { title: '1. Cocriação', text: 'Professores definem o conteúdo e validam o banco de questões. A equipe EquiEdu organiza o formato digital.' },
  { title: '2. Piloto controlado', text: 'Uma aplicação pequena testa clareza, tempo, funcionamento e segurança antes de ampliar o uso.' },
  { title: '3. Aplicação anônima', text: 'Cada resposta usa apenas códigos de escola e turma. O sistema não solicita dados pessoais do estudante.' },
  { title: '4. Análise coletiva', text: 'São calculadas médias por turma, matéria e habilidade. Recortes muito pequenos não devem ser divulgados.' },
  { title: '5. Devolutiva', text: 'A escola recebe resultados compreensíveis e participa da escolha de apoios, materiais e oportunidades.' },
  { title: '6. Continuidade', text: 'Novas aplicações avaliam o processo e fortalecem vínculos duradouros entre SESI, escolas e comunidade.' },
];

export default function Pesquisa() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <Badge variant="outline" className="mb-4 border-primary/25 bg-primary/5 text-primary">Documento vivo · fase de planejamento</Badge>
        <h1 className="text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">Projeto EquiEdu — Educação para Todos</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Construir uma ponte sustentável de equidade educacional: compreender aprendizagens de turmas do 5º e 9º ano, devolver apoio útil às escolas e ampliar o acesso a oportunidades educacionais verificadas.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="border-primary/20">
          <CardHeader><CardTitle className="flex items-center gap-3"><Lightbulb className="h-5 w-5 text-accent" />Pergunta orientadora</CardTitle></CardHeader>
          <CardContent><p className="text-lg italic leading-8 text-muted-foreground">Como uma rede entre SESI, professores, escolas e comunidade pode identificar necessidades de aprendizagem e ampliar oportunidades sem transformar o diagnóstico em ranking ou rótulo?</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-3"><GraduationCap className="h-5 w-5 text-secondary" />Por que 5º e 9º ano?</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p><strong className="text-foreground">5º ano:</strong> conclusão dos Anos Iniciais do Ensino Fundamental (EFAI).</p>
            <p><strong className="text-foreground">9º ano:</strong> conclusão dos Anos Finais do Ensino Fundamental (EFAF).</p>
            <p>O recorte permite observar aprendizagens acumuladas ao final de cada etapa. Ele não substitui avaliações escolares nem define sozinho a qualidade do ensino.</p>
          </CardContent>
        </Card>
      </div>

      <section className="mt-12">
        <div className="flex items-center gap-3"><UsersRound className="h-6 w-6 text-primary" /><h2 className="font-heading text-2xl font-bold">O que será pedido aos professores do SESI</h2></div>
        <p className="mt-2 max-w-3xl text-muted-foreground">A reunião não busca respostas prontas: busca construir critérios pedagógicos com quem conhece currículo, sala de aula e estudantes.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {teacherRequests.map((item) => <div key={item} className="flex gap-3 rounded-2xl border bg-card p-4 text-sm leading-6"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-success" />{item}</div>)}
        </div>
      </section>

      <section className="mt-14">
        <div className="flex items-center gap-3"><ClipboardList className="h-6 w-6 text-primary" /><h2 className="font-heading text-2xl font-bold">Método proposto</h2></div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {method.map((step) => <Card key={step.title}><CardContent className="p-5"><h3 className="font-heading font-bold text-primary">{step.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p></CardContent></Card>)}
        </div>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <Card className="border-success/25 bg-success/5">
          <CardHeader><CardTitle className="flex items-center gap-3"><Handshake className="h-5 w-5 text-success" />Ponte sustentável</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
            <p><strong className="text-foreground">Escutar:</strong> compreender o contexto com professores e escolas parceiras.</p>
            <p><strong className="text-foreground">Agir:</strong> usar as médias para priorizar apoio e indicar oportunidades que façam sentido.</p>
            <p><strong className="text-foreground">Devolver:</strong> compartilhar resultados compreensíveis e materiais úteis, não apenas coletar dados.</p>
            <p><strong className="text-foreground">Continuar:</strong> manter contato, revisar o método e construir novas ações com a comunidade.</p>
          </CardContent>
        </Card>
        <Card className="border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
          <CardHeader><CardTitle className="flex items-center gap-3"><LockKeyhole className="h-5 w-5 text-amber-700 dark:text-amber-400" />Limites e proteção</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>Não coletar nome, e-mail, documento, endereço ou informação sensível do estudante.</p>
            <p>Não divulgar médias de grupos muito pequenos nem produzir ranking entre escolas.</p>
            <p>Definir com responsáveis e escolas as autorizações necessárias antes da aplicação.</p>
            <p>Não apresentar hipótese, protótipo ou dado de teste como resultado comprovado.</p>
          </CardContent>
        </Card>
      </section>

      <Card className="mt-12 overflow-hidden border-primary/20 bg-primary text-primary-foreground">
        <CardContent className="flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:justify-between">
          <div><div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary-foreground/70"><School className="h-4 w-4" />Próximo passo</div><p className="mt-2 max-w-2xl text-lg font-semibold">Receber as contribuições dos professores, cadastrar as questões como rascunho e validar cada item antes do piloto.</p></div>
          <Button asChild size="lg" className="shrink-0 bg-white text-primary hover:bg-white/90"><Link to="/admin"><BookOpenCheck className="mr-2 h-5 w-5" />Abrir gestão<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}
