import React, { useMemo, useState } from 'react';
import { equiedu } from '@/api/equieduClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Download, Upload, RotateCcw, Save, Trash2, Plus, Pencil, ShieldCheck } from 'lucide-react';

const entityConfig = {
  QuestionBank: {
    label: 'Banco de questões',
    sort: 'order',
    description: 'Somente questões com status “validada” e ativas aparecem no diagnóstico. Cadastre aqui o material revisado pelos professores.',
    fields: [
      ['order', 'number', 'Ordem'],
      ['grade', 'select', 'Ano escolar', ['5', '9']],
      ['language', 'select', 'Idioma da questão', ['pt-BR', 'gn', 'en', 'es', 'de', 'fr']],
      ['subject', 'text', 'Matéria'],
      ['skill', 'text', 'Habilidade / descritor'],
      ['statement', 'textarea', 'Enunciado'],
      ['support_text', 'textarea', 'Texto de apoio (opcional)'],
      ['options', 'textarea', 'Alternativas — uma por linha'],
      ['correct_index', 'select', 'Número da alternativa correta', ['1', '2', '3', '4', '5', '6']],
      ['source', 'text', 'Fonte / professor responsável pela validação'],
      ['status', 'select', 'Status', ['rascunho', 'em_revisao', 'validada']],
      ['active', 'select', 'Ativa na aplicação?', ['false', 'true']],
      ['notes', 'textarea', 'Observações internas'],
    ],
    empty: { order: 1, grade: '5', language: 'pt-BR', subject: '', skill: '', statement: '', support_text: '', options: '', correct_index: '1', source: '', status: 'rascunho', active: 'false', notes: '' },
  },
  DiaryEntry: {
    label: 'Diário de bordo',
    sort: '-date',
    description: 'Registros de pesquisa, robô, site, programação, testes e apresentação.',
    fields: [
      ['date', 'date', 'Data'],
      ['area', 'select', 'Área', ['pesquisa', 'site', 'robo', 'programacao', 'gestao', 'testes', 'divulgacao', 'competicao']],
      ['title', 'text', 'Título'],
      ['responsible', 'text', 'Responsável'],
      ['description', 'textarea', 'Descrição'],
      ['problem', 'textarea', 'Problema / hipótese'],
      ['decision', 'textarea', 'Decisão tomada'],
      ['result', 'textarea', 'Resultado / evidência'],
      ['next_step', 'textarea', 'Próximo passo'],
    ],
    empty: { date: new Date().toISOString().slice(0, 10), area: 'site', title: '', responsible: 'Falcon Robots', description: '', problem: '', decision: '', result: '', next_step: '' },
  },
  TeamMember: {
    label: 'Integrantes',
    sort: 'order',
    description: 'Organograma e funções reais da equipe.',
    fields: [
      ['order', 'number', 'Ordem'], ['name', 'text', 'Nome'], ['primary_role', 'text', 'Função principal'], ['secondary_role', 'text', 'Função secundária'], ['responsibilities', 'textarea', 'Responsabilidades'],
    ],
    empty: { order: 1, name: '', primary_role: '', secondary_role: '', responsibilities: '' },
  },
  Meeting: {
    label: 'Reuniões', sort: '-date', description: 'Atas curtas de reunião e divisão de tarefas.',
    fields: [['date', 'date', 'Data'], ['participants', 'text', 'Participantes'], ['decisions', 'textarea', 'Decisões'], ['tasks', 'textarea', 'Tarefas'], ['deadlines', 'text', 'Prazos']],
    empty: { date: new Date().toISOString().slice(0, 10), participants: 'Falcon Robots', decisions: '', tasks: '', deadlines: '' },
  },
  Expense: {
    label: 'Finanças', sort: '-created_date', description: 'Custos, origem dos recursos e finalidade.',
    fields: [['item', 'text', 'Item'], ['quantity', 'text', 'Quantidade'], ['cost', 'number', 'Custo'], ['resource_origin', 'text', 'Origem'], ['purpose', 'textarea', 'Finalidade'], ['observations', 'textarea', 'Observações']],
    empty: { item: '', quantity: '1', cost: 0, resource_origin: '', purpose: '', observations: '' },
  },
  Mission: {
    label: 'Missões do robô', sort: '-created_date', description: 'Tentativas, sucessos, falhas, tempo e pontuação.',
    fields: [['name', 'text', 'Nome'], ['max_score', 'number', 'Pontuação máxima'], ['attempts', 'number', 'Tentativas'], ['successes', 'number', 'Sucessos'], ['failures', 'number', 'Falhas'], ['avg_time', 'number', 'Tempo médio (s)'], ['best_time', 'number', 'Melhor tempo (s)'], ['observations', 'textarea', 'Observações']],
    empty: { name: '', max_score: 0, attempts: 0, successes: 0, failures: 0, avg_time: 0, best_time: 0, observations: '' },
  },
  RobotVersion: {
    label: 'Versões do robô', sort: '-date', description: 'Evolução técnica do protótipo.',
    fields: [['version_number', 'text', 'Versão'], ['status', 'select', 'Status', ['planejado', 'em_teste', 'validado', 'substituido']], ['date', 'date', 'Data'], ['objective', 'textarea', 'Objetivo'], ['changes', 'textarea', 'Mudanças'], ['previous_problem', 'textarea', 'Problema anterior'], ['result', 'textarea', 'Resultado']],
    empty: { version_number: '', status: 'em_teste', date: new Date().toISOString().slice(0, 10), objective: '', changes: '', previous_problem: '', result: '' },
  },
  Opportunity: {
    label: 'Oportunidades', sort: '-created_date', description: 'Cursos, olimpíadas, bolsas e programas que vocês validarem.',
    fields: [['title', 'text', 'Título'], ['institution', 'text', 'Instituição'], ['description', 'textarea', 'Descrição'], ['area', 'text', 'Área'], ['cost', 'text', 'Custo'], ['modality', 'select', 'Modalidade', ['online', 'presencial', 'hibrido']], ['status', 'select', 'Status', ['permanente', 'aberto', 'fechado', 'em_breve']], ['region', 'text', 'Região'], ['close_date', 'date', 'Data limite'], ['official_link', 'text', 'Link oficial'], ['last_verified', 'date', 'Última verificação']],
    empty: { title: '', institution: '', description: '', area: '', cost: 'gratuito', modality: 'online', status: 'permanente', region: 'Brasil / Online', close_date: '', official_link: '', last_verified: new Date().toISOString().slice(0, 10), is_demo: false },
  },
  Material: {
    label: 'Materiais', sort: '-created_date', description: 'Guias, aulas e atividades educativas.',
    fields: [['title', 'text', 'Título'], ['description', 'textarea', 'Descrição'], ['subject', 'text', 'Assunto'], ['type', 'text', 'Tipo'], ['school_level', 'text', 'Nível escolar'], ['duration', 'text', 'Duração'], ['audience', 'text', 'Público'], ['source', 'text', 'Fonte'], ['source_url', 'text', 'Link da fonte']],
    empty: { title: '', description: '', subject: '', type: 'guia', school_level: 'fundamental_2', duration: '', audience: '', source: 'EquiEdu / Falcon Robots', source_url: '', is_demo: false },
  },
  Reference: {
    label: 'Fontes', sort: '-year', description: 'Fontes usadas na pesquisa e no site.',
    fields: [['title', 'text', 'Título'], ['author', 'text', 'Autor/instituição'], ['year', 'number', 'Ano'], ['topic', 'text', 'Tema'], ['source_type', 'text', 'Tipo de fonte'], ['usage', 'textarea', 'Como foi usada'], ['link', 'text', 'Link']],
    empty: { title: '', author: '', year: 2026, topic: '', source_type: 'site_oficial', usage: '', link: '' },
  },
  ResearchData: {
    label: 'Dados de pesquisa', sort: '-created_date', description: 'Resultados agregados inseridos manualmente pela equipe.',
    fields: [['label', 'text', 'Indicador'], ['value', 'number', 'Valor'], ['unit', 'text', 'Unidade'], ['notes', 'textarea', 'Observações'], ['source', 'text', 'Origem']],
    empty: { label: '', value: 0, unit: '%', notes: '', source: 'Aplicação interna Falcon Robots' },
  },
};

