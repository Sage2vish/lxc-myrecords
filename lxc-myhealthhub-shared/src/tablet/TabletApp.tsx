import React from 'react';
import {StatusBar} from 'react-native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {TabletHomeScreen} from './screens/TabletHomeScreen';

const queryClient = new QueryClient();

export default function TabletApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <TabletHomeScreen />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
