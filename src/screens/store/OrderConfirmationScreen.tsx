import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../components/Button';
import { THEME } from '../../constants';

const OrderConfirmationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params as { orderId: string };

  const handleViewOrder = () => {
    navigation.navigate('OrderDetails', { orderId });
  };

  const handleContinueShopping = () => {
    navigation.navigate('Store');
  };

  return (
    <View style={styles.container}>
      <Icon name="check-circle" size={80} color={THEME.colors.primary} />
      
      <Text style={styles.title}>Pedido Confirmado!</Text>
      
      <Text style={styles.orderId}>
        Pedido #{orderId}
      </Text>
      
      <Text style={styles.message}>
        Agradecemos sua compra! Você receberá um e-mail com os detalhes do pedido.
      </Text>

      <View style={styles.buttonsContainer}>
        <Button
          title="Ver Detalhes do Pedido"
          onPress={handleViewOrder}
          variant="secondary"
          style={styles.button}
        />
        
        <Button
          title="Continuar Comprando"
          onPress={handleContinueShopping}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.large,
  },
  title: {
    fontSize: THEME.fontSize.xlarge,
    fontWeight: 'bold',
    color: THEME.colors.text,
    marginTop: THEME.spacing.large,
    marginBottom: THEME.spacing.medium,
  },
  orderId: {
    fontSize: THEME.fontSize.medium,
    color: '#666',
    marginBottom: THEME.spacing.large,
  },
  message: {
    fontSize: THEME.fontSize.medium,
    color: '#666',
    textAlign: 'center',
    marginBottom: THEME.spacing.xlarge,
  },
  buttonsContainer: {
    width: '100%',
    gap: THEME.spacing.medium,
  },
  button: {
    width: '100%',
  },
});

export default OrderConfirmationScreen;
