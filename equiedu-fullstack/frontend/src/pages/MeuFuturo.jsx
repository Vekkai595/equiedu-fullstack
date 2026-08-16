import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, Compass, AlertCircle } from 'lucide-react';

const interestQuestions = [
  { id: 'subjects', text: 'Quais assuntos mais te interessam?', options: ['Tecnologia e computadores', 'Natureza e biologia', 'Números e cálculos', 'Arte e criação', 'Comunicação e escrita', 'Saúde e corpo humano', 'Construir e consertar', 'Pessoas e sociedade', 'Esportes e movimento', 'Pesquisa e experimentos'] },
  { id: 'school', text: 'Quais matérias escolares você mais gosta?', options: ['Matemática', 'Português', 'Ciências', 'História', 'Geografia', 'Inglês', 'Educação Física', 'Artes', 'Física', 'Química', 'Biologia'] },
  { id: 'activities', text: 'Que tipo de atividade você prefere?', options: ['Resolver problemas lógicos', 'Criar coisas novas', 'Ajudar pessoas', 'Trabalhar com tecnologia', 'Pesquisar e descobrir', 'Organizar e planejar', 'Apresentar e comunicar', 'Trabalhar em equipe', 'Trabalhar de forma independente'] },
  { id: 'skills', text: 'Quais habilidades deseja desenvolver?', options: ['Programação', 'Liderança', 'Comunicação', 'Criatividade', 'Raciocínio lógico', 'Trabalho em equipe', 'Inglês', 'Design', 'Escrita', 'Organização'] },
  { id: 'environment', text: 'Que ambiente de trabalho te atrai?', options: ['Escritório', 'Laboratório', 'Ao ar livre', 'Hospital/clínica', 'Escola', 'Estúdio criativo', 'Home office', 'Fábrica/oficina', 'Palco/eventos'] },
];

const careerMap = {
  'Programação': { desc: 'Criar softwares, aplicativos e sistemas', competencies: 'Lógica, resolução de problemas, pensamento abstrato', subjects: 'Matemática, Lógica, Inglês', paths: 'Ciência da Computação, Engenharia de Software, Análise de Sistemas', intro: 'Scratch, Code.org, Khan Academy', ods: 'ODS 4, ODS 8, ODS 9' },
  'Engenharia': { desc: 'Projetar, construir e melhorar sistemas, máquinas e estruturas', competencies: 'Matemática, física, criatividade, resolução de problemas', subjects: 'Matemática, Física, Química', paths: 'Engenharia Civil, Mecânica, Elétrica, de Produção', intro: 'Khan Academy - Física, Mundo da Engenharia', ods: 'ODS 4, ODS 9, ODS 11' },
  'Robótica': { desc: 'Desenvolver robôs e sistemas automatizados', competencies: 'Programação, eletrônica, mecânica, trabalho em equipe', subjects: 'Matemática, Física, Tecnologia', paths: 'Engenharia Mecatrônica, Automação, Ciência da Computação', intro: 'TBR, FIRST, Arduino', ods: 'ODS 4, ODS 8, ODS 9' },
  'Educação': { desc: 'Ensinar, orientar e facilitar o aprendizado', competencies: 'Comunicação, paciência, criatividade, empatia', subjects: 'Português, Pedagogia, Psicologia', paths: 'Pedagogia, Licenciaturas, Educação Especial', intro: 'Voluntariado educacional, monitoria', ods: 'ODS 4, ODS 10' },
  'Medicina': { desc: 'Cuidar da saúde e bem-estar das pessoas', competencies: 'Biologia, empatia, raciocínio clínico', subjects: 'Biologia, Química, Física', paths: 'Medicina, Enfermagem, Fisioterapia, Biomedicina', intro: 'Olimpíada Brasileira de Biologia, cursos de primeiros socorros', ods: 'ODS 3, ODS 4' },
  'Design': { desc: 'Criar soluções visuais, produtos e experiências', competencies: 'Criatividade, senso estético, tecnologia', subjects: 'Artes, Geometria, Tecnologia', paths: 'Design Gráfico, UX/UI, Design de Produto', intro: 'Canva, Figma (gratuito), cursos de desenho', ods: 'ODS 4, ODS 8, ODS 12' },
  'Meio Ambiente': { desc: 'Proteger a natureza e promover a sustentabilidade', competencies: 'Biologia, geografia, pensamento sistêmico', subjects: 'Biologia, Geografia, Química', paths: 'Engenharia Ambiental, Biologia, Gestão Ambiental', intro: 'Projetos de reciclagem, horta escolar', ods: 'ODS 4, ODS 12, ODS 13, ODS 15' },
  'Comunicação': { desc: 'Criar conteúdo, informar e conectar pessoas', competencies: 'Escrita, oralidade, criatividade, senso crítico', subjects: 'Português, Inglês, Artes', paths: 'Jornalismo, Publicidade, Relações Públicas', intro: 'Blog, rádio escolar, jornal estudantil', ods: 'ODS 4, ODS 16' },
  'Ciência de Dados': { desc: 'Analisar dados para tomar melhores decisões', competencies: 'Estatística, programação, pensamento analítico', subjects: 'Matemática, Estatística, Informática', paths: 'Estatística, Ciência de Dados, Matemática Aplicada', intro: 'Excel, Google Sheets, Khan Academy - Estatística', ods: 'ODS 4, ODS 8, ODS 9' },
  'Pesquisa': { desc: 'Investigar fenômenos e gerar conhecimento novo', competencies: 'Curiosidade, método científico, escrita', subjects: 'Ciências, Matemática, Metodologia', paths: 'Iniciação Científica, Mestrado, Doutorado', intro: 'Feiras de ciências, olimpíadas científicas', ods: 'ODS 4, ODS 9' },
  'Administração': { desc: 'Gerenciar negócios, equipes e recursos', competencies: 'Liderança, organização, comunicação, finanças', subjects: 'Matemática, Português, Sociologia', paths: 'Administração, Economia, Contabilidade', intro: 'Empresa júnior, simuladores de negócios', ods: 'ODS 4, ODS 8' },
  'Carreiras Técnicas': { desc: 'Atuar com habilidades práticas especializadas', competencies: 'Habilidade manual, precisão, conhecimento técnico', subjects: 'Matemática, Física, Tecnologia', paths: 'Cursos técnicos em diversas áreas', intro: 'SENAI, SENAC, Institutos Federais', ods: 'ODS 4, ODS 8' },
};