const entityKeys = Object.keys(entityConfig);

function RecordForm({ entityName, initialData, onCancel, onSaved }) {
  const config = entityConfig[entityName];
  const [form, setForm] = useState(initialData || config.empty);
  const editing = Boolean(initialData?.id);

  const setField = (field, value, type) => {
    setForm((prev) => ({ ...prev, [field]: type === 'number' ? Number(value || 0) : value }));
  };

  const save = async (e) => {
    e.preventDefault();
    if (entityName === 'QuestionBank') {
      const options = String(form.options || '').split(/\r?\n|\s*\|\s*/).map((item) => item.trim()).filter(Boolean);
      const correctIndex = Number(form.correct_index);
      if (!form.subject?.trim() || !form.statement?.trim()) {
        alert('Preencha matéria e enunciado.');
        return;
      }
      if (options.length < 2) {
        alert('Insira pelo menos duas alternativas, uma por linha.');
        return;
      }
      if (correctIndex < 1 || correctIndex > options.length) {
        alert('A alternativa correta precisa existir na lista.');
        return;
      }
    }
    if (editing) await equiedu.entities[entityName].update(initialData.id, form);
    else await equiedu.entities[entityName].create(form);
    onSaved();
  };

  return (
    <form onSubmit={save} className="space-y-4 border rounded-xl p-4 bg-muted/20">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold">{editing ? 'Editar registro' : 'Novo registro'}</h3>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancelar</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {config.fields.map(([field, type, label, options]) => (
          <div key={field} className={type === 'textarea' ? 'md:col-span-2 space-y-2' : 'space-y-2'}>
            <Label htmlFor={`${entityName}-${field}`}>{label}</Label>
            {type === 'textarea' ? (
              <Textarea id={`${entityName}-${field}`} value={form[field] || ''} onChange={(e) => setField(field, e.target.value, type)} rows={3} />
            ) : type === 'select' ? (
              <Select value={String(form[field] || options?.[0] || '')} onValueChange={(value) => setField(field, value, type)}>
                <SelectTrigger id={`${entityName}-${field}`}><SelectValue /></SelectTrigger>
                <SelectContent>{options.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
              </Select>
            ) : (
              <Input id={`${entityName}-${field}`} type={type} value={form[field] ?? ''} onChange={(e) => setField(field, e.target.value, type)} />
            )}
          </div>
        ))}
      </div>
      <Button type="submit"><Save className="mr-2 h-4 w-4" /> Salvar</Button>
    </form>
  );
}

