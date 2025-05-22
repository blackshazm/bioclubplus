import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { THEME } from '../../constants';

const UserProfileScreen = () => {
  const navigation = useNavigation();
  const { currentUser, logout } = useAuth();

  const menuItems = [
    {
      icon: 'account-edit',
      title: 'Editar Perfil',
      screen: 'EditProfile',
    },
    {
      icon: 'credit-card',
      title: 'Métodos de Pagamento',
      screen: 'PaymentMethods',
    },
    {
      icon: 'star',
      title: 'Planos',
      screen: 'Subscriptions',
    },
    {
      icon: 'cash',
      title: 'Comissões',
      screen: 'Commissions',
    },
    {
      icon: 'ticket-percent',
      title: 'Cupons',
      screen: 'Coupons',
    },
    {
      icon: 'help-circle',
      title: 'Ajuda',
      screen: 'Help',
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>
          {currentUser?.displayName}
        </Text>
        <Text style={styles.email}>
          {currentUser?.email}
        </Text>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Icon name={item.icon} size={24} color={THEME.colors.text} />
            <Text style={styles.menuItemText}>{item.title}</Text>
            <Icon name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={24} color={THEME.colors.error} />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    padding: THEME.spacing.large,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  name: {
    fontSize: THEME.fontSize.xlarge,
    fontWeight: 'bold',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.small,
  },
  email: {
    fontSize: THEME.fontSize.medium,
    color: '#666',
  },
  menu: {
    backgroundColor: '#fff',
    marginTop: THEME.spacing.medium,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    flex: 1,
    marginLeft: THEME.spacing.medium,
    fontSize: THEME.fontSize.medium,
    color: THEME.colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: THEME.spacing.medium,
    padding: THEME.spacing.medium,
  },
  logoutText: {
    marginLeft: THEME.spacing.medium,
    fontSize: THEME.fontSize.medium,
    color: THEME.colors.error,
  },
});

export default UserProfileScreen;
