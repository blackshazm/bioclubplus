import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { THEME } from '../../constants';

// Dados mockados para exemplo
const CATEGORIES = [
  'Todos',
  'Vitaminas',
  'Proteínas',
  'Suplementos',
  'Naturais',
  'Orgânicos',
];

const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Vitamina C 1000mg',
    description: 'Suplemento de Vitamina C com 60 cápsulas',
    price: 49.90,
    discountPrice: 39.90,
    image: 'https://via.placeholder.com/150',
    category: 'Vitaminas',
  },
  {
    id: '2',
    name: 'Whey Protein',
    description: 'Proteína isolada do soro do leite',
    price: 129.90,
    image: 'https://via.placeholder.com/150',
    category: 'Proteínas',
  },
  // Adicione mais produtos conforme necessário
];

const StoreScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.priceContainer}>
          {item.discountPrice ? (
            <>
              <Text style={styles.oldPrice}>
                R$ {item.price.toFixed(2).replace('.', ',')}
              </Text>
              <Text style={styles.price}>
                R$ {item.discountPrice.toFixed(2).replace('.', ',')}
              </Text>
            </>
          ) : (
            <Text style={styles.price}>
              R$ {item.price.toFixed(2).replace('.', ',')}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const filteredProducts = MOCK_PRODUCTS.filter(
    (product) =>
      (selectedCategory === 'Todos' || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={24} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Icon name="cart-outline" size={24} color={THEME.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.medium,
    gap: THEME.spacing.medium,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: THEME.spacing.medium,
  },
  searchIcon: {
    marginRight: THEME.spacing.small,
  },
  searchInput: {
    flex: 1,
    padding: THEME.spacing.medium,
    fontSize: THEME.fontSize.medium,
  },
  categoriesContainer: {
    paddingHorizontal: THEME.spacing.medium,
    marginBottom: THEME.spacing.medium,
  },
  categoryButton: {
    paddingHorizontal: THEME.spacing.medium,
    paddingVertical: THEME.spacing.small,
    marginRight: THEME.spacing.small,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  selectedCategory: {
    backgroundColor: THEME.colors.primary,
  },
  categoryText: {
    fontSize: THEME.fontSize.medium,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  productList: {
    padding: THEME.spacing.medium,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: THEME.spacing.medium,
    padding: THEME.spacing.medium,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: 100,
    height: 100,
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
  productDescription: {
    fontSize: THEME.fontSize.small,
    color: '#666',
    marginBottom: THEME.spacing.small,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.small,
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
});

export default StoreScreen;
