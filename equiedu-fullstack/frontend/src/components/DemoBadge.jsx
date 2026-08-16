import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

export default function DemoBadge({ className = '' }) {
  return (
    <Badge variant="outline" className={`bg-accent/10 text-accent-foreground border-accent/30 text-xs gap-1 ${className}`}>
      <AlertTriangle className="w-3 h-3" />
      Dado demonstrativo — substituir pelo resultado real da pesquisa
    </Badge>
  );
}