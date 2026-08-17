import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Logo from '@/components/Logo';
import { Globe2, LogIn, LogOut, Menu, Moon, Sun, UserPlus } from 'lucide-react';
import { useI18n } from '@/lib/I18nContext';
import { useTheme } from '@/lib/ThemeContext';
import { useAuth } from '@/lib/AuthContext';

function LanguageSelect({ compact = false }) {
  const { locale, setLocale, languages, t } = useI18n();

  return (
    <label className="relative flex items-center gap-2">
      <span className="sr-only">{t('language')}</span>

      <Globe2
        className="h-4 w-4 text-muted-foreground"
        aria-hidden="true"
      />

      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value)}
        className={`rounded-lg border border-border bg-background text-foreground outline-none ring-offset-background focus:ring-2 focus:ring-ring ${
          compact
            ? 'h-9 max-w-[112px] px-2 text-xs'
            : 'h-10 w-full px-3 text-sm'
        }`}
        aria-label={t('language')}
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {compact ? language.short : language.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();
  const { t } = useI18n();
  const { theme, toggleTheme } = useTheme();

  const {
    user,
    isAuthenticated,
    isLoadingAuth,
    logout,
  } = useAuth();

  const navItems = [
    { label: t('navHome'), path: '/' },
    { label: t('navDiagnostic'), path: '/diagnostico' },
    { label: t('navOpportunities'), path: '/oportunidades' },
    { label: t('navResults'), path: '/impacto' },
    { label: t('navResearch'), path: '/pesquisa' },
    { label: t('navManage'), path: '/admin' },
  ];

  const navLinkClass = (path) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
      location.pathname === path
        ? 'bg-primary text-primary-foreground shadow-sm'
        : 'text-foreground/70 hover:bg-muted hover:text-foreground'
    }`;

  const handleLogout = async () => {
    await logout(true);
  };

  return (
    <header
      className="sticky top-0 z-40 border-b bg-card/90 backdrop-blur-xl"
      role="banner"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

        <Link
          to="/"
          className="shrink-0"
          aria-label={t('navHome')}
        >
          <Logo size="sm" />
        </Link>

        <nav
          className="hidden items-center gap-1 xl:flex"
          aria-label="Navegação principal"
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={navLinkClass(item.path)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 sm:flex">
          <LanguageSelect compact />

          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t('light') : t('dark')}
            title={theme === 'dark' ? t('light') : t('dark')}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {!isLoadingAuth && (
            <>
              {!isAuthenticated ? (
                <>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      Entrar
                    </Link>
                  </Button>

                  <Button asChild size="sm">
                    <Link to="/register">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Criar conta
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <div className="hidden max-w-[150px] flex-col px-2 lg:flex">
                    <span className="truncate text-xs text-muted-foreground">
                      Conectado como
                    </span>

                    <span className="truncate text-sm font-semibold">
                      @{user?.username || 'usuário'}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                </>
              )}
            </>
          )}
        </div>

        <Sheet
          open={mobileOpen}
          onOpenChange={setMobileOpen}
        >
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden"
              aria-label={t('menu')}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-[300px] p-0"
          >
            <div className="border-b p-5">
              <Logo size="md" />
            </div>

            <div className="border-b p-4 sm:hidden">
              <LanguageSelect />
            </div>

            {!isLoadingAuth && (
              <div className="border-b p-4">
                {!isAuthenticated ? (
                  <div className="grid gap-2">
                    <Button asChild variant="outline">
                      <Link
                        to="/login"
                        onClick={() => setMobileOpen(false)}
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Entrar
                      </Link>
                    </Button>

                    <Button asChild>
                      <Link
                        to="/register"
                        onClick={() => setMobileOpen(false)}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Criar conta
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-xs text-muted-foreground">
                        Conectado como
                      </p>

                      <p className="truncate font-semibold">
                        @{user?.username || 'usuário'}
                      </p>

                      {user?.email && (
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={async () => {
                        setMobileOpen(false);
                        await handleLogout();
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </Button>
                  </div>
                )}
              </div>
            )}

            <nav
              className="space-y-1 p-4"
              aria-label={t('menu')}
            >
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block ${navLinkClass(item.path)}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="border-t p-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : (
                  <Moon className="mr-2 h-4 w-4" />
                )}

                {theme === 'dark' ? t('light') : t('dark')}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
