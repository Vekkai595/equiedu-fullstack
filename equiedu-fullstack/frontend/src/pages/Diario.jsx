import React, { useState } from 'react';
import { equiedu } from '@/api/equieduClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, BookOpen, Cpu, Code, Users, TestTube, Megaphone, Trophy, ArrowRight, Plus, Save, ClipboardList } from 'lucide-react';

const areaConfig = {
  pesquisa: { label: 'Pesquisa', icon: BookOpen, color: 'bg-primary/10 text-primary' },
  site: { label: 'Site', icon: Code, color: 'bg-secondary/10 text-secondary' },
  robo: { label: 'Robô', icon: Cpu, color: 'bg-accent/10 text-accent-foreground' },
  programacao: { label: 'Programação', icon: Code, color: 'bg-chart-5/10 text-chart-5' },
  gestao: { label: 'Gestão', icon: Users, color: 'bg-success/10 text-success' },
  testes: { label: 'Testes', icon: TestTube, color: 'bg-destructive/10 text-destructive' },
  divulgacao: { label: 'Divulgação', icon: Megaphone, color: 'bg-chart-4/10 text-chart-4' },
  competicao: { label: 'Competição', icon: Trophy, color: 'bg-chart-1/10 text-chart-1' },
};

const blankEntry = () => ({
  date: new Date().toISOString().slice(0, 10),
  area: 'site',
  title: '',
  responsible: 'Falcon Robots',
  description: '',
  problem: '',
  decision: '',
  result: '',
  next_step: '',
});

const formatDateBR = (value) => {
  if (!value) return '—';
  const [y, m, d] = String(value).slice(0, 10).split('-');
  if (!y || !m || !d) return value;
  return `${d}/${m}/${y}`;
};

export default function Diario() {
  const queryClient = useQueryClient();
  const [areaFilter, setAreaFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(blankEntry());
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['diary'],
    queryFn: () => equiedu.entities.DiaryEntry.list('-date', 200),
  });

  const filtered = areaFilter === 'all' ? entries : entries.filter(e => e.area === areaFilter);
  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await equiedu.entities.DiaryEntry.create(form);
    setForm(blankEntry());
    setShowForm(false);
    queryClient.invalidateQueries({ queryKey: ['diary'] });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge className="mb-3 bg-primary/10 text-primary hover:bg-primary/10">Pronto para diário de bordo real</Badge>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2">Diário do Projeto</h1>
          <p className="text-muted-foreground max-w-2xl">Linha do tempo da Falcon Robots — pesquisa, robô, site, testes, decisões e evidências.</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}><Plus className="mr-2 h-4 w-4" /> Novo registro</Button>
      </div>

      <Card className="mb-6 border-secondary/30 bg-secondary/5">
        <CardContent className="p-5 flex items-start gap-3">
          <ClipboardList className="h-5 w-5 text-secondary mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold mb-1">Modelo forte para registrar qualquer dia de projeto:</p>
            <p className="text-muted-foreground">Data → área → problema → decisão → teste/evidência → resultado → próximo passo. Esse formato ajuda a mostrar método científico, engenharia e organização na avaliação.</p>
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <Card className="mb-8">
          <CardHeader><CardTitle className="text-lg">Adicionar registro local</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Data</Label><Input type="date" value={form.date} onChange={(e) => updateField('date', e.target.value)} required /></div>
              <div className="space-y-2"><Label>Área</Label><Select value={form.area} onValueChange={(v) => updateField('area', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(areaConfig).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Título</Label><Input value={form.title} onChange={(e) => updateField('title', e.target.value)} placeholder="Ex.: Teste do mecanismo de precisão" required /></div>
              <div className="space-y-2"><Label>Responsável</Label><Input value={form.responsible} onChange={(e) => updateField('responsible', e.target.value)} /></div>
              <div className="md:col-span-2 space-y-2"><Label>Descrição</Label><Textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} rows={2} placeholder="O que foi feito hoje?" /></div>
              <div className="space-y-2"><Label>Problema / hipótese</Label><Textarea value={form.problem} onChange={(e) => updateField('problem', e.target.value)} rows={3} /></div>
              <div className="space-y-2"><Label>Decisão tomada</Label><Textarea value={form.decision} onChange={(e) => updateField('decision', e.target.value)} rows={3} /></div>
              <div className="space-y-2"><Label>Resultado / evidência</Label><Textarea value={form.result} onChange={(e) => updateField('result', e.target.value)} rows={3} /></div>
              <div className="space-y-2"><Label>Próximo passo</Label><Textarea value={form.next_step} onChange={(e) => updateField('next_step', e.target.value)} rows={3} /></div>
              <div className="md:col-span-2 flex gap-2"><Button type="submit"><Save className="mr-2 h-4 w-4" /> Salvar no backend local</Button><Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button></div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="mb-6">
        <Select value={areaFilter} onValueChange={setAreaFilter}>
          <SelectTrigger className="w-56"><SelectValue placeholder="Filtrar por área" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as áreas</SelectItem>
            {Object.entries(areaConfig).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1,2,3].map(i => <Card key={i} className="h-32 animate-pulse bg-muted" />)}</div>
      ) : sorted.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum registro encontrado.</p>
        </Card>
      ) : (
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden sm:block" />
          <div className="space-y-6">
            {sorted.map((entry) => {
              const config = areaConfig[entry.area] || areaConfig.pesquisa;
              const IconComp = config.icon;
              return (
                <div key={entry.id} className="relative sm:pl-16">
                  <div className={`hidden sm:flex absolute left-0 top-4 w-12 h-12 rounded-full items-center justify-center ${config.color} border-4 border-background z-10`}>
                    <IconComp className="h-5 w-5" />
                  </div>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                        <div>
                          <h3 className="font-semibold text-base">{entry.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDateBR(entry.date)}</span>
                            <Badge className={`text-xs ${config.color}`}>{config.label}</Badge>
                          </div>
                        </div>
                        {entry.responsible && <span className="text-xs text-muted-foreground">{entry.responsible}</span>}
                      </div>
                      {entry.description && <p className="text-sm text-muted-foreground mb-3">{entry.description}</p>}
                      <div className="grid gap-2 sm:grid-cols-2 text-sm">
                        {entry.problem && <div className="p-2 bg-destructive/5 rounded"><span className="text-xs font-medium text-destructive">Problema:</span> <span className="text-muted-foreground">{entry.problem}</span></div>}
                        {entry.decision && <div className="p-2 bg-primary/5 rounded"><span className="text-xs font-medium text-primary">Decisão:</span> <span className="text-muted-foreground">{entry.decision}</span></div>}
                        {entry.result && <div className="p-2 bg-success/5 rounded"><span className="text-xs font-medium text-success">Resultado:</span> <span className="text-muted-foreground">{entry.result}</span></div>}
                        {entry.next_step && <div className="p-2 bg-secondary/5 rounded flex items-start gap-1"><ArrowRight className="h-3.5 w-3.5 text-secondary mt-0.5 flex-shrink-0" /><span className="text-muted-foreground">{entry.next_step}</span></div>}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
