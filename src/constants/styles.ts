import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

// Cores do tema
export const COLORS = {
  // Cores primárias
  primary: '#1E843F', // Verde BioClub
  primaryDark: '#136C2E',
  primaryLight: '#4DAD6D',
  
  // Cores secundárias
  secondary: '#ECA400', // Amarelo/Dourado
  secondaryDark: '#C98C00',
  secondaryLight: '#FFB833',
  
  // Cores neutras
  white: '#FFFFFF',
  black: '#000000',
  gray: '#9E9E9E',
  lightGray: '#E0E0E0',
  darkGray: '#616161',
  
  // Cores de status
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
  info: '#2196F3',
  
  // Cores de planos/níveis
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2',
  
  // Cores para background
  background: '#FFFFFF',
  surfaceLight: '#F5F5F5',
  card: '#FFFFFF',
};

// Tipografia
export const FONTS = {
  // Font family
  regular: {
    fontFamily: 'Poppins-Regular',
    fontWeight: 'normal' as 'normal',
  },
  medium: {
    fontFamily: 'Poppins-Medium',
    fontWeight: '500' as '500',
  },
  semiBold: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600' as '600',
  },
  bold: {
    fontFamily: 'Poppins-Bold',
    fontWeight: 'bold' as 'bold',
  },
  
  // Tamanhos
  h1: {
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    lineHeight: 24,
  },
  body1: {
    fontSize: 16,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  small: {
    fontSize: 10,
    lineHeight: 14,
  },
};

// Layout e dimensões
export const SIZES = {
  // app dimensions
  width,
  height,
  
  // Margins & Paddings
  base: 8,
  small: 12,
  medium: 16,
  large: 20,
  extraLarge: 24,
  
  // Border radius
  radiusSmall: 4,
  radiusMedium: 8,
  radiusLarge: 12,
  radiusExtraLarge: 16,
  
  // Elementos específicos
  buttonHeight: 48,
  inputHeight: 48,
  headerHeight: 60,
  tabBarHeight: 60,
};

// Sombras
export const SHADOWS = {
  small: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Estilos gerais para componentes comuns
export const COMMON_STYLES = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.medium,
  },
  cardContainer: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.medium,
    ...SHADOWS.small,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    width: '100%',
    marginVertical: SIZES.small,
  },
};

export default {
  COLORS,
  FONTS,
  SIZES,
  SHADOWS,
  COMMON_STYLES,
};
