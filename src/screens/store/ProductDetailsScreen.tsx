import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { THEME } from '../../constants';
import Button from '../../components/Button';
import ProductService from '../../services/ProductService';
import type { Product } from '../../types';

const ProductDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params as { productId: string };
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    try {
      const productData = await ProductService.getProductById(productId);
      setProduct(productData);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    // TODO: Implementar adição ao carrinho
    navigation.navigate('Cart');
  };

  if (loading || !product) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {product.images && product.images.length > 0 && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: product.images[selectedImageIndex] }}
              style={styles.mainImage}
              resizeMode="cover"
            />
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.thumbnailsContainer}
            >
              {product.images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedImageIndex(index)}
                  style={[
                    styles.thumbnail,
                    selectedImageIndex === index && styles.selectedThumbnail,
                  ]}
                >
                  <Image
                    source={{ uri: image }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.title}>{product.name}</Text>
          
          <View style={styles.priceContainer}>
            {product.discountPrice ? (
              <>
                <Text style={styles.oldPrice}>
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </Text>
                <Text style={styles.price}>
                  R$ {product.discountPrice.toFixed(2).replace('.', ',')}
                </Text>
              </>
            ) : (
              <Text style={styles.price}>
                R$ {product.price.toFixed(2).replace('.', ',')}
              </Text>
            )}
          </View>

          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>{product.description}</Text>

          {product.ingredients && product.ingredients.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Ingredientes</Text>
              {product.ingredients.map((ingredient, index) => (
                <Text key={index} style={styles.listItem}>
                  • {ingredient}
                </Text>
              ))}
            </>
          )}

          {product.benefits && product.benefits.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Benefícios</Text>
              {product.benefits.map((benefit, index) => (
                <Text key={index} style={styles.listItem}>
                  • {benefit}
                </Text>
              ))}
            </>
          )}

          <Text style={styles.sectionTitle}>Modo de Uso</Text>
          <Text style={styles.description}>{product.usage}</Text>

          <Text style={styles.sectionTitle}>Dosagem Recomendada</Text>
          <Text style={styles.description}>{product.dosage}</Text>

          {product.contraindications && product.contraindications.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Contraindicações</Text>
              {product.contraindications.map((contraindication, index) => (
                <Text key={index} style={[styles.listItem, styles.warning]}>
                  • {contraindication}
                </Text>
              ))}
            </>
          )}

          {product.warnings && product.warnings.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Advertências</Text>
              {product.warnings.map((warning, index) => (
                <Text key={index} style={[styles.listItem, styles.warning]}>
                  • {warning}
                </Text>
              ))}
            </>
          )}

          {product.scientificReferences && product.scientificReferences.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Referências Científicas</Text>
              {product.scientificReferences.map((reference, index) => (
                <Text key={index} style={styles.reference}>
                  {index + 1}. {reference}
                </Text>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            onPress={() => quantity > 1 && setQuantity(q => q - 1)}
            style={styles.quantityButton}
          >
            <Icon name="minus" size={24} color={THEME.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity 
            onPress={() => setQuantity(q => q + 1)}
            style={styles.quantityButton}
          >
            <Icon name="plus" size={24} color={THEME.colors.primary} />
          </TouchableOpacity>
        </View>

        <Button
          title="Adicionar ao Carrinho"
          onPress={handleAddToCart}
          style={styles.addToCartButton}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    backgroundColor: '#fff',
  },
  mainImage: {
    width: '100%',
    height: 300,
  },
  thumbnailsContainer: {
    padding: THEME.spacing.medium,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: THEME.spacing.small,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: THEME.colors.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  content: {
    padding: THEME.spacing.large,
  },
  title: {
    fontSize: THEME.fontSize.xlarge,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.medium,
    color: THEME.colors.text,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.small,
    marginBottom: THEME.spacing.large,
  },
  oldPrice: {
    fontSize: THEME.fontSize.medium,
    color: '#666',
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: THEME.fontSize.large,
    fontWeight: 'bold',
    color: THEME.colors.primary,
  },
  sectionTitle: {
    fontSize: THEME.fontSize.medium,
    fontWeight: 'bold',
    marginTop: THEME.spacing.large,
    marginBottom: THEME.spacing.small,
    color: THEME.colors.text,
  },
  description: {
    fontSize: THEME.fontSize.medium,
    color: '#666',
    lineHeight: 24,
  },
  listItem: {
    fontSize: THEME.fontSize.medium,
    color: '#666',
    marginBottom: THEME.spacing.small,
    lineHeight: 24,
  },
  warning: {
    color: THEME.colors.error,
  },
  reference: {
    fontSize: THEME.fontSize.small,
    color: '#666',
    marginBottom: THEME.spacing.small,
    fontStyle: 'italic',
  },
  footer: {
    padding: THEME.spacing.medium,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.medium,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: THEME.spacing.small,
  },
  quantityButton: {
    padding: THEME.spacing.small,
  },
  quantity: {
    fontSize: THEME.fontSize.medium,
    fontWeight: 'bold',
    paddingHorizontal: THEME.spacing.medium,
    minWidth: 40,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
  },
});

export default ProductDetailsScreen;
