    import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Accessibility, Plus, Minus, Moon, Contrast, Type, MousePointer, Link2, Volume2 } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { useI18n } from '@/lib/I18nContext';

const defaultSettings = {
  fontSize: 100,
  highContrast: false,
  largeSpacing: false,
  readableFont: false,
  reduceMotion: false,
  highlightLinks: false,
  largeButtons: false,
};

export default function AccessibilityPanel() {
  const { theme, setTheme } = useTheme();
  const { locale } = useI18n();
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('equiedu-accessibility');
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('equiedu-accessibility', JSON.stringify(settings));
    const root = document.documentElement;
    root.style.fontSize = `${settings.fontSize}%`;
    root.classList.toggle('high-contrast', settings.highContrast);
    root.classList.toggle('large-spacing', settings.largeSpacing);
    root.classList.toggle('readable-font', settings.readableFont);
    root.classList.toggle('reduce-motion', settings.reduceMotion);
    root.classList.toggle('highlight-links', settings.highlightLinks);
    root.classList.toggle('large-buttons', settings.largeButtons);
  }, [settings]);

  const update = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  const reset = () => {
    setSettings(defaultSettings);
    setTheme('light');
  };

  const speakText = () => {
    if ('speechSynthesis' in window) {
      const text = document.querySelector('main')?.innerText?.slice(0, 1000) || 'Conteúdo não disponível';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = locale;
      utterance.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          aria-label="Abrir painel de acessibilidade"
        >
          <Accessibility className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[340px] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Accessibility className="h-5 w-5" />
            Acessibilidade
          </SheetTitle>
        </SheetHeader>
        <p className="text-xs text-muted-foreground mt-1 mb-6">
          O EquiEdu foi desenvolvido com recursos de acessibilidade e permanece em processo contínuo de testes e melhorias.
        </p>

        <div className="space-y-6">
          {/* Font size */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Type className="h-4 w-4" /> Tamanho da fonte: {settings.fontSize}%
            </label>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => update('fontSize', Math.max(80, settings.fontSize - 10))} aria-label="Diminuir fonte">
                <Minus className="h-4 w-4" />
              </Button>
              <Slider value={[settings.fontSize]} onValueChange={([v]) => update('fontSize', v)} min={80} max={150} step={10} className="flex-1" />
              <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => update('fontSize', Math.min(150, settings.fontSize + 10))} aria-label="Aumentar fonte">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Toggles */}
          {[
            { key: 'highContrast', label: 'Alto contraste', icon: Contrast },
            { key: 'largeSpacing', label: 'Espaçamento de linhas', icon: Type },
            { key: 'readableFont', label: 'Fonte de maior legibilidade', icon: Type },
            { key: 'reduceMotion', label: 'Reduzir animações', icon: MousePointer },
            { key: 'highlightLinks', label: 'Destacar links', icon: Link2 },
            { key: 'largeButtons', label: 'Botões grandes', icon: MousePointer },
          ].map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2 cursor-pointer" htmlFor={key}>
                <Icon className="h-4 w-4" /> {label}
              </label>
              <Switch id={key} checked={settings[key]} onCheckedChange={(v) => update(key, v)} />
            </div>
          ))}

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2 cursor-pointer" htmlFor="darkMode">
              <Moon className="h-4 w-4" /> Modo escuro
            </label>
            <Switch id="darkMode" checked={theme === 'dark'} onCheckedChange={(value) => setTheme(value ? 'dark' : 'light')} />
          </div>

          {/* Read aloud */}
          {'speechSynthesis' in window && (
            <Button variant="outline" className="w-full gap-2" onClick={speakText}>
              <Volume2 className="h-4 w-4" /> Ler conteúdo em voz alta
            </Button>
          )}

          <Button variant="ghost" className="w-full text-muted-foreground" onClick={reset}>
            Restaurar padrão
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
