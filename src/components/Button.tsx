import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle, 
  TouchableOpacityProps 
} from 'react-native';
import { COLORS, FONTS } from '../constants/styles';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  ...props
}) => {
  // Definir estilos com base na variante
  const getContainerStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? COLORS.gray : COLORS.primary,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? COLORS.lightGray : COLORS.secondary,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? COLORS.gray : COLORS.primary,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
          paddingHorizontal: 0,
        };
      default:
        return {
          backgroundColor: disabled ? COLORS.gray : COLORS.primary,
          borderWidth: 0,
        };
    }
  };

  // Definir estilos de texto com base na variante
  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          color: COLORS.white,
        };
      case 'secondary':
        return {
          color: COLORS.white,
        };
      case 'outline':
        return {
          color: disabled ? COLORS.gray : COLORS.primary,
        };
      case 'text':
        return {
          color: disabled ? COLORS.gray : COLORS.primary,
        };
      default:
        return {
          color: COLORS.white,
        };
    }
  };

  // Definir altura com base no tamanho
  const getHeightBySize = () => {
    switch (size) {
      case 'small':
        return 36;
      case 'medium':
        return 48;
      case 'large':
        return 56;
      default:
        return 48;
    }
  };

  // Definir tamanho do texto com base no tamanho do botão
  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'medium':
        return 16;
      case 'large':
        return 18;
      default:
        return 16;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        getContainerStyle(),
        { height: getHeightBySize() },
        disabled || isLoading ? styles.disabled : {},
        style,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'text' ? COLORS.primary : COLORS.white}
          size="small"
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text
            style={[
              styles.text,
              getTextStyle(),
              { fontSize: getFontSize() },
              leftIcon || rightIcon ? styles.textWithIcon : {},
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
  },  text: {
    fontFamily: 'System',
    fontWeight: '600',
    textAlign: 'center',
  },
  textWithIcon: {
    marginHorizontal: 8,
  },
  disabled: {
    opacity: 0.7,
  },
});

export default Button;