function getRecommendations(answers) {
  const scores = {};
  Object.keys(careerMap).forEach(c => scores[c] = 0);
  
  const mapping = {
    'Tecnologia e computadores': ['Programação', 'Robótica', 'Ciência de Dados'],
    'Números e cálculos': ['Engenharia', 'Ciência de Dados', 'Administração'],
    'Natureza e biologia': ['Meio Ambiente', 'Medicina', 'Pesquisa'],
    'Arte e criação': ['Design', 'Comunicação'],
    'Comunicação e escrita': ['Comunicação', 'Educação'],
    'Saúde e corpo humano': ['Medicina'],
    'Construir e consertar': ['Engenharia', 'Robótica', 'Carreiras Técnicas'],
    'Pessoas e sociedade': ['Educação', 'Administração'],
    'Pesquisa e experimentos': ['Pesquisa', 'Ciência de Dados'],
    'Matemática': ['Engenharia', 'Ciência de Dados', 'Programação'],
    'Ciências': ['Pesquisa', 'Meio Ambiente', 'Medicina'],
    'Inglês': ['Comunicação'],
    'Artes': ['Design', 'Comunicação'],
    'Física': ['Engenharia', 'Robótica'],
    'Química': ['Medicina', 'Meio Ambiente'],
    'Biologia': ['Medicina', 'Meio Ambiente'],
    'Resolver problemas lógicos': ['Programação', 'Engenharia', 'Ciência de Dados'],
    'Criar coisas novas': ['Design', 'Engenharia', 'Robótica'],
    'Ajudar pessoas': ['Educação', 'Medicina'],
    'Trabalhar com tecnologia': ['Programação', 'Robótica', 'Ciência de Dados'],
    'Programação': ['Programação', 'Robótica', 'Ciência de Dados'],
    'Criatividade': ['Design', 'Comunicação'],
    'Liderança': ['Administração'],
    'Laboratório': ['Pesquisa', 'Medicina', 'Meio Ambiente'],
    'Escritório': ['Administração', 'Programação'],
    'Ao ar livre': ['Meio Ambiente', 'Engenharia'],
    'Fábrica/oficina': ['Engenharia', 'Carreiras Técnicas', 'Robótica'],
    'Hospital/clínica': ['Medicina'],
    'Escola': ['Educação'],
    'Estúdio criativo': ['Design', 'Comunicação'],
  };

  Object.values(answers).flat().forEach(a => {
    (mapping[a] || []).forEach(c => scores[c] += 1);
  });

  return Object.entries(scores).sort((a, b) => b[1] - a[1]).filter(([, s]) => s > 0).slice(0, 4).map(([c]) => c);
}

