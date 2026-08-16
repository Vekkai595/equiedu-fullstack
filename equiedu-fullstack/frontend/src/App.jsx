import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';

import MainLayout from '@/components/layout/MainLayout';
import Home from '@/pages/Home';
import Diagnostico from '@/pages/Diagnostico';
import Oportunidades from '@/pages/Oportunidades';
import MeuFuturo from '@/pages/MeuFuturo';
import Materiais from '@/pages/Materiais';
import Laboratorio from '@/pages/Laboratorio';
import Pesquisa from '@/pages/Pesquisa';
import Impacto from '@/pages/Impacto';
import Diario from '@/pages/Diario';
import Organizacao from '@/pages/Organizacao';
import Engenharia from '@/pages/Engenharia';
import Desafio from '@/pages/Desafio';
import Equipe from '@/pages/Equipe';
import Fontes from '@/pages/Fontes';
import Privacidade from '@/pages/Privacidade';
import AcessibilidadePage from '@/pages/Acessibilidade';
import Admin from '@/pages/Admin';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import { I18nProvider } from '@/lib/I18nContext';
import { ThemeProvider } from '@/lib/ThemeContext';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Carregando EquiEdu...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/diagnostico" element={<Diagnostico />} />
        <Route path="/oportunidades" element={<Oportunidades />} />
        <Route path="/meu-futuro" element={<MeuFuturo />} />
        <Route path="/materiais" element={<Materiais />} />
        <Route path="/laboratorio" element={<Laboratorio />} />
        <Route path="/pesquisa" element={<Pesquisa />} />
        <Route path="/impacto" element={<Impacto />} />
        <Route path="/diario" element={<Diario />} />
        <Route path="/organizacao" element={<Organizacao />} />
        <Route path="/engenharia" element={<Engenharia />} />
        <Route path="/desafio" element={<Desafio />} />
        <Route path="/equipe" element={<Equipe />} />
        <Route path="/fontes" element={<Fontes />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/acessibilidade" element={<AcessibilidadePage />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClientInstance}>
            <Router>
              <ScrollToTop />
              <AuthenticatedApp />
            </Router>
            <Toaster />
          </QueryClientProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}

export default App
