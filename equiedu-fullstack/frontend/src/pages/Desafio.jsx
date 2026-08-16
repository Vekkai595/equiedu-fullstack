import React, { useState, useRef, useEffect } from 'react';
import { equiedu } from '@/api/equieduClient';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Play, Pause, RotateCcw, Timer, Target, Plus, CheckCircle } from 'lucide-react';

function Stopwatch() {
  const [time, setTime] = useState(150);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && time > 0) {
      intervalRef.current = setInterval(() => setTime(t => t - 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, time]);

  const mins = Math.floor(time / 60);
  const secs = time % 60;
  const pct = (time / 150) * 100;

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Timer className="h-5 w-5" /> Cronômetro — 2min30s</CardTitle></CardHeader>
      <CardContent className="text-center">
        <div className={`text-6xl font-mono font-bold mb-4 ${time <= 10 ? 'text-destructive' : time <= 30 ? 'text-accent' : 'text-foreground'}`}>
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden mb-4">
          <div className={`h-full rounded-full transition-all ${time <= 10 ? 'bg-destructive' : time <= 30 ? 'bg-accent' : 'bg-secondary'}`} style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-center gap-3">
          <Button onClick={() => setRunning(!running)} variant={running ? 'destructive' : 'default'}>
            {running ? <><Pause className="mr-2 h-4 w-4" /> Pausar</> : <><Play className="mr-2 h-4 w-4" /> Iniciar</>}
          </Button>
          <Button variant="outline" onClick={() => { setRunning(false); setTime(150); }}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reiniciar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ScoreSimulator() {
  const { data: missions = [] } = useQuery({ queryKey: ['missions'], queryFn: () => equiedu.entities.Mission.list('-created_date', 50) });
  const [selected, setSelected] = useState({});

  const total = missions.reduce((s, m) => s + (selected[m.id] ? (m.max_score || 0) : 0), 0);

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" /> Simulador de Pontuação</CardTitle></CardHeader>
      <CardContent>
        {missions.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">Cadastre missões para usar o simulador.</p>
        ) : (
          <>
            <div className="space-y-2 mb-4">
              {missions.map(m => (
                <div key={m.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant={selected[m.id] ? 'default' : 'outline'} className="h-8 w-8" onClick={() => setSelected(p => ({ ...p, [m.id]: !p[m.id] }))}>
                      {selected[m.id] ? <CheckCircle className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </Button>
                    <span className="text-sm font-medium">{m.name}</span>
                  </div>
                  <Badge variant="outline">{m.max_score || 0} pts</Badge>
                </div>
              ))}
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Pontuação simulada</p>
              <p className="text-4xl font-bold font-heading text-primary">{total}</p>
              <p className="text-xs text-muted-foreground mt-1">pontos</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function Desafio() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2">Desafio Prático</h1>
        <p className="text-muted-foreground">Planejamento das missões, simulador de pontuação e cronômetro de treino.</p>
        <Card className="mt-4 border-amber-200 bg-amber-50/50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800">Este painel auxilia os treinamentos. A pontuação oficial é determinada pela arbitragem da TBR.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Stopwatch />
        <ScoreSimulator />
      </div>
    </div>
  );
}