import { doc, getDoc, collection, getDocs, query, where, updateDoc, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Subscription } from '../types/subscription';

class SubscriptionService {
  private static convertTimestampToDate(data: any): any {
    if (!data) return data;

    if (data instanceof Timestamp) {
      return data.toDate();
    }

    if (Array.isArray(data)) {
      return data.map(item => this.convertTimestampToDate(item));
    }

    if (typeof data === 'object') {
      Object.keys(data).forEach(key => {
        data[key] = this.convertTimestampToDate(data[key]);
      });
    }

    return data;
  }

  /**
   * Busca a assinatura atual do usuário
   */
  static async getUserSubscription(userId: string): Promise<Subscription> {
    try {
      const subscriptionRef = collection(db, 'subscriptions');
      const q = query(
        subscriptionRef, 
        where('userId', '==', userId), 
        where('status', 'in', ['active', 'pending', 'trial'])
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        throw new Error('Nenhuma assinatura encontrada');
      }
      
      // Assumindo que um usuário tem apenas uma assinatura ativa por vez
      const subscriptionDoc = snapshot.docs[0];
      const data = this.convertTimestampToDate(subscriptionDoc.data());
      
      return {
        id: subscriptionDoc.id,
        ...data
      } as Subscription;
    } catch (error) {
      console.error('Erro ao buscar assinatura:', error);
      throw new Error('Falha ao buscar informações da assinatura. Por favor, tente novamente.');
    }
  }

  /**
   * Busca o histórico de assinaturas do usuário
   */
  static async getSubscriptionHistory(userId: string): Promise<Subscription[]> {
    try {
      const subscriptionRef = collection(db, 'subscriptions');
      const q = query(subscriptionRef, where('userId', '==', userId));
      
      const snapshot = await getDocs(q);
      
      // Ordenar por data de criação (mais recente primeiro)
      return snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...this.convertTimestampToDate(doc.data())
        } as Subscription))
        .sort((a, b) => {
          return b.createdAt.getTime() - a.createdAt.getTime();
        });
    } catch (error) {
      console.error('Erro ao buscar histórico de assinaturas:', error);
      throw new Error('Falha ao buscar histórico de assinaturas. Por favor, tente novamente.');
    }
  }

  /**
   * Atualiza o método de pagamento de uma assinatura
   */
  static async updatePaymentMethod(userId: string, paymentDetails: any): Promise<Subscription> {
    try {
      // Buscar a assinatura atual
      const subscription = await this.getUserSubscription(userId);
      
      // Referência ao documento da assinatura
      const subscriptionRef = doc(db, 'subscriptions', subscription.id);
      
      // Atualizar método de pagamento
      await updateDoc(subscriptionRef, {
        paymentMethod: {
          type: paymentDetails.type, // 'credit_card', 'debit_card', etc.
          ...paymentDetails,
          lastUpdated: Timestamp.now()
        }
      });
      
      // Buscar a assinatura atualizada
      const updatedSubscription = await getDoc(subscriptionRef);
      const data = this.convertTimestampToDate(updatedSubscription.data());
      
      return {
        id: updatedSubscription.id,
        ...data
      } as Subscription;
    } catch (error) {
      console.error('Erro ao atualizar método de pagamento:', error);
      throw new Error('Falha ao atualizar método de pagamento. Por favor, tente novamente.');
    }
  }

  /**
   * Cancela a assinatura atual
   */
  static async cancelSubscription(userId: string, reason?: string): Promise<boolean> {
    try {
      // Buscar a assinatura atual
      const subscription = await this.getUserSubscription(userId);
      
      // Referência ao documento da assinatura
      const subscriptionRef = doc(db, 'subscriptions', subscription.id);
      
      // Registrar cancelamento
      await updateDoc(subscriptionRef, {
        status: 'canceled',
        canceledAt: Timestamp.now(),
        cancelReason: reason || 'Não especificado'
      });
      
      // Registrar no log de cancelamentos
      await addDoc(collection(db, 'cancellationLogs'), {
        userId,
        subscriptionId: subscription.id,
        canceledAt: Timestamp.now(),
        reason: reason || 'Não especificado',
        plan: subscription.plan
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      throw new Error('Falha ao cancelar assinatura. Por favor, tente novamente.');
    }
  }

  /**
   * Cria uma nova assinatura (para novos usuários ou reativação)
   */
  static async createSubscription(userId: string, planId: string, paymentDetails: any): Promise<Subscription> {
    try {
      // Verificar se já existe assinatura ativa
      try {
        const existingSubscription = await this.getUserSubscription(userId);
        if (existingSubscription && ['active', 'trial'].includes(existingSubscription.status)) {
          throw new Error('Usuário já possui uma assinatura ativa');
        }
      } catch (error: any) {
        // Se o erro for "Nenhuma assinatura encontrada", então podemos prosseguir
        if (error.message !== 'Nenhuma assinatura encontrada') {
          throw error;
        }
      }
      
      // Buscar informações do plano
      const planRef = doc(db, 'plans', planId);
      const planDoc = await getDoc(planRef);
      
      if (!planDoc.exists()) {
        throw new Error('Plano não encontrado');
      }
      
      const plan = planDoc.data();
      
      // Calcular próxima data de cobrança (30 dias a partir de hoje)
      const now = new Date();
      const nextBillingDate = new Date(now);
      nextBillingDate.setDate(now.getDate() + 30);
      
      // Criar nova assinatura
      const newSubscription = {
        userId,
        planId,
        plan: {
          name: plan.name,
          price: plan.price,
          billingFrequency: plan.billingFrequency,
          description: plan.description
        },
        status: 'active' as const,
        createdAt: Timestamp.now(),
        nextBillingDate: Timestamp.fromDate(nextBillingDate),
        paymentMethod: {
          type: paymentDetails.type,
          ...paymentDetails,
          lastUpdated: Timestamp.now()
        }
      };
      
      // Adicionar ao Firestore
      const subscriptionRef = await addDoc(collection(db, 'subscriptions'), newSubscription);
      const data = this.convertTimestampToDate(newSubscription);
      
      return {
        id: subscriptionRef.id,
        ...data
      } as Subscription;
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      throw new Error('Falha ao criar assinatura. Por favor, tente novamente.');
    }
  }
}

export default SubscriptionService;
