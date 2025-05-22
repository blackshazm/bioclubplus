import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, Timestamp, documentId } from 'firebase/firestore';
import { db } from '../config/firebase';
import { functions } from '../config/firebase';
import { httpsCallable } from 'firebase/functions';
import { Referral, Commission } from '../types/referral';
import { BankAccountDetails } from '../types';

class ReferralService {
  private static COLLECTIONS = {
    REFERRALS: 'referrals',
    COMMISSIONS: 'commissions',
    USERS: 'users',
    SUBSCRIPTIONS: 'subscriptions',
    WITHDRAWALS: 'withdrawals',
  };

  /**
   * Busca todas as indicações feitas por um usuário
   * @param userId ID do usuário que fez as indicações
   * @returns Lista de indicações com informações detalhadas
   */
  static async getUserReferrals(userId: string): Promise<Referral[]> {
    try {
      if (!userId) throw new Error('ID do usuário é obrigatório');

      const referralsRef = collection(db, this.COLLECTIONS.REFERRALS);
      const q = query(referralsRef, where('referrerId', '==', userId));
      
      const snapshot = await getDocs(q);
      
      // Coletar todos os IDs de usuários únicos para buscar em batch
      const referredUserIds = [...new Set(snapshot.docs.map(doc => doc.data().referredUserId))];
      
      // Buscar informações dos usuários em batch
      const usersRef = collection(db, this.COLLECTIONS.USERS);
      const usersQuery = query(usersRef, where(documentId(), 'in', referredUserIds));
      const usersSnapshot = await getDocs(usersQuery);
      
      const userMap = new Map();
      usersSnapshot.docs.forEach(doc => {
        userMap.set(doc.id, {
          displayName: doc.data().displayName,
          email: doc.data().email,
          photoURL: doc.data().photoURL
        });
      });
      
      // Buscar assinaturas em batch
      const subscriptionsRef = collection(db, this.COLLECTIONS.SUBSCRIPTIONS);
      const subsQuery = query(
        subscriptionsRef, 
        where('userId', 'in', referredUserIds),
        where('status', 'in', ['active', 'trial', 'pending', 'canceled'])
      );
      
      const subsSnapshot = await getDocs(subsQuery);
      const subscriptionMap = new Map();
      
      subsSnapshot.docs.forEach(doc => {
        subscriptionMap.set(doc.data().userId, {
          status: doc.data().status,
          createdAt: doc.data().createdAt,
          nextBillingDate: doc.data().nextBillingDate,
          plan: doc.data().plan
        });
      });
      
      // Mapear resultados
      const referrals = snapshot.docs.map(doc => {
        const data = doc.data();
        const referredUserData = userMap.get(data.referredUserId);
        const subscriptionData = subscriptionMap.get(data.referredUserId);
        
        return {
          id: doc.id,
          ...data,
          referredUser: referredUserData,
          subscription: subscriptionData,
          createdAt: data.createdAt?.toDate()
        } as Referral;
      });
      
      // Ordenar por data de criação (mais recente primeiro)
      return referrals.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Erro ao buscar indicações:', error);
      throw new Error('Falha ao buscar indicações. Por favor, tente novamente.');
    }
  }

  /**
   * Busca todas as comissões de um usuário
   * @param userId ID do usuário
   * @returns Lista de comissões com detalhes das indicações
   */
  static async getUserCommissions(userId: string): Promise<Commission[]> {
    try {
      if (!userId) throw new Error('ID do usuário é obrigatório');

      const commissionsRef = collection(db, this.COLLECTIONS.COMMISSIONS);
      const q = query(commissionsRef, where('userId', '==', userId));
      
      const snapshot = await getDocs(q);
      
      // Coletar todos os IDs de referências únicos
      const referralIds = [...new Set(snapshot.docs.map(doc => doc.data().referralId))];
      
      // Buscar informações das referências em batch
      const referralsRef = collection(db, this.COLLECTIONS.REFERRALS);
      const refsQuery = query(referralsRef, where(documentId(), 'in', referralIds));
      const refsSnapshot = await getDocs(refsQuery);
        const referralMap = new Map();
      const referredUserIds: string[] = [];

      refsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        referralMap.set(doc.id, data);
        if (data.referredUserId) {
          referredUserIds.push(data.referredUserId);
        }
      });
      
