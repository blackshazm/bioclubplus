import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';
import { THEME } from '../../constants';
import { MainTabParamList, RootStackParamList } from '../../types';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { currentUser } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Olá, {currentUser?.displayName?.split(' ')[0] || 'Usuário'}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Icon name="cart-outline" size={24} color={THEME.colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.balance}>
        <Text style={styles.balanceTitle}>Saldo de Comissões</Text>
        <Text style={styles.balanceValue}>
          R$ {currentUser?.commissionBalance?.toFixed(2).replace('.', ',') || '0,00'}
        </Text>
        <Button
          title="Ver detalhes"
          onPress={() => navigation.navigate('Commissions')}
          variant="secondary"
        />
      </View>

      <View style={styles.referrals}>
        <Text style={styles.sectionTitle}>Seus Indicados</Text>
        <View style={styles.referralStats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{currentUser?.activeReferrals || 0}</Text>
            <Text style={styles.statLabel}>Ativos</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{currentUser?.referralCode}</Text>
            <Text style={styles.statLabel}>Seu Código</Text>
          </View>
        </View>
        <Button
          title="Convidar amigos"
          onPress={() => navigation.navigate('Referrals')}
        />
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('Store')}
          >
            <Icon name="store" size={32} color={THEME.colors.primary} />
            <Text style={styles.actionLabel}>Loja</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('Subscriptions')}
          >
            <Icon name="star" size={32} color={THEME.colors.primary} />
            <Text style={styles.actionLabel}>Planos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('Coupons')}
          >
            <Icon name="ticket-percent" size={32} color={THEME.colors.primary} />
            <Text style={styles.actionLabel}>Cupons</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('Help')}
          >
            <Icon name="help-circle" size={32} color={THEME.colors.primary} />
            <Text style={styles.actionLabel}>Ajuda</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: THEME.spacing.large,
  },
  greeting: {
    fontSize: THEME.fontSize.large,
    fontWeight: 'bold',
    color: THEME.colors.text,
  },
  balance: {
    backgroundColor: THEME.colors.primary,
    margin: THEME.spacing.medium,
    padding: THEME.spacing.large,
    borderRadius: 12,
  },
  balanceTitle: {
    color: '#fff',
    fontSize: THEME.fontSize.medium,
    marginBottom: THEME.spacing.small,
  },
  balanceValue: {
    color: '#fff',
    fontSize: THEME.fontSize.xlarge,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.medium,
  },
  referrals: {
    padding: THEME.spacing.large,
  },
  sectionTitle: {
    fontSize: THEME.fontSize.large,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.medium,
    color: THEME.colors.text,
  },
  referralStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: THEME.spacing.large,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: THEME.fontSize.large,
    fontWeight: 'bold',
    color: THEME.colors.primary,
  },
  statLabel: {
    fontSize: THEME.fontSize.small,
    color: '#666',
  },
  quickActions: {
    padding: THEME.spacing.large,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.medium,
  },
  actionItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f5f5f5',
    padding: THEME.spacing.medium,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing.small,
  },
  actionLabel: {
    fontSize: THEME.fontSize.medium,
    color: THEME.colors.text,
  },
});

export default HomeScreen;
