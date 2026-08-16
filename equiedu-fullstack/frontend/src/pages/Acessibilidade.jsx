import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accessibility, Check, AlertCircle } from 'lucide-react';

const features = [
  'Aumentar e diminuir tamanho da fonte',
  'Modo de alto contraste',
  'Modo claro e modo escuro',
  'Espaçamento de linhas ampliado',
  'Fonte de maior legibilidade (Verdana)',
  'Redução de animações',
  'Destaque visual de links',
  'Navegação por teclado',
  'Foco visível em elementos interativos',
  'Textos alternativos em imagens',
  'Leitura em voz alta (quando suportada pelo navegador)',
  'Botões com tamanho mínimo acessível',
  'Linguagem simples e direta',
  'Design responsivo para todos os dispositivos',
  'Pular para o conteúdo principal',
];

export default function AcessibilidadePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Accessibility className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-3">Acessibilidade</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          O EquiEdu foi desenvolvido com recursos de acessibilidade e permanece em processo contínuo de testes e melhorias.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recursos disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {features.map(f => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <Check className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Boas práticas seguidas</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>O desenvolvimento segue recomendações das <strong>Diretrizes de Acessibilidade para Conteúdo Web (WCAG)</strong>.</p>
          <p>Utilizamos HTML semântico, ARIA labels, contrastes adequados e estrutura de navegação lógica.</p>
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="p-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">Importante</p>
            <p>Não declaramos que o site é totalmente acessível. A acessibilidade é um processo contínuo e estamos comprometidos em melhorar constantemente com base em testes e feedback dos usuários.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6 text-center">
          <p className="text-sm">
            Utilize o <strong>botão de acessibilidade</strong> no canto inferior direito da tela para ajustar as configurações visuais a qualquer momento.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}