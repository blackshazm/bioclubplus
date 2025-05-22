import { StyleSheet, View, Text } from 'react-native';
import Button from '../components/Button';
import { THEME } from '../constants';
import { useLoading } from '../hooks/useLoading';

export default function HomeScreen() {
  const { isLoading, startLoading, stopLoading } = useLoading();

  const handleExplore = async () => {
    startLoading();
    // Simular uma ação assíncrona
    setTimeout(() => {
      stopLoading();
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao BioClubPlus</Text>
      <Text style={styles.subtitle}>Seu aplicativo de biologia</Text>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Explorar"
          onPress={handleExplore}
          loading={isLoading}
        />
        <Button
          title="Sobre"
          variant="secondary"
          onPress={() => {}}
          style={styles.secondaryButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing.medium,
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
  buttonContainer: {
    width: '100%',
    gap: THEME.spacing.medium,
    marginTop: THEME.spacing.large,
  },
  secondaryButton: {
    marginTop: THEME.spacing.small,
  },
});
