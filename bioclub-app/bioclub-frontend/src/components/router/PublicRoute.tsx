import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Ajuste o caminho se necessário

const PublicRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Pode mostrar um spinner de tela cheia aqui
    return <div>Verificando autenticação...</div>; // Placeholder
  }

  if (isAuthenticated) {
    // Redireciona para o dashboard se o usuário já estiver autenticado
    // Evita que usuários logados acessem páginas como login/registro novamente
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />; // Renderiza o componente filho (rota pública)
};

export default PublicRoute;
