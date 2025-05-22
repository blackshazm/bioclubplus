import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { THEME } from '../../constants';

// Mock de dados - substitua pela sua implementação real
const MOCK_ORDER = {
  id: 'mock-order-id',
  status: 'Processando',
  date: new Date().toISOString(),
  items: [
    {
      id: '1',
      name: 'Vitamina C 1000mg',
      quantity: 2,
      price: 39.90,
    },
  ],
  subtotal: 79.80,
  shipping: 12.50,
  total: 92.30,
  address: {
    street: 'Rua Exemplo',
    number: '123',
    complement: 'Apto 101',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01001-000',
  },
  payment: {
    method: 'Cartão de Crédito',
    last4: '4242',
  },
};

const OrderDetailsScreen = () => {
  const route = useRoute();
  const { orderId } = route.params as { orderId: string };
  const [order, setOrder] = useState(MOCK_ORDER);

  useEffect(() => {
    // TODO: Implementar busca dos detalhes do pedido
  }, [orderId]);

  if (!order) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Pedido #{order.id}</Text>
        <Text style={styles.status}>{order.status}</Text>
        <Text style={styles.date}>
          {new Date(order.date).toLocaleDateString('pt-BR')}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Itens do Pedido</Text>
        {order.items.map(item => (
          <View key={item.id} style={styles.item}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>Qtd: {item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>
              R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo</Text>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>
            R$ {order.subtotal.toFixed(2).replace('.', ',')}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Frete</Text>
          <Text style={styles.summaryValue}>
            R$ {order.shipping.toFixed(2).replace('.', ',')}
          </Text>
        </View>
        <View style={[styles.summaryItem, styles.total]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            R$ {order.total.toFixed(2).replace('.', ',')}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Endereço de Entrega</Text>
        <Text style={styles.addressText}>
          {order.address.street}, {order.address.number}
          {order.address.complement ? ` - ${order.address.complement}` : ''}
        </Text>
        <Text style={styles.addressText}>
          {order.address.neighborhood}
        </Text>
        <Text style={styles.addressText}>
          {order.address.city} - {order.address.state}
        </Text>
        <Text style={styles.addressText}>
          CEP: {order.address.zipCode}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pagamento</Text>
        <Text style={styles.paymentText}>
          {order.payment.method}
        </Text>
        {order.payment.last4 && (
          <Text style={styles.paymentText}>
            Final {order.payment.last4}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: THEME.spacing.medium,
    padding: THEME.spacing.large,
  },
  title: {
    fontSize: THEME.fontSize.xlarge,
    fontWeight: 'bold',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.small,
  },
  status: {
    fontSize: THEME.fontSize.medium,
    color: THEME.colors.primary,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.small,
  },
  date: {
    fontSize: THEME.fontSize.medium,
    color: '#666',
  },
  sectionTitle: {
    fontSize: THEME.fontSize.large,
    fontWeight: 'bold',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.medium,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: THEME.spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: THEME.fontSize.medium,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.small,
  },
  itemQuantity: {
    fontSize: THEME.fontSize.small,
    color: '#666',
  },
  itemPrice: {
    fontSize: THEME.fontSize.medium,
    fontWeight: 'bold',
    color: THEME.colors.text,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.small,
  },
  summaryLabel: {
    fontSize: THEME.fontSize.medium,
    color: '#666',
  },
  summaryValue: {
    fontSize: THEME.fontSize.medium,
    color: THEME.colors.text,
  },
  total: {
    marginTop: THEME.spacing.medium,
    paddingTop: THEME.spacing.medium,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: THEME.fontSize.medium,
    fontWeight: 'bold',
    color: THEME.colors.text,
  },
  totalValue: {
    fontSize: THEME.fontSize.large,
    fontWeight: 'bold',
    color: THEME.colors.primary,
  },
  addressText: {
    fontSize: THEME.fontSize.medium,
    color: '#666',
    marginBottom: THEME.spacing.small,
  },
  paymentText: {
    fontSize: THEME.fontSize.medium,
    color: '#666',
  },
});

export default OrderDetailsScreen;