function EntityManager({ entityName }) {
  const queryClient = useQueryClient();
  const config = entityConfig[entityName];
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const { data: records = [] } = useQuery({
    queryKey: ['admin-entity', entityName],
    queryFn: () => equiedu.entities[entityName].list(config.sort, 500),
  });

  const refresh = () => {
    setCreating(false);
    setEditing(null);
    queryClient.invalidateQueries({ queryKey: ['admin-entity', entityName] });
    queryClient.invalidateQueries();
  };

  const deleteRecord = async (record) => {
    const ok = window.confirm('Apagar este registro local?');
    if (!ok) return;
    await equiedu.entities[entityName].delete(record.id);
    refresh();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-lg">{config.label}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{records.length} registros</Badge>
            <Button size="sm" onClick={() => { setEditing(null); setCreating(true); }}><Plus className="mr-2 h-4 w-4" /> Novo</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {creating && <RecordForm entityName={entityName} onCancel={() => setCreating(false)} onSaved={refresh} />}
        {editing && <RecordForm entityName={entityName} initialData={editing} onCancel={() => setEditing(null)} onSaved={refresh} />}
        <div className="space-y-3">
          {records.slice(0, 30).map((record) => {
            const title = record.statement || record.title || record.name || record.label || record.item || record.version_number || record.date || record.id;
            const subtitle = record.subject || record.description || record.responsible || record.institution || record.decisions || record.objective || record.notes || '';
            return (
              <div key={record.id} className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium break-words">{title}</p>
                  {subtitle && <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{subtitle}</p>}
                  <p className="text-xs text-muted-foreground mt-1">ID: {record.id}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => { setCreating(false); setEditing(record); }}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteRecord(record)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            );
          })}
          {records.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Nenhum registro ainda.</p>}
          {records.length > 30 && <p className="text-xs text-muted-foreground text-center">Mostrando 30 primeiros registros. Exporte o JSON para ver tudo.</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Admin() {
  const queryClient = useQueryClient();
  const [active, setActive] = useState('QuestionBank');
  const [jsonText, setJsonText] = useState('');
  const snapshot = useMemo(() => equiedu.getAllData(), []);

  const downloadJson = () => {
    const payload = equiedu.getAllData();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `equiedu-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadQuestionTemplate = () => {
    const template = {
      instructions: 'Duplique o objeto dentro de QuestionBank. Mantenha status como rascunho até revisão de um professor. Use uma alternativa por linha no campo options.',
      data: {
        QuestionBank: [{
          id: 'substitua-por-id-unico',
          order: 1,
          grade: '5',
          language: 'pt-BR',
          subject: '[matéria]',
          skill: '[habilidade ou descritor]',
          statement: '[enunciado da questão]',
          support_text: '',
          options: '[alternativa A]\n[alternativa B]\n[alternativa C]\n[alternativa D]',
          correct_index: '1',
          source: '[professor ou fonte que validou]',
          status: 'rascunho',
          active: 'false',
          notes: '',
        }],
      },
    };
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'equiedu-modelo-banco-de-questoes.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      equiedu.importData(parsed);
      setJsonText('');
      queryClient.invalidateQueries();
      alert('Dados importados com sucesso.');
    } catch (err) {
      alert(err.message || 'JSON inválido.');
    }
  };

  const mergeQuestions = async () => {
    try {
      const parsed = JSON.parse(jsonText);
      const incoming = parsed?.data?.QuestionBank || parsed?.QuestionBank;
      if (!Array.isArray(incoming)) throw new Error('O arquivo não contém uma lista QuestionBank.');
      const current = await equiedu.entities.QuestionBank.list('order', 5000);
      const merged = new Map(current.map((item) => [item.id, item]));
      incoming.forEach((item, index) => {
        const id = item.id || `question_imported_${Date.now()}_${index}`;
        merged.set(id, { ...item, id });
      });
      await equiedu.entities.QuestionBank.replace([...merged.values()]);
      setJsonText('');
      queryClient.invalidateQueries();
      alert(`${incoming.length} questão(ões) mesclada(s) com o banco atual.`);
    } catch (err) {
      alert(err.message || 'JSON inválido.');
    }
  };

  const loadJsonFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('O arquivo precisa ter no máximo 5 MB.');
      event.target.value = '';
      return;
    }
    setJsonText(await file.text());
  };

  const resetSeed = () => {
    if (!window.confirm('Isso apaga os dados locais e volta ao estado inicial: banco de questões vazio, sem resultados e sem oportunidades. Continuar?')) return;
    equiedu.resetLocalData({ includeAuth: false });
    queryClient.invalidateQueries();
    window.location.reload();
  };

  const clearAll = () => {
    if (!window.confirm('Apagar todos os dados locais do EquiEdu neste navegador?')) return;
    equiedu.clearEverything();
    queryClient.invalidateQueries();
    window.location.reload();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px] items-start">
        <div>
          <Badge className="mb-3 bg-primary/10 text-primary hover:bg-primary/10">Área da equipe</Badge>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2">Gestão Local do EquiEdu</h1>
          <p className="text-muted-foreground max-w-3xl">
            Cadastre as questões validadas pelos professores, organize oportunidades e materiais e exporte os resultados. Nesta versão, tudo fica somente neste navegador.
          </p>
        </div>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-5 text-sm space-y-2">
            <div className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4 text-primary" /> Modo seguro para apresentação</div>
            <p className="text-muted-foreground">Não envia dados para fora. Para pesquisa real com vários alunos, use exportação/importação ou migre depois para um backend remoto.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Button onClick={downloadJson} variant="outline"><Download className="mr-2 h-4 w-4" /> Exportar backup</Button>
        <Button onClick={downloadQuestionTemplate} variant="outline"><Download className="mr-2 h-4 w-4" /> Modelo de questões</Button>
        <Button onClick={() => setJsonText(JSON.stringify(equiedu.getAllData(), null, 2))} variant="outline"><Database className="mr-2 h-4 w-4" /> Ver JSON atual</Button>
        <Button onClick={resetSeed} variant="outline"><RotateCcw className="mr-2 h-4 w-4" /> Voltar ao início</Button>
        <Button onClick={clearAll} variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Apagar local</Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Upload className="h-5 w-5" /> Importar / editar JSON bruto</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="json-file">Carregar arquivo JSON</Label>
            <Input id="json-file" type="file" accept="application/json,.json" onChange={loadJsonFile} />
          </div>
          <Textarea value={jsonText} onChange={(e) => setJsonText(e.target.value)} rows={6} placeholder="Cole aqui um backup JSON exportado pelo EquiEdu..." />
          <div className="flex flex-wrap gap-2">
            <Button onClick={mergeQuestions} disabled={!jsonText.trim()}><Upload className="mr-2 h-4 w-4" /> Mesclar apenas questões</Button>
            <Button onClick={importJson} disabled={!jsonText.trim()} variant="outline"><Upload className="mr-2 h-4 w-4" /> Substituir coleções do backup</Button>
            <Button variant="ghost" onClick={() => setJsonText('')}>Limpar caixa</Button>
          </div>
          <p className="text-xs text-muted-foreground">Use <strong>Mesclar apenas questões</strong> para juntar arquivos recebidos de vários professores. A opção de substituir é indicada somente para restaurar um backup completo.</p>
          <p className="text-xs text-muted-foreground">Versão dos dados: {snapshot.meta?.data_version || equiedu.dataVersion} · Prefixo localStorage: {equiedu.storagePrefix}</p>
        </CardContent>
      </Card>

      <Tabs value={active} onValueChange={setActive} className="space-y-6">
        <TabsList className="flex flex-wrap h-auto justify-start">
          {entityKeys.map((key) => <TabsTrigger key={key} value={key}>{entityConfig[key].label}</TabsTrigger>)}
        </TabsList>
        {entityKeys.map((key) => (
          <TabsContent key={key} value={key}>
            <EntityManager entityName={key} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
