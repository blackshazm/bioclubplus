import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Button from '../../components/Button';
import { THEME } from '../../constants';

// Mock data - substitua pelos dados reais
const MOCK_PLANS = [
  {
    id: '1',
    name: 'Plano Básico',
    price: 49.90,
    benefits: [
      'Acesso a todos os produtos',
      'Desconto de 5% em todas as compras',
      'Frete grátis em compras acima de R$ 150',
    ],
  },
  {
    id: '2',
    name: 'Plano Premium',
    price: 99.90,
    benefits: [
      'Acesso antecipado a novos produtos',
      'Desconto de 15% em todas as compras',
      'Frete grátis em todas as compras',
      'Suporte prioritário',
      'Consultoria nutricional mensal',
    ],
  },
];

const SubscriptionsScreen = () => {
  const handleSubscribe = (planId: string) => {
    // TODO: Implementar assinatura do plano
    console.log('Assinar plano:', planId);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Planos de Assinatura</Text>
        <Text style={styles.subtitle}>
          Escolha o melhor plano para você e aproveite benefícios exclusivos
        </Text>

        {MOCK_PLANS.map((plan) => (
          <View key={plan.id} style={styles.planCard}>
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planPrice}>
              R$ {plan.price.toFixed(2).replace('.', ',')}
              <Text style={styles.perMonth}>/mês</Text>
            </Text>

            <Text style={styles.benefitsTitle}>Benefícios:</Text>
            {plan.benefits.map((benefit, index) => (
              <Text key={index} style={styles.benefit}>
                • {benefit}
              </Text>
            ))}

            <Button
              title="Assinar Plano"
              onPress={() => handleSubscribe(plan.id)}
              style={styles.subscribeButton}
            />
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
    marginBottom: THEME.spacing.small,
    color: THEME.colors.text,
  },
  subtitle: {
    fontSize: THEME.fontSize.medium,
    color: '#666',
    marginBottom: THEME.spacing.large,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: THEME.spacing.large,
    marginBottom: THEME.spacing.large,
  },
  planName: {
    fontSize: THEME.fontSize.large,
    fontWeight: 'bold',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.small,
  },
  planPrice: {
    fontSize: THEME.fontSize.xlarge,
    fontWeight: 'bold',
    color: THEME.colors.primary,
    marginBottom: THEME.spacing.medium,
  },
  perMonth: {
    fontSize: THEME.fontSize.medium,
    color: '#666',
  },
  benefitsTitle: {
    fontSize: THEME.fontSize.medium,
    fontWeight: 'bold',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.small,
  },
  benefit: {
    fontSize: THEME.fontSize.medium,
    color: '#666',
    marginBottom: THEME.spacing.small,
  },
  subscribeButton: {
    marginTop: THEME.spacing.medium,
  },
});

export default SubscriptionsScreen;
