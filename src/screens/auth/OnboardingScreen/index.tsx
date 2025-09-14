import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Button from '../../../components/common/Button';
import { colors, typography, spacing, borderRadius } from '../../../styles';

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: '개발 시간을 정확히\n추적하고 계신가요?',
    subtitle: '문제 인식',
    description: '실제 개발시간과 청구시간의\n차이로 고민하고 계시나요?',
    icon: '💻',
    color: colors.primary,
  },
  {
    id: 2,
    title: 'Git 커밋 기반\n자동 시간 추적',
    subtitle: '스마트한 솔루션',
    description: '커밋 패턴을 분석해서\n실제 작업시간을 자동으로 계산해드려요',
    icon: '⚡',
    color: colors.primary,
  },
  {
    id: 3,
    title: '생산성 분석과\n수익 최적화',
    subtitle: '성장하는 개발자',
    description: '개발 패턴을 분석하고\n수익을 최적화해보세요',
    icon: '📈',
    color: colors.primary,
  },
];

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < onboardingSteps.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      // 마지막 단계에서 로그인 화면으로 이동
      navigation.navigate('Auth' as never);
    }
  };

  const handleSkip = () => {
    navigation.navigate('Auth' as never);
  };

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentIndex(index);
  };

  const renderStep = ({ item }: { item: OnboardingStep }) => (
    <View style={[styles.stepContainer, { backgroundColor: item.color }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{item.icon}</Text>
        </View>

        <Text style={styles.subtitle}>{item.subtitle}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>

        {item.id === 1 && (
          <View style={styles.exampleContainer}>
            <View style={styles.exampleRow}>
              <Text style={styles.exampleLabel}>⏱️ 실제 개발:</Text>
              <Text style={styles.exampleValue}>6시간</Text>
            </View>
            <View style={styles.exampleRow}>
              <Text style={styles.exampleLabel}>💰 청구 시간:</Text>
              <Text style={styles.exampleValue}>4시간?</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {onboardingSteps.map((_, index) => (
        <View
          key={index}
          style={[styles.dot, index === currentIndex ? styles.activeDot : styles.inactiveDot]}
        />
      ))}
    </View>
  );

  return (
    <>
      <StatusBar backgroundColor={onboardingSteps[currentIndex].color} barStyle="light-content" />
      <View style={styles.container}>
        {/* Skip Button */}
        <View style={styles.header}>
          <Button
            title="건너뛰기"
            onPress={handleSkip}
            variant="text"
            style={styles.skipButton}
            textStyle={styles.skipButtonText}
          />
        </View>

        {/* Onboarding Steps */}
        <FlatList
          ref={flatListRef}
          data={onboardingSteps}
          renderItem={renderStep}
          keyExtractor={item => item.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          style={styles.flatList}
        />

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {renderPagination()}

          <View style={styles.buttonContainer}>
            <Button
              title={currentIndex === onboardingSteps.length - 1 ? '시작하기' : '다음'}
              onPress={handleNext}
              variant="primary"
              size="lg"
              style={[styles.nextButton, { backgroundColor: colors.white }]}
              textStyle={[styles.nextButtonText, { color: onboardingSteps[currentIndex].color }]}
            />
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    position: 'absolute',
    top: 50,
    right: spacing.md,
    zIndex: 10,
  },
  skipButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  skipButtonText: {
    color: colors.white,
    opacity: 0.8,
  },
  flatList: {
    flex: 1,
  },
  stepContainer: {
    width: screenWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: colors.white,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    shadowColor: colors.primaryDark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    fontSize: 48,
  },
  subtitle: {
    ...typography.caption,
    color: colors.white,
    opacity: 0.9,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.heading2,
    color: colors.white,
    textAlign: 'center',
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.md,
    lineHeight: typography.lineHeight.base,
  },
  description: {
    ...typography.body1,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: typography.lineHeight.xl,
  },
  exampleContainer: {
    marginTop: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: 200,
  },
  exampleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  exampleLabel: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  exampleValue: {
    ...typography.body2,
    color: colors.text,
    fontWeight: typography.fontWeight.semibold,
  },
  bottomSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 50,
    backgroundColor: 'transparent',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: spacing.xs / 2,
  },
  activeDot: {
    backgroundColor: colors.white,
    width: 24,
  },
  inactiveDot: {
    backgroundColor: colors.white,
    opacity: 0.4,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  nextButton: {
    minWidth: 200,
    shadowColor: colors.primaryDark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  nextButtonText: {
    fontWeight: typography.fontWeight.bold,
  },
});

export default OnboardingScreen;
