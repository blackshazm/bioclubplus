import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';
import { THEME } from '../../constants';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const { resetPassword, error } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setSuccessMessage('Email de recuperação enviado com sucesso!');
    } catch (err) {
      console.error('Reset password error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Recuperar Senha</Text>
        <Text style={styles.subtitle}>
          Digite seu email para receber as instruções de recuperação de senha
        </Text>

        {error && <Text style={styles.errorText}>{error}</Text>}
        {successMessage && <Text style={styles.successText}>{successMessage}</Text>}

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Button
            title="Enviar"
            onPress={handleResetPassword}            isLoading={loading}
            disabled={!email}
          />

          <Button
            title="Voltar para o login"
            onPress={() => navigation.navigate('Login')}
            variant="secondary"
            style={styles.secondaryButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  content: {
    flex: 1,
    padding: THEME.spacing.large,
    justifyContent: 'center',
  },
  title: {
    fontSize: THEME.fontSize.xlarge,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.small,
    color: THEME.colors.text,
  },
  subtitle: {
    fontSize: THEME.fontSize.medium,
    color: '#666',
    marginBottom: THEME.spacing.large,
  },
  form: {
    gap: THEME.spacing.medium,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: THEME.spacing.medium,
    fontSize: THEME.fontSize.medium,
  },
  errorText: {
    color: THEME.colors.error,
    marginBottom: THEME.spacing.medium,
  },
  successText: {
    color: THEME.colors.primary,
    marginBottom: THEME.spacing.medium,
  },
  secondaryButton: {
    marginTop: THEME.spacing.small,
  },
});

export default ForgotPasswordScreen;
