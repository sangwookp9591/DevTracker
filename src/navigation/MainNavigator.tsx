import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './type';
import { colors } from '@styles/colors';
import HomeScreen from '@screens/main/HomeScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  const renderTabIcon = (
    routeName: string,
    focused: boolean,
    color: string,
    size: number,
  ) => {
    let iconName: string;
    switch (routeName) {
      case 'Home':
        iconName = focused ? 'home' : 'home-outline';
        break;
      case 'Tracking':
        iconName = focused ? 'timer' : 'timer-outline';
        break;
      case 'Projects':
        iconName = focused ? 'briefcase' : 'briefcase-outline';
        break;
      case 'Analytics':
        iconName = focused ? 'chart-line' : 'chart-line-variant';
        break;
      case 'Profile':
        iconName = focused ? 'account' : 'account-outline';
        break;
      default:
        iconName = 'circle';
    }
    return <Icon name={iconName} size={size} color={color} />;
  };
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) =>
          renderTabIcon(route.name, focused, color, size),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: '홈' }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
