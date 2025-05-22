import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../components/Button';
import { THEME } from '../../constants';
import type { CartItem } from '../../types';

// Mock data - substitua por dados reais do seu estado global ou contexto
const MOCK_CART_ITEMS: CartItem[] = [
  {
    product: {
      id: '1',
      name: 'Vitamina C 1000mg',
      description: 'Suplemento de Vitamina C com 60 cápsulas',
      ingredients: ['Ácido ascórbico', 'Celulose microcristalina'],
      benefits: ['Fortalece o sistema imunológico', 'Antioxidante natural'],
      usage: 'Tomar 1 cápsula ao dia, preferencialmente com as refeições.',
      dosage: '1 cápsula de 1000mg por dia',
      images: ['https://via.placeholder.com/150'],
      price: 49.90,
      discountPrice: 39.90,
      categories: ['Vitaminas'],
      inStock: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    quantity: 2,
  },
  // Adicione mais itens conforme necessário
];

const CartScreen = () => {
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState<CartItem[]>(MOCK_CART_ITEMS);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.discountPrice || item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems(items =>
      items.map(item =>
        item.product.id === itemId
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.product.id !== itemId));
  };

  const handleCheckout = () => {
    navigation.navigate('Checkout');
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="cart-outline" size={64} color="#666" />
        <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
        <Button
          title="Ir para a loja"
          onPress={() => navigation.navigate('Store')}
          variant="secondary"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.itemList}>
        {cartItems.map(item => (
          <View key={item.product.id} style={styles.cartItem}>
            <Image
              source={{ uri: item.product.images[0] }}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.product.name}</Text>
              <View style={styles.priceContainer}>
                {item.product.discountPrice ? (
                  <>
                    <Text style={styles.oldPrice}>
                      R$ {item.product.price.toFixed(2).replace('.', ',')}
                    </Text>
                    <Text style={styles.price}>
                      R$ {item.product.discountPrice.toFixed(2).replace('.', ',')}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.price}>
                    R$ {item.product.price.toFixed(2).replace('.', ',')}
                  </Text>
                )}
              </View>

              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() =>
                    handleUpdateQuantity(item.product.id, item.quantity - 1)
                  }
                  style={styles.quantityButton}
                >
                  <Icon name="minus" size={20} color={THEME.colors.primary} />
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() =>
                    handleUpdateQuantity(item.product.id, item.quantity + 1)
                  }
                  style={styles.quantityButton}
                >
                  <Icon name="plus" size={20} color={THEME.colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => handleRemoveItem(item.product.id)}
              style={styles.removeButton}
            >
              <Icon name="delete-outline" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.subtotal}>
          <Text style={styles.subtotalLabel}>Subtotal</Text>
          <Text style={styles.subtotalValue}>
            R$ {calculateSubtotal().toFixed(2).replace('.', ',')}
          </Text>
        </View>

        <Button
          title="Finalizar Compra"
          onPress={handleCheckout}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.large,
  },
  emptyText: {
    fontSize: THEME.fontSize.medium,
    color: '#666',
    marginVertical: THEME.spacing.large,
  },
  itemList: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: THEME.spacing.medium,
    marginHorizontal: THEME.spacing.medium,
    marginTop: THEME.spacing.medium,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: THEME.spacing.medium,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: THEME.fontSize.medium,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.small,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.small,
    marginBottom: THEME.spacing.small,
  },
  oldPrice: {
    fontSize: THEME.fontSize.small,
    color: '#666',
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: THEME.fontSize.medium,
    fontWeight: 'bold',
    color: THEME.colors.primary,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    padding: THEME.spacing.small,
  },
  quantity: {
    paddingHorizontal: THEME.spacing.medium,
    fontSize: THEME.fontSize.medium,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'center',
  },
  removeButton: {
    padding: THEME.spacing.small,
  },
  footer: {
    padding: THEME.spacing.medium,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  subtotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.medium,
  },
  subtotalLabel: {
    fontSize: THEME.fontSize.medium,
    color: '#666',
  },
  subtotalValue: {
    fontSize: THEME.fontSize.large,
    fontWeight: 'bold',
    color: THEME.colors.text,
  },
});

export default CartScreen;
