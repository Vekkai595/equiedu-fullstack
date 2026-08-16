import React, { useState } from 'react';
import { equiedu } from '@/api/equieduClient';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ExternalLink, Clock, BookOpen } from 'lucide-react';
import DemoBadge from '@/components/DemoBadge';

const subjectLabels = { matematica: 'Matemática', ciencias: 'Ciências', tecnologia: 'Tecnologia', robotica: 'Robótica', idiomas: 'Idiomas', orientacao_profissional: 'Orientação Profissional', acessibilidade: 'Acessibilidade', sustentabilidade: 'Sustentabilidade' };
const typeLabels = { texto: 'Texto', resumo: 'Resumo', video: 'Vídeo', infografico: 'Infográfico', atividade: 'Atividade', jogo: 'Jogo', guia: 'Guia', download: 'Download' };
const levelLabels = { fundamental_1: 'Fundamental I', fundamental_2: 'Fundamental II', medio: 'Ensino Médio', todos: 'Todos' };

export default function Materiais() {
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ['materials'],
    queryFn: () => equiedu.entities.Material.list('-created_date', 100),
  });

  const filtered = materials.filter(m => {
    if (search && !m.title?.toLowerCase().includes(search.toLowerCase())) return false;
    if (subjectFilter !== 'all' && m.subject !== subjectFilter) return false;
    if (typeFilter !== 'all' && m.type !== typeFilter) return false;
    if (levelFilter !== 'all' && m.school_level !== levelFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2">Materiais Acessíveis</h1>
        <p className="text-muted-foreground">Biblioteca educativa com materiais organizados por matéria, nível e formato.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger><SelectValue placeholder="Matéria" /></SelectTrigger>
          <SelectContent>{Object.entries(subjectLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}<SelectItem value="all">Todas</SelectItem></SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger><SelectValue placeholder="Formato" /></SelectTrigger>
          <SelectContent>{Object.entries(typeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}<SelectItem value="all">Todos</SelectItem></SelectContent>
        </Select>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger><SelectValue placeholder="Nível" /></SelectTrigger>
          <SelectContent>{Object.entries(levelLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}<SelectItem value="all">Todos</SelectItem></SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3].map(i => <Card key={i} className="h-48 animate-pulse bg-muted" />)}</div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center"><BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">Nenhum material encontrado.</p></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(m => (
            <Card key={m.id} className="flex flex-col hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                {m.is_demo && <DemoBadge className="mb-2" />}
                <CardTitle className="text-base">{m.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {m.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{m.description}</p>}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <Badge variant="outline" className="text-xs">{subjectLabels[m.subject] || m.subject}</Badge>
                  <Badge variant="secondary" className="text-xs">{typeLabels[m.type] || m.type}</Badge>
                  {m.school_level && <Badge variant="outline" className="text-xs">{levelLabels[m.school_level] || m.school_level}</Badge>}
                </div>
                <div className="text-xs text-muted-foreground space-y-1 mb-3">
                  {m.duration && <p className="flex items-center gap-1"><Clock className="h-3 w-3" />{m.duration}</p>}
                  {m.audience && <p>Público: {m.audience}</p>}
                  {m.source && <p>Fonte: {m.source}</p>}
                </div>
                {m.source_url && (
                  <Button size="sm" asChild className="mt-auto">
                    <a href={m.source_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-1 h-3.5 w-3.5" /> Abrir material</a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}