      // Buscar informações dos usuários em batch
      const usersRef = collection(db, this.COLLECTIONS.USERS);
      const usersQuery = query(usersRef, where(documentId(), 'in', referredUserIds));
      const usersSnapshot = await getDocs(usersQuery);
      
      const userMap = new Map();
      usersSnapshot.docs.forEach(doc => {
        userMap.set(doc.id, {
          id: doc.id,
          displayName: doc.data().displayName
        });
      });
      
      // Mapear resultados
      const commissions = snapshot.docs.map(doc => {
        const data = doc.data();
        const referralData = referralMap.get(data.referralId);
        const referredUser = referralData?.referredUserId 
          ? userMap.get(referralData.referredUserId)
          : null;
        
        return {
          id: doc.id,
          ...data,
          referral: referralData ? {
            id: data.referralId,
            referredUser
          } : null,
          createdAt: data.createdAt?.toDate(),
          paidAt: data.paidAt?.toDate()
        } as Commission;
      });
      
      // Ordenar por data (mais recente primeiro)
      return commissions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Erro ao buscar comissões:', error);
      throw new Error('Falha ao buscar comissões. Por favor, tente novamente.');
    }
  }

  /**
   * Gera um link de indicação para o usuário
   * @param userId ID do usuário
   * @returns Link de indicação
   */
  static async generateReferralLink(userId: string): Promise<string> {
    try {
      if (!userId) throw new Error('ID do usuário é obrigatório');

      // Buscar o usuário
      const userRef = doc(db, this.COLLECTIONS.USERS, userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('Usuário não encontrado');
      }
      
      // Verificar se já existe um código de indicação
      let referralCode = userDoc.data().referralCode;
      
      // Se não existir, gerar um novo
      if (!referralCode) {
        // Gerar código aleatório
        const generateCode = () => {
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          const codeLength = 8;
          return Array(codeLength).fill('')
            .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
            .join('');
        };
        
        // Tentar até 3 vezes gerar um código único
        for (let i = 0; i < 3; i++) {
          referralCode = generateCode();
          
          // Verificar se o código já está em uso
          const usersRef = collection(db, this.COLLECTIONS.USERS);
          const q = query(usersRef, where('referralCode', '==', referralCode));
          const snapshot = await getDocs(q);
          
          if (snapshot.empty) {
            // Código único encontrado
            await updateDoc(userRef, {
              referralCode,
              updatedAt: Timestamp.now()
            });
            break;
          }
          
          if (i === 2) {
            throw new Error('Não foi possível gerar um código único. Tente novamente.');
          }
        }
      }
      
      // Base URL do app (definida nos parâmetros do Firebase)
      const appDomain = 'bioclub.app';
      
      // Construir link de indicação
      return `https://${appDomain}/referral/${referralCode}`;
    } catch (error) {
      console.error('Erro ao gerar link de indicação:', error);
      throw new Error('Falha ao gerar link de indicação. Por favor, tente novamente.');
    }
  }

  /**
   * Registra uma nova indicação
   * @param referrerCode Código de indicação do usuário que está indicando
   * @param referredUserId ID do usuário que foi indicado
   * @returns true se a indicação foi registrada com sucesso
   */
  static async createReferral(referrerCode: string, referredUserId: string): Promise<boolean> {
    try {
      if (!referrerCode || !referredUserId) {
        throw new Error('Código de indicação e ID do usuário indicado são obrigatórios');
      }

      // Buscar o usuário que indicou pelo código
      const usersRef = collection(db, this.COLLECTIONS.USERS);
      const q = query(usersRef, where('referralCode', '==', referrerCode));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        throw new Error('Código de indicação inválido');
      }
      
      const referrerDoc = snapshot.docs[0];
      const referrerId = referrerDoc.id;
      
      // Verificar se o usuário não está se auto-indicando
      if (referrerId === referredUserId) {
        throw new Error('Você não pode indicar a si mesmo');
      }
      
      // Verificar se já existe essa indicação
      const referralsRef = collection(db, this.COLLECTIONS.REFERRALS);
      const refQ = query(
        referralsRef, 
        where('referrerId', '==', referrerId),
        where('referredUserId', '==', referredUserId)
      );
      
      const refSnapshot = await getDocs(refQ);
      
      if (!refSnapshot.empty) {
        throw new Error('Esta indicação já foi registrada');
      }
      
      // Criar nova indicação
      const referralDoc = await addDoc(collection(db, this.COLLECTIONS.REFERRALS), {
        referrerId,
        referredUserId,
        status: 'pending',
        createdAt: Timestamp.now()
      });
      
      // Atualizar estatísticas do usuário que indicou
      await updateDoc(doc(db, this.COLLECTIONS.USERS, referrerId), {
        totalReferrals: (referrerDoc.data().totalReferrals || 0) + 1,
        updatedAt: Timestamp.now()
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao registrar indicação:', error);
      throw new Error('Falha ao registrar indicação. Por favor, tente novamente.');
    }
  }

  /**
   * Solicita saque de comissão
   * @param userId ID do usuário
   * @param amount Valor do saque
   * @param bankDetails Dados bancários para o saque
   * @returns Objeto com o valor do saque
   */
  static async withdrawCommission(
    userId: string, 
    amount: number, 
    bankDetails: BankAccountDetails
  ): Promise<{ amount: number }> {
    try {
      if (!userId || !amount || !bankDetails) {
        throw new Error('ID do usuário, valor e dados bancários são obrigatórios');
      }

      if (amount <= 0) {
        throw new Error('O valor do saque deve ser maior que zero');
      }

      // Verificar se o usuário tem saldo suficiente
      const commissions = await this.getUserCommissions(userId);
      
      // Filtrar apenas comissões disponíveis
      const availableCommissions = commissions.filter(comm => comm.status === 'available');
      
      // Calcular saldo disponível
      const availableBalance = availableCommissions.reduce((total, comm) => total + comm.amount, 0);
      
      if (availableBalance < amount) {
        throw new Error('Saldo insuficiente para saque');
      }
      
      // Validar dados bancários
      const { bankName, accountType, accountNumber, branchNumber, accountHolderName, accountHolderDocument } = bankDetails;
      
      if (!bankName || !accountType || !accountNumber || !branchNumber || !accountHolderName || !accountHolderDocument) {
        throw new Error('Dados bancários incompletos');
      }
      
      // Criar solicitação de saque
      const withdrawalDoc = await addDoc(collection(db, this.COLLECTIONS.WITHDRAWALS), {
        userId,
        amount,
        bankDetails,
        status: 'pending',
        createdAt: Timestamp.now()
      });
      
      // Marcar comissões como "em processamento"
      let remainingAmount = amount;
      
      for (const commission of availableCommissions) {
        if (remainingAmount <= 0) break;
        
        const commissionRef = doc(db, this.COLLECTIONS.COMMISSIONS, commission.id);
        
        if (commission.amount <= remainingAmount) {
          // Usar toda a comissão
          await updateDoc(commissionRef, {
            status: 'processing',
            withdrawalId: withdrawalDoc.id,
            updatedAt: Timestamp.now()
          });
          
          remainingAmount -= commission.amount;
        } else {
          // Dividir a comissão
          const processingAmount = remainingAmount;
          const remainingCommissionAmount = commission.amount - remainingAmount;
          
          // Atualizar comissão original
          await updateDoc(commissionRef, {
            amount: remainingCommissionAmount,
            updatedAt: Timestamp.now()
          });
          
          // Criar nova comissão para o valor em processamento
          await addDoc(collection(db, this.COLLECTIONS.COMMISSIONS), {
            ...commission,
            id: undefined,
            amount: processingAmount,
            status: 'processing',
            withdrawalId: withdrawalDoc.id,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          });
          
          remainingAmount = 0;
        }
      }
      
      // Atualizar saldo do usuário
      await updateDoc(doc(db, this.COLLECTIONS.USERS, userId), {
        commissionBalance: (availableBalance - amount),
        updatedAt: Timestamp.now()
      });
      
      return { amount };
    } catch (error) {
      console.error('Erro ao solicitar saque:', error);
      throw new Error('Falha ao solicitar saque. Por favor, tente novamente.');
    }
  }
}

export default ReferralService;
