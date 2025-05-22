import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/Button';
import { THEME } from '../../constants';

const AddPaymentMethodScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    holderName: '',
  });

  const handleAddCard = async () => {
    setLoading(true);
    try {
      // TODO: Implementar adição do cartão
      console.log('Dados do cartão:', formData);
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao adicionar cartão:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Adicionar Cartão</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Número do Cartão</Text>
            <TextInput
              style={styles.input}
              value={formData.cardNumber}
              onChangeText={(text) => setFormData({ ...formData, cardNumber: text })}
              placeholder="1234 5678 9012 3456"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>Validade</Text>
              <TextInput
                style={styles.input}
                value={formData.expiryDate}
                onChangeText={(text) => setFormData({ ...formData, expiryDate: text })}
                placeholder="MM/AA"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={styles.input}
                value={formData.cvv}
                onChangeText={(text) => setFormData({ ...formData, cvv: text })}
                placeholder="123"
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome no Cartão</Text>
            <TextInput
              style={styles.input}
              value={formData.holderName}
              onChangeText={(text) => setFormData({ ...formData, holderName: text })}
              placeholder="Como aparece no cartão"
              autoCapitalize="characters"
            />
          </View>

          <Button
            title="Adicionar Cartão"
            onPress={handleAddCard}
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

export default AddPaymentMethodScreen;
