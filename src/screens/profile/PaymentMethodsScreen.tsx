import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../components/Button';
import { THEME } from '../../constants';

// Mock data - substitua pelos dados reais
const MOCK_PAYMENT_METHODS = [
  {
    id: '1',
    type: 'credit_card',
    brand: 'Visa',
    last4: '4242',
    expiryMonth: 12,
    expiryYear: 28,
  },
  {
    id: '2',
    type: 'credit_card',
    brand: 'Mastercard',
    last4: '8888',
    expiryMonth: 5,
    expiryYear: 26,
  },
];

const PaymentMethodsScreen = () => {
  const navigation = useNavigation();

  const handleAddPaymentMethod = () => {
    navigation.navigate('AddPaymentMethod');
  };

  const handleDeletePaymentMethod = (id: string) => {
    // TODO: Implementar remoção do método de pagamento
    console.log('Deletar método de pagamento:', id);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Métodos de Pagamento</Text>

        {MOCK_PAYMENT_METHODS.map((method) => (
          <View key={method.id} style={styles.card}>
            <View style={styles.cardInfo}>
              <Icon
                name={method.brand.toLowerCase()}
                size={32}
                color={THEME.colors.text}
              />
              <View style={styles.cardDetails}>
                <Text style={styles.cardType}>
                  {method.brand} terminado em {method.last4}
                </Text>
                <Text style={styles.cardExpiry}>
                  Expira em {method.expiryMonth}/{method.expiryYear}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => handleDeletePaymentMethod(method.id)}
              style={styles.deleteButton}
            >
              <Icon name="delete-outline" size={24} color={THEME.colors.error} />
            </TouchableOpacity>
          </View>
        ))}

        <Button
          title="Adicionar Método de Pagamento"
          onPress={handleAddPaymentMethod}
          style={styles.addButton}
        />
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: THEME.spacing.medium,
    borderRadius: 12,
    marginBottom: THEME.spacing.medium,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardDetails: {
    marginLeft: THEME.spacing.medium,
  },
  cardType: {
    fontSize: THEME.fontSize.medium,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.small,
  },
  cardExpiry: {
    fontSize: THEME.fontSize.small,
    color: '#666',
  },
  deleteButton: {
    padding: THEME.spacing.small,
  },
  addButton: {
    marginTop: THEME.spacing.medium,
  },
});

export default PaymentMethodsScreen;
