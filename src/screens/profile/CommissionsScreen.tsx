import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';
import { THEME } from '../../constants';

// Mock data - substitua pelos dados reais
const MOCK_COMMISSIONS = {
  available: 250.50,
  pending: 150.00,
  history: [
    {
      id: '1',
      amount: 100.00,
      status: 'paid',
      date: '2025-05-15',
      referral: 'João Silva',
    },
    {
      id: '2',
      amount: 75.50,
      status: 'paid',
      date: '2025-05-10',
      referral: 'Maria Santos',
    },
  ],
};

const CommissionsScreen = () => {
  const navigation = useNavigation();

  const handleWithdraw = () => {
    navigation.navigate('WithdrawCommission');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Comissões</Text>

        <View style={styles.balanceCards}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Disponível para Saque</Text>
            <Text style={styles.balanceValue}>
              R$ {MOCK_COMMISSIONS.available.toFixed(2).replace('.', ',')}
            </Text>
            <Button
              title="Solicitar Saque"
              onPress={handleWithdraw}
              style={styles.withdrawButton}
            />
          </View>

          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Pendente</Text>
            <Text style={[styles.balanceValue, styles.pendingValue]}>
              R$ {MOCK_COMMISSIONS.pending.toFixed(2).replace('.', ',')}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Histórico</Text>

        {MOCK_COMMISSIONS.history.map((item) => (
          <View key={item.id} style={styles.historyItem}>
            <View>
              <Text style={styles.historyReferral}>{item.referral}</Text>
              <Text style={styles.historyDate}>
                {new Date(item.date).toLocaleDateString('pt-BR')}
              </Text>
            </View>
            <View>
              <Text style={styles.historyAmount}>
                R$ {item.amount.toFixed(2).replace('.', ',')}
              </Text>
              <Text style={[styles.historyStatus, styles.paidStatus]}>
                Pago
              </Text>
            </View>
          </View>
        ))}
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
  balanceCards: {
    gap: THEME.spacing.medium,
    marginBottom: THEME.spacing.large,
  },
  balanceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: THEME.spacing.large,
  },
  balanceLabel: {
    fontSize: THEME.fontSize.medium,
    color: '#666',
    marginBottom: THEME.spacing.small,
  },
  balanceValue: {
    fontSize: THEME.fontSize.xlarge,
    fontWeight: 'bold',
    color: THEME.colors.primary,
    marginBottom: THEME.spacing.medium,
  },
  pendingValue: {
    color: '#FFA000',
  },
  withdrawButton: {
    marginTop: THEME.spacing.small,
  },
  sectionTitle: {
    fontSize: THEME.fontSize.large,
    fontWeight: 'bold',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.medium,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: THEME.spacing.medium,
    borderRadius: 8,
    marginBottom: THEME.spacing.medium,
  },
  historyReferral: {
    fontSize: THEME.fontSize.medium,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.small,
  },
  historyDate: {
    fontSize: THEME.fontSize.small,
    color: '#666',
  },
  historyAmount: {
    fontSize: THEME.fontSize.medium,
    fontWeight: 'bold',
    color: THEME.colors.text,
    textAlign: 'right',
    marginBottom: THEME.spacing.small,
  },
  historyStatus: {
    fontSize: THEME.fontSize.small,
    textAlign: 'right',
  },
  paidStatus: {
    color: THEME.colors.primary,
  },
});

export default CommissionsScreen;
