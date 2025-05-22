import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';
import { THEME } from '../../constants';

const WithdrawCommissionScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    bank: '',
    agency: '',
    account: '',
    cpf: '',
  });

  const handleWithdraw = async () => {
    setLoading(true);
    try {
      // TODO: Implementar solicitação de saque
      console.log('Dados do saque:', formData);
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao solicitar saque:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Solicitar Saque</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Valor do Saque</Text>
            <TextInput
              style={styles.input}
              value={formData.amount}
              onChangeText={(text) => setFormData({ ...formData, amount: text })}
              placeholder="R$ 0,00"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Banco</Text>
            <TextInput
              style={styles.input}
              value={formData.bank}
              onChangeText={(text) => setFormData({ ...formData, bank: text })}
              placeholder="Nome do banco"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>Agência</Text>
              <TextInput
                style={styles.input}
                value={formData.agency}
                onChangeText={(text) => setFormData({ ...formData, agency: text })}
                placeholder="0000"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputContainer, { flex: 2 }]}>
              <Text style={styles.label}>Conta</Text>
              <TextInput
                style={styles.input}
                value={formData.account}
                onChangeText={(text) => setFormData({ ...formData, account: text })}
                placeholder="00000-0"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>CPF do Titular</Text>
            <TextInput
              style={styles.input}
              value={formData.cpf}
              onChangeText={(text) => setFormData({ ...formData, cpf: text })}
              placeholder="000.000.000-00"
              keyboardType="numeric"
            />
          </View>

          <Button
            title="Solicitar Saque"
            onPress={handleWithdraw}            isLoading={loading}
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
  row: {
    flexDirection: 'row',
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

export default WithdrawCommissionScreen;
