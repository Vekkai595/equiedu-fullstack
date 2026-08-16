import React from 'react';
import { equiedu } from '@/api/equieduClient';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

export default function Organizacao() {
  const { data: members = [] } = useQuery({ queryKey: ['members'], queryFn: () => equiedu.entities.TeamMember.list('order', 50) });
  const { data: meetings = [] } = useQuery({ queryKey: ['meetings'], queryFn: () => equiedu.entities.Meeting.list('-date', 50) });
  const { data: expenses = [] } = useQuery({ queryKey: ['expenses'], queryFn: () => equiedu.entities.Expense.list('-created_date', 100) });

  const totalCost = expenses.reduce((s, e) => s + (e.cost || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2">Organização & Método</h1>
        <p className="text-muted-foreground">Gestão da equipe Falcon Robots — integrantes, reuniões, finanças e planejamento.</p>
      </div>

      {/* Team */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Organograma</CardTitle></CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Aguardando cadastro dos integrantes.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {members.map(m => (
                <div key={m.id} className="p-4 border rounded-lg">
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-sm text-primary">{m.primary_role}</p>
                  {m.secondary_role && <p className="text-xs text-muted-foreground">{m.secondary_role}</p>}
                  {m.responsibilities && <p className="text-xs text-muted-foreground mt-1">{m.responsibilities}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meetings */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" /> Reuniões</CardTitle></CardHeader>
        <CardContent>
          {meetings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhuma reunião registrada.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Participantes</TableHead>
                    <TableHead>Decisões</TableHead>
                    <TableHead>Tarefas</TableHead>
                    <TableHead>Prazos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meetings.map(m => (
                    <TableRow key={m.id}>
                      <TableCell className="whitespace-nowrap">{m.date ? format(new Date(m.date), 'dd/MM/yyyy') : '—'}</TableCell>
                      <TableCell className="text-sm">{m.participants || '—'}</TableCell>
                      <TableCell className="text-sm">{m.decisions || '—'}</TableCell>
                      <TableCell className="text-sm">{m.tasks || '—'}</TableCell>
                      <TableCell className="text-sm">{m.deadlines || '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Finances */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5" /> Gestão Financeira</CardTitle>
          {expenses.length > 0 && <Badge variant="outline">Total: R$ {totalCost.toFixed(2)}</Badge>}
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhuma despesa registrada.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Qtd</TableHead>
                    <TableHead>Custo</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead>Finalidade</TableHead>
                    <TableHead>Obs.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map(e => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.item}</TableCell>
                      <TableCell>{e.quantity || '—'}</TableCell>
                      <TableCell>R$ {(e.cost || 0).toFixed(2)}</TableCell>
                      <TableCell className="text-sm">{e.resource_origin || '—'}</TableCell>
                      <TableCell className="text-sm">{e.purpose || '—'}</TableCell>
                      <TableCell className="text-sm">{e.observations || '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}