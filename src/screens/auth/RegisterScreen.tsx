import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';
import { THEME } from '../../constants';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { register, error } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    cpf: '',
    password: '',
    confirmPassword: '',
  });

  const validate = () => {
    const errors = {
      name: '',
      email: '',
      cpf: '',
      password: '',
      confirmPassword: '',
    };
    let isValid = true;

    if (!formData.name) {
      errors.name = 'Nome é obrigatório';
      isValid = false;
    }

    if (!formData.email) {
      errors.email = 'Email é obrigatório';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
      isValid = false;
    }

    if (!formData.cpf) {
      errors.cpf = 'CPF é obrigatório';
      isValid = false;
    } else if (!/^\d{11}$/.test(formData.cpf.replace(/\D/g, ''))) {
      errors.cpf = 'CPF inválido';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'Senha é obrigatória';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Senha deve ter no mínimo 6 caracteres';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Senhas não conferem';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await register(formData.email, formData.password, {
        displayName: formData.name,
        cpf: formData.cpf,
        referredBy: formData.referralCode || undefined,
      });
    } catch (err) {
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Faça parte do BioClubPlus</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              autoCapitalize="words"
            />
            {formErrors.name ? <Text style={styles.errorText}>{formErrors.name}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            {formErrors.email ? <Text style={styles.errorText}>{formErrors.email}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="CPF"
              value={formData.cpf}
              onChangeText={(text) => setFormData({ ...formData, cpf: text })}
              keyboardType="numeric"
            />
            {formErrors.cpf ? <Text style={styles.errorText}>{formErrors.cpf}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry
              autoCapitalize="none"
            />
            {formErrors.password ? <Text style={styles.errorText}>{formErrors.password}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirmar senha"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
              secureTextEntry
              autoCapitalize="none"
            />
            {formErrors.confirmPassword ? (
              <Text style={styles.errorText}>{formErrors.confirmPassword}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Código de indicação (opcional)"
              value={formData.referralCode}
              onChangeText={(text) => setFormData({ ...formData, referralCode: text })}
              autoCapitalize="characters"
            />
          </View>

          <Button
            title="Criar conta"
            onPress={handleRegister}
            isLoading={loading}
          />

          <Button
            title="Já tenho uma conta"
            onPress={() => navigation.navigate('Login')}
            variant="secondary"
            style={styles.secondaryButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  content: {
    padding: THEME.spacing.large,
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
  inputContainer: {
    gap: THEME.spacing.small,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: THEME.spacing.medium,
    fontSize: THEME.fontSize.medium,
  },
  errorText: {
    color: THEME.colors.error,
    fontSize: THEME.fontSize.small,
  },
  secondaryButton: {
    marginTop: THEME.spacing.small,
  },
});

export default RegisterScreen;
