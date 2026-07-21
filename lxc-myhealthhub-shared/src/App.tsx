import React, {useRef, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AccountMenu} from './components/AccountMenu';
import {AccountMenuProvider} from './context/AccountMenuContext';
import {RootNavigator, RootTabParamList} from './navigation/RootNavigator';
import {LoginScreen} from './screens/LoginScreen';
import {colors} from './theme/colors';

const queryClient = new QueryClient();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const navigationRef = useRef<NavigationContainerRef<RootTabParamList>>(null);

  const handleViewProfile = () => {
    setMenuVisible(false);
    navigationRef.current?.navigate('Profile');
  };

  const handleLogout = () => {
    setMenuVisible(false);
    setIsAuthenticated(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        {isAuthenticated ? (
          <AccountMenuProvider openMenu={() => setMenuVisible(true)}>
            <View style={styles.flex}>
              <NavigationContainer ref={navigationRef}>
                <RootNavigator />
              </NavigationContainer>
              <AccountMenu
                visible={menuVisible}
                onClose={() => setMenuVisible(false)}
                onViewProfile={handleViewProfile}
                onLogout={handleLogout}
              />
            </View>
          </AccountMenuProvider>
        ) : (
          <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />
        )}
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
