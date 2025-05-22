import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Button from '../../components/Button';
import { THEME } from '../../constants';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const handleFinishPurchase = () => {
    // TODO: Implementar finalização da compra
    navigation.navigate('OrderConfirmation', { orderId: 'mock-order-id' });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Finalizar Compra</Text>
        
        {/* TODO: Implementar formulário de checkout */}
        <Text style={styles.message}>
          Esta tela será implementada em breve com todas as funcionalidades de checkout.
        </Text>

        <Button
          title="Finalizar Pedido"
          onPress={handleFinishPurchase}
          style={styles.button}
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
  message: {
    fontSize: THEME.fontSize.medium,
    color: '#666',
    marginBottom: THEME.spacing.large,
  },
  button: {
    marginTop: THEME.spacing.large,
  },
});

export default CheckoutScreen;
