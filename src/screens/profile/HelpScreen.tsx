import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { THEME } from '../../constants';

const HELP_SECTIONS = [
  {
    title: 'Perguntas Frequentes',
    items: [
      {
        question: 'Como funciona o programa de indicação?',
        answer: 'Você pode indicar amigos usando seu código único. Quando eles se cadastrarem e fizerem a primeira compra, você receberá uma comissão.',
      },
      {
        question: 'Quanto tempo leva para receber minha comissão?',
        answer: 'As comissões ficam disponíveis para saque 30 dias após a confirmação da compra do indicado.',
      },
      {
        question: 'Como faço para sacar minhas comissões?',
        answer: 'Acesse a seção "Comissões" no seu perfil e clique em "Solicitar Saque". O valor mínimo para saque é R$ 50,00.',
      },
    ],
  },
  {
    title: 'Contato',
    items: [
      {
        icon: 'whatsapp',
        text: 'WhatsApp',
        action: () => Linking.openURL('https://wa.me/5511999999999'),
      },
      {
        icon: 'email',
        text: 'E-mail',
        action: () => Linking.openURL('mailto:suporte@bioclubplus.com.br'),
      },
      {
        icon: 'instagram',
        text: 'Instagram',
        action: () => Linking.openURL('https://instagram.com/bioclubplus'),
      },
    ],
  },
];

const HelpScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Ajuda</Text>

        {HELP_SECTIONS.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            {section.items.map((item, itemIndex) => {
              if ('question' in item) {
                return (
                  <View key={itemIndex} style={styles.faqItem}>
                    <Text style={styles.question}>{item.question}</Text>
                    <Text style={styles.answer}>{item.answer}</Text>
                  </View>
                );
              } else {
                return (
                  <TouchableOpacity
                    key={itemIndex}
                    style={styles.contactItem}
                    onPress={item.action}
                  >
                    <Icon name={item.icon} size={24} color={THEME.colors.primary} />
                    <Text style={styles.contactText}>{item.text}</Text>
                    <Icon name="chevron-right" size={24} color="#666" />
                  </TouchableOpacity>
                );
              }
            })}
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
  section: {
    marginBottom: THEME.spacing.large,
  },
  sectionTitle: {
    fontSize: THEME.fontSize.large,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.medium,
    color: THEME.colors.text,
  },
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: THEME.spacing.medium,
    marginBottom: THEME.spacing.medium,
  },
  question: {
    fontSize: THEME.fontSize.medium,
    fontWeight: 'bold',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.small,
  },
  answer: {
    fontSize: THEME.fontSize.medium,
    color: '#666',
    lineHeight: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: THEME.spacing.medium,
    borderRadius: 12,
    marginBottom: THEME.spacing.medium,
  },
  contactText: {
    flex: 1,
    marginLeft: THEME.spacing.medium,
    fontSize: THEME.fontSize.medium,
    color: THEME.colors.text,
  },
});

export default HelpScreen;
