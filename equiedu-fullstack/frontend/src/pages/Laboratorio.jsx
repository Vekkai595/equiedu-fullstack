import React from 'react';
import { equiedu } from '@/api/equieduClient';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Recycle, Clock, Users, ShieldCheck } from 'lucide-react';
import DemoBadge from '@/components/DemoBadge';

export default function Laboratorio() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['sustainable-projects'],
    queryFn: () => equiedu.entities.SustainableProject.list('-created_date', 50),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
            <Recycle className="h-6 w-6 text-success" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold">Laboratório Sustentável</h1>
            <p className="text-muted-foreground">Projetos pedagógicos com materiais reaproveitados.</p>
          </div>
        </div>
        <Card className="border-success/20 bg-success/5">
          <CardContent className="p-4 flex items-start gap-3">
            <Recycle className="h-5 w-5 text-success flex-shrink-0" />
            <p className="text-sm">Estes projetos promovem a <strong>ODS 12 — Consumo e Produção Responsáveis</strong>, transformando materiais reutilizáveis em recursos educativos.</p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{[1,2,3].map(i => <Card key={i} className="h-64 animate-pulse bg-muted" />)}</div>
      ) : projects.length === 0 ? (
        <Card className="p-12 text-center">
          <Recycle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Aguardando cadastro de projetos sustentáveis.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(p => (
            <Card key={p.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                {p.is_demo && <DemoBadge className="mb-2" />}
                <CardTitle className="text-lg">{p.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div><p className="text-xs font-semibold text-muted-foreground mb-1">Objetivo</p><p className="text-sm">{p.objective}</p></div>
                {p.materials && <div><p className="text-xs font-semibold text-muted-foreground mb-1">Materiais</p><p className="text-sm">{p.materials}</p></div>}
                {p.steps && <div><p className="text-xs font-semibold text-muted-foreground mb-1">Etapas</p><p className="text-sm whitespace-pre-line">{p.steps}</p></div>}
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {p.duration && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.duration}</span>}
                  {p.min_age && <span className="flex items-center gap-1"><Users className="h-3 w-3" />A partir de {p.min_age} anos</span>}
                  {p.estimated_cost && <span>Custo: {p.estimated_cost}</span>}
                  {p.reusable && <Badge className="bg-success/10 text-success text-xs">Reutilizável</Badge>}
                </div>
                {p.safety_notes && (
                  <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg">
                    <ShieldCheck className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800">{p.safety_notes}</p>
                  </div>
                )}
                {p.ods_relation && <p className="text-xs text-success">{p.ods_relation}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}