import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing } from '../../../styles';
import { useAuthStore } from '../../../store';

const SplashScreen: React.FC = () => {
  const navigation = useNavigation();

  const { isAuthenticated } = useAuthStore();
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const scaleAnim = useMemo(() => new Animated.Value(0.8), []);

  useEffect(() => {
    // 애니메이션 시작
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // 2초 후 다음 화면으로 이동
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigation.navigate('MainTabs' as never);
      } else {
        navigation.navigate('Onboarding' as never);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, isAuthenticated, fadeAnim, scaleAnim]);

  return (
    <>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoIcon}>⚡</Text>
            </View>
            <Text style={styles.appName}>DevTracker</Text>
          </View>

          <Text style={styles.tagline}>개발자를 위한{'\n'}스마트 시간 추적</Text>

          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.pink,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 36,
  },
  appName: {
    ...typography.heading1,
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  tagline: {
    ...typography.heading3,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: spacing.xl,
    lineHeight: typography.lineHeight.sm,
  },
  loadingContainer: {
    marginTop: spacing.xl,
  },
  loadingText: {
    ...typography.body2,
    color: colors.white,
    opacity: 0.7,
  },
});

export default SplashScreen;
