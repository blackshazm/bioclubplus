import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// --- Constantes ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// --- Instância Axios ---
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Gerenciamento de Tokens (Simples - para ser integrado com AuthContext) ---
// Estas funções são placeholders e serão substituídas/integradas com o AuthContext
// O AuthContext será o responsável por armazenar e fornecer os tokens.

// Função para obter o token de acesso (do localStorage, por exemplo)
const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Função para obter o refresh token
const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

// Função para definir novos tokens (após um refresh bem-sucedido)
const setNewTokens = (accessToken: string, refreshToken?: string): void => {
  localStorage.setItem('accessToken', accessToken);
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
};

// Função para limpar tokens (logout)
const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};


// --- Interceptor de Requisição ---
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      // Adiciona o token ao header Authorization para todas as rotas, exceto as de refresh token
      if (config.url !== '/auth/refresh-token') {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);


// --- Lógica de Refresh Token ---
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (error?: any) => void }> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- Interceptor de Resposta ---
api.interceptors.response.use(
  response => response, // Se a resposta for bem-sucedida, apenas a retorna
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Verifica se o erro é 401, não é uma tentativa de retry e não é a rota de refresh token
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh-token') {
      if (isRefreshing) {
        // Se já estiver atualizando o token, adiciona a requisição à fila para ser processada depois
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (originalRequest.headers) originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest); // Reenvia a requisição original com o novo token
          })
          .catch(err => {
            return Promise.reject(err); // Se a fila falhar, rejeita
          });
      }

      originalRequest._retry = true; // Marca como tentativa de retry
      isRefreshing = true;

      const currentRefreshToken = getRefreshToken();
      if (!currentRefreshToken) {
        console.error('Refresh token não encontrado, deslogando usuário.');
        clearTokens(); // Limpa tokens
        // TODO: Chamar função de logout do AuthContext para redirecionar para login
        // Ex: authContext.logout();
        window.location.href = '/login'; // Redirecionamento simples por enquanto
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken: currentRefreshToken,
        });

        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken; // O backend pode ou não retornar um novo refresh token

        setNewTokens(newAccessToken, newRefreshToken);

        if (originalRequest.headers) originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken); // Processa a fila com o novo token
        return api(originalRequest); // Reenvia a requisição original
      } catch (refreshError: any) {
        processQueue(refreshError, null); // Processa a fila com erro
        console.error('Falha ao atualizar token:', refreshError.response?.data?.message || refreshError.message);
        clearTokens(); // Limpa tokens
        // TODO: Chamar função de logout do AuthContext
        // Ex: authContext.logout();
        window.location.href = '/login'; // Redirecionamento simples
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Para outros erros, apenas rejeita a promise
    return Promise.reject(error);
  }
);

export default api;

// Exemplo de como o AuthContext poderá usar o api service
/*
import api from './api';

class AuthService {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    // setNewTokens(response.data.accessToken, response.data.refreshToken); // O AuthContext fará isso
    return response.data;
  }

  async register(userData) {
    return api.post('/auth/register', userData);
  }

  // ... outros métodos
}
*/
