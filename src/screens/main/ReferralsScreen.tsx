import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';
import { THEME } from '../../constants';

// Dados mockados para exemplo
const MOCK_REFERRALS = [
  {
    id: '1',
    name: 'João Silva',
    status: 'active',
    joinDate: '2025-04-15',
    commission: 150.0,
  },
  {
    id: '2',
    name: 'Maria Santos',
    status: 'pending',
    joinDate: '2025-05-10',
    commission: 0,
  },
  // Adicione mais referências conforme necessário
];

const ReferralsScreen = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Use meu código de indicação ${currentUser?.referralCode} para se cadastrar no BioClubPlus e ganhe descontos especiais!`,
        title: 'BioClubPlus - Convite',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderReferral = ({ item }) => (
    <View style={styles.referralCard}>
      <View style={styles.referralInfo}>
        <Text style={styles.referralName}>{item.name}</Text>
        <Text style={styles.referralDate}>
          Entrou em {new Date(item.joinDate).toLocaleDateString('pt-BR')}
        </Text>
      </View>
      <View style={styles.referralStatus}>
        <Text
          style={[
            styles.statusText,
            item.status === 'active' ? styles.statusActive : styles.statusPending,
          ]}
        >
          {item.status === 'active' ? 'Ativo' : 'Pendente'}
        </Text>
        {item.status === 'active' && (
          <Text style={styles.commission}>
            R$ {item.commission.toFixed(2).replace('.', ',')}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Indicações</Text>
      </View>

      <ScrollView>
        <View style={styles.referralCode}>
          <Text style={styles.referralCodeTitle}>Seu código de indicação</Text>
          <View style={styles.codeContainer}>
            <Text style={styles.code}>{currentUser?.referralCode || ''}</Text>
            <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
              <Icon name="share-variant" size={24} color={THEME.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{currentUser?.activeReferrals || 0}</Text>
            <Text style={styles.statLabel}>Indicados Ativos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              R$ {currentUser?.commissionBalance?.toFixed(2).replace('.', ',') || '0,00'}
            </Text>
            <Text style={styles.statLabel}>Comissões</Text>
          </View>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
            onPress={() => setActiveTab('overview')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'overview' && styles.activeTabText,
              ]}
            >
              Visão Geral
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'history' && styles.activeTab]}
            onPress={() => setActiveTab('history')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'history' && styles.activeTabText,
              ]}
            >
              Histórico
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'overview' ? (
          <View style={styles.content}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Indicados Recentes</Text>
            </View>
            <FlatList
              data={MOCK_REFERRALS}
              renderItem={renderReferral}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        ) : (
          <View style={styles.content}>
            <Text style={styles.emptyText}>
              O histórico completo estará disponível em breve.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Convidar Amigos" onPress={handleShare} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    padding: THEME.spacing.large,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: THEME.fontSize.xlarge,
    fontWeight: 'bold',
    color: THEME.colors.text,
  },
  referralCode: {
    backgroundColor: '#fff',
    margin: THEME.spacing.medium,
    padding: THEME.spacing.large,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  referralCodeTitle: {
    fontSize: THEME.fontSize.medium,
    color: '#666',
    marginBottom: THEME.spacing.small,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  code: {
    fontSize: THEME.fontSize.large,
    fontWeight: 'bold',
    color: THEME.colors.primary,
  },
  shareButton: {
    padding: THEME.spacing.small,
  },
  stats: {
    flexDirection: 'row',
    margin: THEME.spacing.medium,
    gap: THEME.spacing.medium,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: THEME.spacing.large,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: THEME.fontSize.large,
    fontWeight: 'bold',
    color: THEME.colors.primary,
    marginBottom: THEME.spacing.small,
  },
  statLabel: {
    fontSize: THEME.fontSize.small,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: THEME.spacing.medium,
    marginBottom: THEME.spacing.medium,
  },
  tab: {
    flex: 1,
    paddingVertical: THEME.spacing.medium,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
  },
  activeTab: {
    borderBottomColor: THEME.colors.primary,
  },
  tabText: {
    fontSize: THEME.fontSize.medium,
    color: '#666',
  },
  activeTabText: {
    color: THEME.colors.primary,
    fontWeight: 'bold',
  },
  content: {
    padding: THEME.spacing.medium,
  },
  sectionHeader: {
    marginBottom: THEME.spacing.medium,
  },
  sectionTitle: {
    fontSize: THEME.fontSize.medium,
    fontWeight: 'bold',
    color: THEME.colors.text,
  },
  referralCard: {
    backgroundColor: '#fff',
    padding: THEME.spacing.medium,
    borderRadius: 8,
    marginBottom: THEME.spacing.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  referralInfo: {
    flex: 1,
  },
  referralName: {
    fontSize: THEME.fontSize.medium,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.small,
  },
  referralDate: {
    fontSize: THEME.fontSize.small,
    color: '#666',
  },
  referralStatus: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: THEME.fontSize.small,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.small,
  },
  statusActive: {
    color: THEME.colors.primary,
  },
  statusPending: {
    color: '#FFA000',
  },
  commission: {
    fontSize: THEME.fontSize.medium,
    fontWeight: 'bold',
    color: THEME.colors.primary,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: THEME.spacing.large,
  },
  footer: {
    padding: THEME.spacing.medium,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
});

export default ReferralsScreen;
