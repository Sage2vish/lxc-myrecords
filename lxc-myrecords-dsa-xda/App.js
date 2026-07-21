import React, { useState, useEffect } from 'react';
import { View, StyleSheet, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PinScreen from './src/screens/Auth/PinScreen';
import AppNavigator from './src/navigation/AppNavigator';
import { getDB } from './src/storage/database';
import { Colors } from './src/theme';

// Suppress known non-critical warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Require cycle:',
]);

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    // Initialize DB on app start
    getDB().then(() => setDbReady(true)).catch(console.error);
  }, []);

  if (!dbReady) {
    return <View style={styles.splash} />;
  }

  if (!authenticated) {
    return (
      <SafeAreaProvider>
        <PinScreen onAuthenticated={() => setAuthenticated(true)} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, backgroundColor: Colors.primaryDark },
});
