import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Database, Trash2, Lock, AlertCircle, ShieldCheck } from 'lucide-react';
import { equiedu } from '@/api/equieduClient';

export default function Privacidade() {
  const clearLocalData = () => {
    const ok = window.confirm('Apagar todos os dados locais do EquiEdu neste navegador?');
    if (!ok) return;
    equiedu.clearEverything();
    alert('Dados locais apagados com sucesso.');
    window.location.reload();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2">Privacidade</h1>
        <p className="text-muted-foreground">Escrita em linguagem simples para que todos possam entender.</p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold mb-1">Armazenamento local do protótipo</p>
            <p className="text-muted-foreground">Nesta versão, os dados são guardados apenas neste navegador. Não há sincronização automática com outros computadores ou celulares.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Database className="h-5 w-5" /> Quais dados armazenamos?</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>O EquiEdu pode armazenar localmente:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Respostas do diagnóstico educacional — <strong>sem nome do estudante</strong></li>
            <li>Códigos de escola e turma criados pela equipe para gerar médias agregadas</li>
            <li>Resultados gerais e por matéria</li>
            <li>Registros do diário de bordo inseridos pela equipe</li>
            <li>Oportunidades, fontes, materiais, reuniões, missões e despesas editadas pela equipe</li>
            <li>Preferências de acessibilidade — armazenadas <strong>apenas no navegador</strong></li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Eye className="h-5 w-5" /> O que NÃO solicitamos dos participantes</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>O fluxo de diagnóstico dos estudantes não pede nome, e-mail, telefone, endereço, localização exata, documentos, informações médicas ou relatos pessoais. Os campos de escola e turma aceitam somente códigos definidos pela equipe.</p>
          <p>Não use nomes de estudantes, professores ou escolas nesses códigos. Um código mal escolhido pode permitir reidentificação.</p>
          <p>A área de login/cadastro, caso mantida, é apenas para testes locais/administrativos da equipe e não deve ser usada como coleta de dados dos participantes da pesquisa.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Lock className="h-5 w-5" /> Resultados anônimos</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>Os resultados do painel são calculados por códigos de turma, matéria e ano. A plataforma usa um ID técnico aleatório apenas para diferenciar aplicações.</p>
          <p>O painel oculta a média de turmas com menos de cinco aplicações. Antes do uso em campo, a equipe ainda deve combinar autorizações, responsabilidades e forma de devolutiva com cada escola.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Trash2 className="h-5 w-5" /> Apagar dados locais</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">Isso apaga diagnósticos, preferências, registros do diário, dados editados e sessões locais salvas neste navegador.</p>
          <Button variant="destructive" onClick={clearLocalData}>
            <Trash2 className="mr-2 h-4 w-4" /> Apagar todos os dados locais
          </Button>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm">
            O EquiEdu é uma plataforma educativa e de pesquisa escolar. Não substitui professores, orientadores, instituições ou profissionais especializados.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
