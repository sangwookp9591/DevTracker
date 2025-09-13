import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainNavigator from './MainNavigator';
import { RootStackParamList } from './type';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import { useAuthStore } from '../store';
import AuthNavigator from './AuthNavigator';
import SplashScreen from '../screens/splash/SplashScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticated /*isFirstLaunch,checkAuthStatus*/ } = useAuthStore();

  // useEffect(() => {
  //   checkAuthStatus();
  // }, [checkAuthStatus]);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ animationTypeForReplace: 'push' }}
        />
        {!isAuthenticated ? (
          <>
            {/* {isFirstLaunch && (
              <Stack.Screen
                name="Onboarding"
                component={OnboardingScreen}
                options={{ animationTypeForReplace: 'push' }}
              />
            )} */}
            <Stack.Screen
              name="Onboarding"
              component={OnboardingScreen}
              options={{ animationTypeForReplace: 'push' }}
            />
            <Stack.Screen
              name="Auth"
              component={AuthNavigator}
              options={{ animationTypeForReplace: 'pop' }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Main"
            component={MainNavigator}
            options={{ animationTypeForReplace: 'push' }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
