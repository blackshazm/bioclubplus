import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api'; // Nosso serviço de API Axios
import { useNavigate } from 'react-router-dom'; // Para redirecionamento

// --- Tipagem ---
interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  roles: string[];
  referralCode?: string;
  // Adicionar outros campos do usuário que você quer acessíveis globalmente
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  // refreshToken: string | null; // O refresh token pode ser gerenciado internamente ou aqui
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: Record<string, string>)
    => Promise<{ success: boolean; error?: string; fromVerifyEmail?: boolean }>;
  register: (userData: Record<string, string>)
    => Promise<{ success: boolean; error?: string; verificationSent?: boolean }>;
  logout: () => void;
  verifyEmail: (token: string)
    => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string)
    => Promise<{ success: boolean; error?: string }>;
  resetPassword: (token: string, password: string)
    => Promise<{ success: boolean; error?: string; loggedIn?: boolean }>;
  clearError: () => void;
  // Adicionar outras funções como:
  // resendVerificationEmail
  // refreshToken (se a lógica não estiver totalmente encapsulada no api.ts)
}

// --- Contexto ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Provedor do Contexto ---
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    accessToken: localStorage.getItem('accessToken'), // Tenta carregar do localStorage
    // refreshToken: localStorage.getItem('refreshToken'),
    isLoading: true, // Começa como true para verificar o token inicial
    error: null,
  });
  const navigate = useNavigate();

  // Efeito para verificar o token ao carregar a aplicação
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      // const storedRefreshToken = localStorage.getItem('refreshToken'); // Se for usar

      if (token) {
        // Validação do token: pode fazer uma chamada a um endpoint '/me' ou similar
        // ou apenas assumir que o interceptor do api.ts lidará com token expirado.
        // Por simplicidade, vamos tentar buscar dados do usuário se houver token.
        try {
          // Idealmente, ter um endpoint /auth/me para validar o token e obter dados do usuário
          // Simulando uma chamada para /users/me (deve ser criada no backend)
          // Se não tiver /users/me, pode apenas setar isAuthenticated e carregar user do localStorage
          // se ele for salvo lá.
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
             const parsedUser: User = JSON.parse(storedUser);
             setAuthState(prev => ({
                ...prev,
                isAuthenticated: true,
                user: parsedUser,
                accessToken: token,
                isLoading: false,
             }));
          } else {
            // Se não tem usuário no localStorage mas tem token, pode ser um estado inconsistente
            // ou o usuário precisa ser buscado. Por ora, deslogamos para simplificar.
            console.warn("Token encontrado sem usuário no localStorage. Deslogando.");
            await logoutUser(); // Define a função logoutUser abaixo
          }
        } catch (error) {
          console.error('Falha ao validar token inicial:', error);
          await logoutUser(); // Se o token for inválido (ex: api.ts não conseguiu refresh)
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };
    initializeAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executa apenas uma vez ao montar


  const setSession = (accessToken: string, user: User, refreshToken?: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user)); // Salva dados do usuário
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    setAuthState({
      isAuthenticated: true,
      user,
      accessToken,
      // refreshToken: refreshToken || authState.refreshToken,
      isLoading: false,
      error: null,
    });
  };

  const logoutUser = async (shouldNavigate = true) => {
    // TODO: Chamar endpoint /auth/logout no backend se existir e invalidar refresh token no servidor
    // try { await api.post('/auth/logout', { refreshToken: localStorage.getItem('refreshToken') }); } catch (e) { /* ignore */ }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setAuthState({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      // refreshToken: null,
      isLoading: false,
      error: null,
    });
    if (shouldNavigate) navigate('/login');
  };


  // --- Funções de Autenticação ---

  const login = async (credentials: Record<string, string>) => {
    clearError();
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await api.post('/auth/login', credentials);
      const { accessToken, refreshToken, user } = response.data;
      setSession(accessToken, user, refreshToken);
      return { success: true };
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Erro de login';
      setAuthState(prev => ({ ...prev, isLoading: false, error: errorMsg }));
      return { success: false, error: errorMsg };
    }
  };

  const register = async (userData: Record<string, string>) => {
    clearError();
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      await api.post('/auth/register', userData);
      // Após o registro, o usuário precisa verificar o e-mail.
      // Não logamos o usuário automaticamente aqui.
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: true, verificationSent: true };
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Erro no registro';
      setAuthState(prev => ({ ...prev, isLoading: false, error: errorMsg }));
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    logoutUser();
  };

  const verifyEmail = async (token: string) => {
    clearError();
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      await api.get(`/auth/verify-email/${token}`);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      // O usuário pode agora logar. Pode-se até tentar logar automaticamente
      // ou redirecionar para o login com uma mensagem de sucesso.
      return { success: true };
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Erro ao verificar e-mail';
      setAuthState(prev => ({ ...prev, isLoading: false, error: errorMsg }));
      return { success: false, error: errorMsg };
    }
  };

  const forgotPassword = async (email: string) => {
    clearError();
    setAuthState(prev => ({...prev, isLoading: true}));
    try {
        await api.post('/auth/forgot-password', { email });
        setAuthState(prev => ({...prev, isLoading: false}));
        return { success: true };
    } catch (err:any) {
        const errorMsg = err.response?.data?.message || err.message || 'Erro ao solicitar redefinição de senha';
        setAuthState(prev => ({ ...prev, isLoading: false, error: errorMsg }));
        return { success: false, error: errorMsg };
    }
  };

  const resetPassword = async (token: string, password: string) => {
    clearError();
    setAuthState(prev => ({...prev, isLoading: true}));
    try {
        const response = await api.post(`/auth/reset-password/${token}`, { password });
        // Se o backend logar o usuário e retornar tokens após o reset:
        if (response.data.accessToken && response.data.user) {
            const { accessToken, refreshToken, user } = response.data;
            setSession(accessToken, user, refreshToken);
            return { success: true, loggedIn: true };
        }
        // Se não logar automaticamente:
        setAuthState(prev => ({...prev, isLoading: false}));
        return { success: true, loggedIn: false };
    } catch (err:any) {
        const errorMsg = err.response?.data?.message || err.message || 'Erro ao redefinir senha';
        setAuthState(prev => ({ ...prev, isLoading: false, error: errorMsg }));
        return { success: false, error: errorMsg };
    }
  };


  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  // --- Valor do Contexto ---
  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    clearError,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// --- Hook Customizado para usar o Contexto ---
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
