import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  TextInputProps,
  TouchableOpacity
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  isRequired?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  leftIcon,
  rightIcon,
  isPassword = false,
  isRequired = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!isPassword);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, labelStyle]}>
            {label}
            {isRequired && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}
      
      <View 
        style={[
          styles.inputContainer, 
          isFocused ? styles.focusedInput : undefined,
          error ? styles.errorInput : undefined
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            inputStyle,
            leftIcon ? styles.inputWithLeftIcon : undefined,
            (rightIcon || isPassword) ? styles.inputWithRightIcon : undefined
          ]}
          placeholderTextColor={COLORS.TEXT_SECONDARY}
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {isPassword && (
          <TouchableOpacity 
            style={styles.iconContainer} 
            onPress={togglePasswordVisibility}
          >
            <Feather 
              name={isPasswordVisible ? 'eye' : 'eye-off'} 
              size={20} 
              color={COLORS.TEXT_SECONDARY} 
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !isPassword && (
          <View style={styles.iconContainer}>{rightIcon}</View>
        )}
      </View>
      
      {error && (
        <Text style={[styles.errorText, errorStyle]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.MEDIUM,
    width: '100%',
  },
  labelContainer: {
    marginBottom: SPACING.XSMALL,
    flexDirection: 'row',
  },
  label: {
    fontFamily: 'System',
    fontWeight: '500', // valor válido para React Native
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.TEXT,
  },
  required: {
    color: COLORS.ERROR,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: RADIUS.SMALL,
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: SPACING.SMALL,
    height: 48,
  },
  focusedInput: {
    borderColor: COLORS.PRIMARY,
  },
  errorInput: {
    borderColor: COLORS.ERROR,
  },
  input: {
    flex: 1,
    fontFamily: 'System',
    fontWeight: '400', // valor válido para React Native
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.TEXT,
    height: '100%',
    paddingVertical: SPACING.SMALL,
  },
  inputWithLeftIcon: {
    paddingLeft: SPACING.XSMALL,
  },
  inputWithRightIcon: {
    paddingRight: SPACING.XSMALL,
  },
  iconContainer: {
    padding: SPACING.XSMALL,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'System',
    fontWeight: '400', // valor válido para React Native
    fontSize: FONTS.SIZES.SMALL,
    color: COLORS.ERROR,
    marginTop: SPACING.XSMALL,
  },
});

export default Input;
