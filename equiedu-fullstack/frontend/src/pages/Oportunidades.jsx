import React, { useState, useEffect } from 'react';
import { equiedu } from '@/api/equieduClient';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, Bookmark, BookmarkCheck, Share2, Search, AlertTriangle, Calendar, MapPin, Clock } from 'lucide-react';
import DemoBadge from '@/components/DemoBadge';
import { format, differenceInDays } from 'date-fns';
import { useI18n } from '@/lib/I18nContext';

const areaLabels = {
  ciencia: 'Ciências', tecnologia: 'Tecnologia', robotica: 'Robótica', matematica: 'Matemática',
  idiomas: 'Idiomas', artes: 'Artes', formacao_profissional: 'Formação Profissional', bolsas: 'Bolsas',
  olimpiadas: 'Olimpíadas', meio_ambiente: 'Meio Ambiente', saude: 'Saúde', comunicacao: 'Comunicação',
  engenharia: 'Engenharia', educacao: 'Educação', outros: 'Outros'
};

const statusLabels = { aberta: 'Inscrições Abertas', encerrada: 'Encerrada', em_breve: 'Em Breve', permanente: 'Permanente' };
const statusColors = { aberta: 'bg-success/10 text-success border-success/20', encerrada: 'bg-muted text-muted-foreground', em_breve: 'bg-accent/10 text-accent-foreground border-accent/20', permanente: 'bg-secondary/10 text-secondary border-secondary/20' };

export default function Oportunidades() {
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [areaFilter, setAreaFilter] = useState('all');
  const [costFilter, setCostFilter] = useState('all');
  const [modalityFilter, setModalityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem('equiedu-saved') || '[]'));

  const { data: opportunities = [], isLoading } = useQuery({
    queryKey: ['opportunities'],
    queryFn: () => equiedu.entities.Opportunity.list('-created_date', 100),
  });

  useEffect(() => {
    localStorage.setItem('equiedu-saved', JSON.stringify(saved));
  }, [saved]);

  const toggleSave = (id) => {
    setSaved(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const shareOpp = async (opp) => {
    const text = `${opp.title} - ${opp.institution || 'EquiEdu'}`;
    if (navigator.share) {
      await navigator.share({ title: opp.title, text, url: opp.official_link || window.location.href });
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  const isOld = (date) => date && differenceInDays(new Date(), new Date(date)) > 90;

  const filtered = opportunities.filter(opp => {
    if (search && !opp.title?.toLowerCase().includes(search.toLowerCase()) && !opp.description?.toLowerCase().includes(search.toLowerCase())) return false;
    if (areaFilter !== 'all' && opp.area !== areaFilter) return false;
    if (costFilter !== 'all' && opp.cost !== costFilter) return false;
    if (modalityFilter !== 'all' && opp.modality !== modalityFilter) return false;
    if (statusFilter !== 'all' && opp.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2">{t('navOpportunities')}</h1>
        <p className="text-muted-foreground">{t('opportunityEmptyHelp')}</p>
      </div>

      <Card className="mb-6 border-amber-300 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/30">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-100">As informações devem ser confirmadas na página oficial da instituição responsável antes de serem marcadas como verificadas.</p>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar oportunidades..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={areaFilter} onValueChange={setAreaFilter}>
          <SelectTrigger><SelectValue placeholder="Área" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as áreas</SelectItem>
            {Object.entries(areaLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={costFilter} onValueChange={setCostFilter}>
          <SelectTrigger><SelectValue placeholder="Custo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="gratuito">Gratuito</SelectItem>
            <SelectItem value="pago">Pago</SelectItem>
            <SelectItem value="parcialmente_gratuito">Parcialmente gratuito</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {Object.entries(statusLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <Card key={i} className="h-64 animate-pulse bg-muted" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-medium">{t('opportunityEmpty')}</p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">{t('opportunityEmptyHelp')}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(opp => (
            <Card key={opp.id} className="flex flex-col hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    {opp.is_demo && <DemoBadge className="mb-2" />}
                    <CardTitle className="text-base">{opp.title}</CardTitle>
                    {opp.institution && <p className="text-sm text-muted-foreground mt-1">{opp.institution}</p>}
                  </div>
                  <Badge className={`text-xs flex-shrink-0 ${statusColors[opp.status] || ''}`}>
                    {statusLabels[opp.status] || opp.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {opp.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{opp.description}</p>}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <Badge variant="outline" className="text-xs">{areaLabels[opp.area] || opp.area}</Badge>
                  {opp.cost === 'gratuito' && <Badge className="bg-success/10 text-success text-xs">Gratuito</Badge>}
                  {opp.modality && <Badge variant="outline" className="text-xs capitalize">{opp.modality}</Badge>}
                </div>
                <div className="text-xs text-muted-foreground space-y-1 mb-4">
                  {opp.region && <p className="flex items-center gap-1"><MapPin className="h-3 w-3" />{opp.region}</p>}
                  {opp.close_date && <p className="flex items-center gap-1"><Calendar className="h-3 w-3" />Até {format(new Date(opp.close_date), "dd/MM/yyyy")}</p>}
                  {opp.last_verified && isOld(opp.last_verified) && (
                    <p className="flex items-center gap-1 text-amber-600"><Clock className="h-3 w-3" />Esta oportunidade pode estar desatualizada. Confirme no site oficial.</p>
                  )}
                </div>
                <div className="flex gap-2 mt-auto">
                  {opp.official_link && (
                    <Button size="sm" asChild className="flex-1">
                      <a href={opp.official_link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1 h-3.5 w-3.5" /> Acessar
                      </a>
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => toggleSave(opp.id)} aria-label={saved.includes(opp.id) ? 'Remover dos salvos' : 'Salvar'}>
                    {saved.includes(opp.id) ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => shareOpp(opp)} aria-label="Compartilhar">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
