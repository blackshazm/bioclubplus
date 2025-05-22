import { StatusBar } from 'expo-status-bar';
import Navigation from './src/navigation';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <ThemeProvider>
            <Navigation />
            <StatusBar style="auto" />
          </ThemeProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}
