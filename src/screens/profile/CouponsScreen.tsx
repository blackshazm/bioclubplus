import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { THEME } from '../../constants';

// Mock data - substitua pelos dados reais
const MOCK_COUPONS = [
  {
    id: '1',
    code: 'BEMVINDO20',
    discount: 20,
    type: 'percentage',
    minValue: 100,
    expiresAt: '2025-06-30',
    used: false,
  },
  {
    id: '2',
    code: 'FRETEGRATIS',
    discount: 0,
    type: 'shipping',
    minValue: 200,
    expiresAt: '2025-12-31',
    used: false,
  },
];

const CouponsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Meus Cupons</Text>

        {MOCK_COUPONS.map((coupon) => (
          <View key={coupon.id} style={styles.couponCard}>
            <View style={styles.couponHeader}>
              <Text style={styles.couponCode}>{coupon.code}</Text>
              <View style={[
                styles.statusBadge,
                coupon.used ? styles.usedBadge : styles.activeBadge,
              ]}>
                <Text style={[
                  styles.statusText,
                  coupon.used ? styles.usedText : styles.activeText,
                ]}>
                  {coupon.used ? 'Usado' : 'Ativo'}
                </Text>
              </View>
            </View>

            <Text style={styles.discountText}>
              {coupon.type === 'percentage'
                ? `${coupon.discount}% de desconto`
                : 'Frete Grátis'}
            </Text>

            <Text style={styles.conditionText}>
              Pedido mínimo: R$ {coupon.minValue.toFixed(2).replace('.', ',')}
            </Text>

            <Text style={styles.expiryText}>
              Válido até {new Date(coupon.expiresAt).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        ))}

        {MOCK_COUPONS.length === 0 && (
          <Text style={styles.emptyText}>
            Você não possui cupons disponíveis no momento.
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
  content: {
    padding: THEME.spacing.large,
  },
  title: {
    fontSize: THEME.fontSize.xlarge,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.large,
    color: THEME.colors.text,
  },
  couponCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: THEME.spacing.large,
    marginBottom: THEME.spacing.medium,
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.medium,
  },
  couponCode: {
    fontSize: THEME.fontSize.large,
    fontWeight: 'bold',
    color: THEME.colors.text,
  },
  statusBadge: {
    paddingHorizontal: THEME.spacing.medium,
    paddingVertical: THEME.spacing.small,
    borderRadius: 16,
  },
  activeBadge: {
    backgroundColor: `${THEME.colors.primary}20`,
  },
  usedBadge: {
    backgroundColor: '#66666620',
  },
  statusText: {
    fontSize: THEME.fontSize.small,
    fontWeight: 'bold',
  },
  activeText: {
    color: THEME.colors.primary,
  },
  usedText: {
    color: '#666',
  },
  discountText: {
    fontSize: THEME.fontSize.medium,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.small,
  },
  conditionText: {
    fontSize: THEME.fontSize.medium,
    color: '#666',
    marginBottom: THEME.spacing.small,
  },
  expiryText: {
    fontSize: THEME.fontSize.small,
    color: '#666',
  },
  emptyText: {
    fontSize: THEME.fontSize.medium,
    color: '#666',
    textAlign: 'center',
    marginTop: THEME.spacing.xlarge,
  },
});

export default CouponsScreen;
