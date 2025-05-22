export const APP_NAME = 'BioClubPlus';

export const API_URL = 'https://api.bioclubplus.com';

export const THEME = {
  colors: {
    primary: '#4CAF50',
    secondary: '#2196F3',
    background: '#FFFFFF',
    text: '#000000',
    error: '#FF5252',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
  fontSize: {
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 24,
  },
};

// Cores do aplicativo
export const COLORS = {
  PRIMARY: '#4CAF50',      // Verde principal
  PRIMARY_DARK: '#388E3C', // Verde escuro
  PRIMARY_LIGHT: '#C8E6C9', // Verde claro
  SECONDARY: '#FFC107',    // Amarelo âmbar
  TEXT: '#212121',         // Texto principal
  TEXT_SECONDARY: '#757575', // Texto secundário
  BACKGROUND: '#FFFFFF',   // Fundo branco
  BACKGROUND_LIGHT: '#F5F5F5', // Fundo cinza claro
  BORDER: '#E0E0E0',       // Bordas
  ERROR: '#D32F2F',        // Vermelho para erros
  SUCCESS: '#388E3C',      // Verde para sucesso
  WARNING: '#FFA000',      // Laranja para avisos
  INFO: '#1976D2',         // Azul para informações
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  TRANSPARENT: 'transparent',
};

// Fontes e tipografia
export const FONTS = {
  REGULAR: {
    fontFamily: 'System',
    fontWeight: 'normal',
  },
  MEDIUM: {
    fontFamily: 'System',
    fontWeight: '500',
  },
  BOLD: {
    fontFamily: 'System',
    fontWeight: 'bold',
  },
  SIZES: {
    XSMALL: 10,
    SMALL: 12,
    MEDIUM: 14,
    LARGE: 16,
    XLARGE: 18,
    XXLARGE: 20,
    TITLE: 24,
    SUBTITLE: 18,
  },
};

// Espaçamento
export const SPACING = {
  XSMALL: 4,
  SMALL: 8,
  MEDIUM: 16,
  LARGE: 24,
  XLARGE: 32,
  XXLARGE: 40,
};

// Raios de borda
export const RADIUS = {
  SMALL: 4,
  MEDIUM: 8,
  LARGE: 16,
  ROUND: 50,
};

// Tamanhos de sombra
export const SHADOWS = {
  SMALL: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  MEDIUM: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 4,
  },
  LARGE: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 6,
  },
};

// Status dos Usuários
export const USER_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  INACTIVE: 'inactive',
};

// Níveis de usuários (para o sistema de referência)
export const USER_LEVELS = {
  BRONZE: {
    name: 'Bronze',
    minimumReferrals: 0,
    commissionMultiplier: 1,
  },
  SILVER: {
    name: 'Prata',
    minimumReferrals: 5,
    commissionMultiplier: 1.1,
  },
  GOLD: {
    name: 'Ouro',
    minimumReferrals: 15,
    commissionMultiplier: 1.2,
  },
  PLATINUM: {
    name: 'Platina',
    minimumReferrals: 30,
    commissionMultiplier: 1.3,
  },
};

// Status de Assinatura
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
};

// Status de Pagamento
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// Status de Pedido
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Status de Comissão
export const COMMISSION_STATUS = {
  PENDING: 'pending',
  AVAILABLE: 'available',
  PAID: 'paid',
  CANCELLED: 'cancelled',
};

// Rotas de navegação
export const ROUTES = {
  // Autenticação
  AUTH: 'Auth',
  ONBOARDING: 'Onboarding',
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  
  // Principais
  MAIN: 'Main',
  HOME: 'Home',
  SHOP: 'Shop',
  CART: 'Cart',
  PROFILE: 'Profile',
  CHECKOUT: 'Checkout',
  
  // Assinante
  SUBSCRIPTION: 'Subscription',
  MY_REFERRALS: 'MyReferrals',
  COMMISSIONS: 'Commissions',
  COUPONS: 'Coupons',
  INVITE_FRIENDS: 'InviteFriends',
  
  // Loja
  PRODUCT_DETAIL: 'ProductDetail',
  ORDER_HISTORY: 'OrderHistory',
  ORDER_DETAIL: 'OrderDetail',
  
  // Outros
  SETTINGS: 'Settings',
  HELP: 'Help',
  FAQ: 'FAQ',
};

