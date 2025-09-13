import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from './styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppNavigator from './navigation/AppNavigator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5분
      refetchOnWindowFocus: false, // 앱이 포커스될 때 refetch 금지 (모바일에서는 기본 false)
      refetchOnReconnect: true, // 네트워크 재연결 시 refetch
    },
    mutations: {
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <AppNavigator />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default App;