export default function MeuFuturo() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  const q = interestQuestions[step];

  const handleCheck = (opt, checked) => {
    setAnswers(prev => {
      const cur = prev[q.id] || [];
      return { ...prev, [q.id]: checked ? [...cur, opt] : cur.filter(o => o !== opt) };
    });
  };

  const handleFinish = () => {
    setResults(getRecommendations(answers));
  };

  if (results) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <Compass className="h-12 w-12 text-secondary mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2">Áreas recomendadas para você</h1>
          <p className="text-muted-foreground">Com base nos seus interesses, estas áreas podem combinar com seu perfil.</p>
        </div>

        <Card className="border-amber-200 bg-amber-50/50 mb-8">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800">Esta ferramenta oferece apenas uma orientação inicial. Ela não define sua profissão.</p>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {results.map((career, i) => {
            const info = careerMap[career];
            return (
              <Card key={career} className="overflow-hidden">
                <CardHeader className="bg-muted/30 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{i + 1}</div>
                    <div>
                      <CardTitle className="text-lg">{career}</CardTitle>
                      <p className="text-sm text-muted-foreground">{info.desc}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 grid gap-3 sm:grid-cols-2">
                  <div><p className="text-xs font-semibold text-muted-foreground mb-1">Competências importantes</p><p className="text-sm">{info.competencies}</p></div>
                  <div><p className="text-xs font-semibold text-muted-foreground mb-1">Matérias relacionadas</p><p className="text-sm">{info.subjects}</p></div>
                  <div><p className="text-xs font-semibold text-muted-foreground mb-1">Caminhos de formação</p><p className="text-sm">{info.paths}</p></div>
                  <div><p className="text-xs font-semibold text-muted-foreground mb-1">Cursos introdutórios</p><p className="text-sm">{info.intro}</p></div>
                  <div className="sm:col-span-2"><p className="text-xs font-semibold text-muted-foreground mb-1">Relação com as ODS</p><div className="flex gap-1">{info.ods.split(', ').map(o => <Badge key={o} variant="outline" className="text-xs">{o}</Badge>)}</div></div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" onClick={() => { setResults(null); setStep(0); setAnswers({}); }}>Refazer questionário</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2">Meu Futuro</h1>
        <p className="text-muted-foreground">Descubra áreas que combinam com seus interesses e habilidades.</p>
      </div>

      <p className="text-sm text-muted-foreground mb-4">Etapa {step + 1} de {interestQuestions.length}</p>

      <Card>
        <CardHeader><CardTitle className="text-lg">{q.text}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {q.options.map(opt => (
            <div key={opt} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
              <Checkbox id={`${q.id}-${opt}`} checked={(answers[q.id] || []).includes(opt)} onCheckedChange={c => handleCheck(opt, c)} />
              <Label htmlFor={`${q.id}-${opt}`} className="cursor-pointer flex-1">{opt}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0}><ArrowLeft className="mr-2 h-4 w-4" /> Anterior</Button>
        {step < interestQuestions.length - 1 ? (
          <Button onClick={() => setStep(s => s + 1)} disabled={!(answers[q.id]?.length > 0)}>Próxima <ArrowRight className="ml-2 h-4 w-4" /></Button>
        ) : (
          <Button onClick={handleFinish} disabled={!(answers[q.id]?.length > 0)} className="bg-secondary hover:bg-secondary/90">
            <Compass className="mr-2 h-4 w-4" /> Ver resultados
          </Button>
        )}
      </div>
    </div>
  );
}