// Mensagens de erro
export const ERROR_MESSAGES = {
  GENERAL: 'Ocorreu um erro. Por favor, tente novamente.',
  AUTH_FAILED: 'Falha na autenticação. Verifique suas credenciais.',
  NETWORK: 'Erro de conexão. Verifique sua internet.',
  REQUIRED_FIELD: 'Este campo é obrigatório.',
  INVALID_EMAIL: 'Email inválido.',
  INVALID_PASSWORD: 'Senha inválida. A senha deve ter pelo menos 6 caracteres.',
  PASSWORDS_DONT_MATCH: 'As senhas não coincidem.',
  INVALID_CPF: 'CPF inválido.',
  SERVER_ERROR: 'Erro no servidor. Tente novamente mais tarde.',
};

// Configurações de API
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 segundos
  RETRY_ATTEMPTS: 3,
};

// Configurações de notificação
export const NOTIFICATION_TYPES = {
  NEW_REFERRAL: 'new_referral',
  REFERRAL_ACTIVATED: 'referral_activated',
  REFERRAL_DEACTIVATED: 'referral_deactivated',
  PAYMENT_REMINDER: 'payment_reminder',
  NEW_COUPON: 'new_coupon',
  PROMOTION: 'promotion',
  ORDER_STATUS: 'order_status',
};

// Chaves para AsyncStorage
export const STORAGE_KEYS = {
  USER_TOKEN: '@BioClub:user_token',
  USER_DATA: '@BioClub:user_data',
  ONBOARDING_COMPLETE: '@BioClub:onboarding_complete',
  CART_ITEMS: '@BioClub:cart_items',
};

// Strings da aplicação
export const STRINGS = {
  APP_NAME: 'BioClub+',
  
  // Mensagens comuns
  ERROR_DEFAULT: 'Ocorreu um erro. Por favor, tente novamente.',
  SUCCESS_DEFAULT: 'Operação realizada com sucesso!',
  LOADING: 'Carregando...',
  
  // Telas de autenticação
  LOGIN_TITLE: 'Bem-vindo de volta ao BioClub+',
  LOGIN_SUBTITLE: 'Faça login para continuar',
  REGISTER_TITLE: 'Junte-se ao BioClub+',
  REGISTER_SUBTITLE: 'Crie sua conta para começar',
  
  // Textos gerais
  CONTINUE: 'Continuar',
  CANCEL: 'Cancelar',
  SAVE: 'Salvar',
  CONFIRM: 'Confirmar',
  DELETE: 'Excluir',
  BACK: 'Voltar',
  NEXT: 'Próximo',
  
  // Textos de onboarding
  ONBOARDING_TITLE_1: 'Conheça o BioClub+',
  ONBOARDING_DESC_1: 'O melhor clube de assinatura de produtos naturais do Brasil.',
  ONBOARDING_TITLE_2: 'Produtos Naturais',
  ONBOARDING_DESC_2: 'Receba mensalmente os melhores produtos naturais selecionados para você.',
  ONBOARDING_TITLE_3: 'Indique e Ganhe',
  ONBOARDING_DESC_3: 'Indique amigos e ganhe comissões em cada nova assinatura.',
};

// End points da API
export const API = {
  BASE_URL: 'https://api.bioclub.com.br',
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PRODUCTS: '/products',
    SUBSCRIPTIONS: '/subscriptions',
    REFERRALS: '/referrals',
    COMMISSIONS: '/commissions',
    USERS: '/users',
  },
};

// Re-exportar todas as constantes de estilo
export * from './styles';

export default {
  STORAGE_KEYS,
  STRINGS,
  API,
};
