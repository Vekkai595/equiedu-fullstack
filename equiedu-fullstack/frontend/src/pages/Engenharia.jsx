import React from 'react';
import { equiedu } from '@/api/equieduClient';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Cpu, TestTube, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Engenharia() {
  const { data: versions = [] } = useQuery({ queryKey: ['robot-versions'], queryFn: () => equiedu.entities.RobotVersion.list('date', 50) });
  const { data: missions = [] } = useQuery({ queryKey: ['missions'], queryFn: () => equiedu.entities.Mission.list('-created_date', 50) });

  const reliabilityData = missions.filter(m => m.attempts > 0).map(m => ({
    name: m.name?.length > 15 ? m.name.slice(0, 15) + '…' : m.name,
    taxa: m.attempts > 0 ? Math.round((m.successes / m.attempts) * 100) : 0,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2">Engenharia do Robô</h1>
        <p className="text-muted-foreground">Documentação técnica — estrutura, versões, mecanismos, programação e testes.</p>
        <Card className="mt-4 border-amber-200 bg-amber-50/50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800">Todos os dados apresentados aqui foram cadastrados pela equipe. Nenhum resultado foi inventado.</p>
          </CardContent>
        </Card>
      </div>

      {/* Versions */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Cpu className="h-5 w-5" /> Versões do Robô</CardTitle></CardHeader>
        <CardContent>
          {versions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Aguardando cadastro das versões do robô.</p>
          ) : (
            <div className="space-y-4">
              {versions.map(v => (
                <div key={v.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <h3 className="font-semibold">Versão {v.version_number}</h3>
                    <Badge className={v.status === 'ativa' ? 'bg-success/10 text-success' : v.status === 'em_teste' ? 'bg-accent/10 text-accent-foreground' : 'bg-muted text-muted-foreground'}>
                      {v.status === 'ativa' ? 'Ativa' : v.status === 'em_teste' ? 'Em teste' : 'Substituída'}
                    </Badge>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
                    {v.objective && <p><strong>Objetivo:</strong> {v.objective}</p>}
                    {v.changes && <p><strong>Alterações:</strong> {v.changes}</p>}
                    {v.previous_problem && <p><strong>Problema anterior:</strong> {v.previous_problem}</p>}
                    {v.result && <p><strong>Resultado:</strong> {v.result}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tests */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><TestTube className="h-5 w-5" /> Testes por Missão</CardTitle></CardHeader>
        <CardContent>
          {missions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Aguardando cadastro de missões e testes.</p>
          ) : (
            <>
              <div className="overflow-x-auto mb-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Missão</TableHead>
                      <TableHead>Tentativas</TableHead>
                      <TableHead>Sucessos</TableHead>
                      <TableHead>Falhas</TableHead>
                      <TableHead>Taxa</TableHead>
                      <TableHead>Tempo médio</TableHead>
                      <TableHead>Melhor tempo</TableHead>
                      <TableHead>Obs.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {missions.map(m => (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium">{m.name}</TableCell>
                        <TableCell>{m.attempts || 0}</TableCell>
                        <TableCell className="text-success">{m.successes || 0}</TableCell>
                        <TableCell className="text-destructive">{m.failures || 0}</TableCell>
                        <TableCell>{m.attempts > 0 ? `${Math.round((m.successes / m.attempts) * 100)}%` : '—'}</TableCell>
                        <TableCell>{m.avg_time ? `${m.avg_time}s` : '—'}</TableCell>
                        <TableCell>{m.best_time ? `${m.best_time}s` : '—'}</TableCell>
                        <TableCell className="text-sm max-w-[200px] truncate">{m.observations || '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {reliabilityData.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3">Gráfico de Confiabilidade</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={reliabilityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v) => `${v}%`} />
                      <Bar dataKey="taxa" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} name="Taxa de sucesso" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}