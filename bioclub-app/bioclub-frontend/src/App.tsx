import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout'; // Será criado no próximo passo
import PrivateRoute from './components/router/PrivateRoute';
import PublicRoute from './components/router/PublicRoute';

// Importar Páginas (placeholders por enquanto, serão criadas depois)
// Páginas de Autenticação
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));
const VerifyEmailPage = React.lazy(() => import('./pages/auth/VerifyEmailPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/auth/ResetPasswordPage'));

// Páginas Protegidas
const DashboardPage = React.lazy(() => import('./pages/dashboard/DashboardPage')); // Exemplo
const ProfilePage = React.lazy(() => import('./pages/user/ProfilePage')); // Exemplo

// Páginas Públicas Gerais
const HomePage = React.lazy(() => import('./pages/public/HomePage')); // Exemplo
const NotFoundPage = React.lazy(() => import('./pages/public/NotFoundPage')); // Exemplo


function App() {
  return (
    <React.Suspense fallback={<div>Carregando página...</div>}> {/* Fallback para React.lazy */}
      <Routes>
        {/* Rotas dentro do MainLayout (com Header/Footer) */}
        <Route element={<MainLayout />}> {/* MainLayout será o wrapper para estas rotas */}

          {/* Rotas Públicas */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          </Route>

          {/* Rotas de verificação são um pouco diferentes, podem ser acessadas logado ou não */}
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />


          {/* Rotas Protegidas */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* Adicionar outras rotas protegidas aqui */}
          </Route>

          {/* Rotas Públicas Gerais (ex: Home) */}
          <Route path="/" element={<HomePage />} />
          {/* Adicionar outras rotas públicas gerais aqui */}


          {/* Rota Catch-all para Not Found (404) */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Rotas que não usam MainLayout (se houver, ex: uma landing page muito diferente) */}
        {/* <Route path="/landing" element={<LandingPage />} /> */}

        {/* Redirecionamento Padrão (opcional) */}
        {/* Se quiser que a raiz "/" redirecione para "/dashboard" se logado, ou "/home" se não.
            Pode ser tratado dentro do HomePage ou com um componente wrapper na rota "/" */}
      </Routes>
    </React.Suspense>
  );
}

export default App;
