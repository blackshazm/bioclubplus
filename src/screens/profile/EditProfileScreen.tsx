import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import Button from '../../components/Button';
import { THEME } from '../../constants';

const EditProfileScreen = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Implementar atualização do perfil
      console.log('Dados a serem salvos:', formData);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Editar Perfil</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome completo</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Seu nome completo"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Seu e-mail"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Seu telefone"
              keyboardType="phone-pad"
            />
          </View>

          <Button
            title="Salvar Alterações"
            onPress={handleSave}
            isLoading={loading}
            style={styles.button}
          />
        </View>
      </View>
    </ScrollView>
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
    marginBottom: THEME.spacing.large,
    color: THEME.colors.text,
  },
  form: {
    gap: THEME.spacing.medium,
  },
  inputContainer: {
    gap: THEME.spacing.small,
  },
  label: {
    fontSize: THEME.fontSize.medium,
    color: THEME.colors.text,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: THEME.spacing.medium,
    fontSize: THEME.fontSize.medium,
    color: THEME.colors.text,
  },
  button: {
    marginTop: THEME.spacing.medium,
  },
});

export default EditProfileScreen;
