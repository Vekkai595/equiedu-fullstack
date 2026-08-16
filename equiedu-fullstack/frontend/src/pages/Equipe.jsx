import React from 'react';
import { equiedu } from '@/api/equieduClient';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Heart, Trophy, BookOpen, Lightbulb, Handshake } from 'lucide-react';

export default function Equipe() {
  const { data: members = [] } = useQuery({ queryKey: ['members'], queryFn: () => equiedu.entities.TeamMember.list('order', 50) });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Hero */}
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-3">Falcon Robots</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A Falcon Robots utiliza ciência, tecnologia, criatividade e trabalho em equipe para desenvolver soluções capazes de reduzir barreiras e ampliar oportunidades.
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <Badge variant="outline">Middle 2</Badge>
          <Badge variant="outline">TBR 2026</Badge>
        </div>
      </div>

      {/* Mission & Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><Target className="h-5 w-5 text-primary" /> Missão</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Usar a robótica educacional e a tecnologia como ferramentas de pesquisa científica para contribuir com a inclusão, a educação de qualidade e a redução de desigualdades.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><Heart className="h-5 w-5 text-destructive" /> Valores</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Lightbulb className="h-3.5 w-3.5 text-accent" /> Inovação com propósito</li>
              <li className="flex items-center gap-2"><Handshake className="h-3.5 w-3.5 text-secondary" /> Trabalho em equipe</li>
              <li className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5 text-primary" /> Aprendizado contínuo</li>
              <li className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-success" /> Inclusão e respeito</li>
              <li className="flex items-center gap-2"><Trophy className="h-3.5 w-3.5 text-chart-4" /> Transparência nos resultados</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Team members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><Users className="h-5 w-5" /> Integrantes</CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Aguardando cadastro dos integrantes da equipe.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {members.map(m => (
                <div key={m.id} className="p-4 border rounded-xl text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-primary">{m.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-sm text-secondary">{m.primary_role}</p>
                  {m.secondary_role && <p className="text-xs text-muted-foreground">{m.secondary_role}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Season */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><Trophy className="h-5 w-5" /> Temporada 2026</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>Competição:</strong> Torneio Brasil de Robótica — TBR 2026</p>
          <p><strong>Categoria:</strong> Middle 2</p>
          <p><strong>Projeto científico:</strong> EquiEdu — Educação para Todos</p>
          <p><strong>ODS principal:</strong> ODS 4 — Educação de Qualidade</p>
        </CardContent>
      </Card>
    </div>
  );
}
