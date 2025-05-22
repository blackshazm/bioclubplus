import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product } from '../types';

class ProductService {
  /**
   * Busca todos os produtos disponíveis
   */
  static async getAllProducts(): Promise<Product[]> {
    try {
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      } as Product));
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw new Error('Falha ao buscar produtos. Por favor, tente novamente.');
    }
  }

  /**
   * Busca produtos em destaque
   */
  static async getFeaturedProducts(): Promise<Product[]> {
    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('featured', '==', true));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      } as Product));
    } catch (error) {
      console.error('Erro ao buscar produtos em destaque:', error);
      throw new Error('Falha ao buscar produtos em destaque. Por favor, tente novamente.');
    }
  }

  /**
   * Busca um produto específico pelo ID
   */
  static async getProductById(productId: string): Promise<Product> {
    try {
      const productRef = doc(db, 'products', productId);
      const productDoc = await getDoc(productRef);
      
      if (!productDoc.exists()) {
        throw new Error('Produto não encontrado');
      }
      
      return {
        id: productDoc.id,
        ...productDoc.data(),
        createdAt: productDoc.data().createdAt?.toDate(),
        updatedAt: productDoc.data().updatedAt?.toDate()
      } as Product;
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      throw new Error('Falha ao buscar detalhes do produto. Por favor, tente novamente.');
    }
  }

  /**
   * Busca produtos por categoria
   */
  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('categories', 'array-contains', category));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      } as Product));
    } catch (error) {
      console.error('Erro ao buscar produtos por categoria:', error);
      throw new Error('Falha ao buscar produtos por categoria. Por favor, tente novamente.');
    }
  }

  /**
   * Busca as categorias disponíveis
   */
  static async getCategories(): Promise<string[]> {
    try {
      // Assumindo que temos uma coleção 'categories' no Firestore
      const categoriesRef = collection(db, 'categories');
      const snapshot = await getDocs(categoriesRef);
      
      return snapshot.docs.map(doc => doc.data().name as string);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw new Error('Falha ao buscar categorias. Por favor, tente novamente.');
    }
  }

  /**
   * Busca produtos com base em termos de pesquisa
   */
  static async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      // Nota: Firebase não suporta pesquisa de texto completo
      // Esta é uma implementação simples que busca todos os produtos
      // e filtra no cliente
      const products = await this.getAllProducts();
      
      const lowerSearchTerm = searchTerm.toLowerCase();
      return products.filter(product => 
        product.name.toLowerCase().includes(lowerSearchTerm) ||
        product.description.toLowerCase().includes(lowerSearchTerm) ||
        product.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(lowerSearchTerm)
        ) ||
        product.categories.some(category =>
          category.toLowerCase().includes(lowerSearchTerm)
        )
      );
    } catch (error) {
      console.error('Erro ao pesquisar produtos:', error);
      throw new Error('Falha ao pesquisar produtos. Por favor, tente novamente.');
    }
  }
}

export default ProductService;
