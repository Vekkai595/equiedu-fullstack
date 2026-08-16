import React, { useState } from 'react';
import { equiedu } from '@/api/equieduClient';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, ExternalLink, BookOpen } from 'lucide-react';

const typeLabels = { artigo: 'Artigo', relatorio: 'Relatório', site_oficial: 'Site Oficial', livro: 'Livro', lei: 'Lei', video: 'Vídeo', outro: 'Outro' };

export default function Fontes() {
  const [search, setSearch] = useState('');
  const { data: references = [], isLoading } = useQuery({
    queryKey: ['references'],
    queryFn: () => equiedu.entities.Reference.list('-year', 200),
  });

  const filtered = references.filter(r => {
    if (!search) return true;
    const s = search.toLowerCase();
    return r.title?.toLowerCase().includes(s) || r.author?.toLowerCase().includes(s) || r.topic?.toLowerCase().includes(s);
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2">Fontes e Referências</h1>
        <p className="text-muted-foreground">Todas as fontes utilizadas no projeto, com prioridade para fontes oficiais e verificáveis.</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por título, autor ou tema..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Card key={i} className="h-20 animate-pulse bg-muted" />)}</div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhuma fonte cadastrada ainda.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <Card key={r.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{r.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {r.author}{r.year ? ` (${r.year})` : ''}
                    </p>
                    {r.topic && <Badge variant="outline" className="mt-2 text-xs">{r.topic}</Badge>}
                    {r.source_type && <Badge variant="secondary" className="mt-2 ml-1 text-xs">{typeLabels[r.source_type] || r.source_type}</Badge>}
                    {r.usage && <p className="text-xs text-muted-foreground mt-2">{r.usage}</p>}
                  </div>
                  {r.link && (
                    <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 flex-shrink-0">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}