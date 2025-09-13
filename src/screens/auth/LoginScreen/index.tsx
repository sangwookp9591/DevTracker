import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { colors, typography, spacing } from '../../../styles';
import { useAuthStore } from '../../../store';
import { loginAPI } from '../../../services/api/auth';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const { login } = useAuthStore();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [showPassword, setShowPassword] = useState(false);

  // 로그인 mutation
  const loginMutation = useMutation({
    mutationFn: loginAPI,
    onSuccess: response => {
      if (response && response.data) {
        login(response.data.user, response.data?.token);
        navigation.navigate('MainTabs' as never);
      }
    },
    onError: (error: any) => {
      Alert.alert(
        '로그인 실패',
        error.response?.data?.message || '로그인에 실패했습니다. 다시 시도해주세요.',
        [{ text: '확인' }],
      );
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validateForm()) {
      loginMutation.mutate(formData);
    }
  };

  const handleGitHubLogin = () => {
    // GitHub OAuth2 로그인 처리
    // 실제로는 WebView나 인앱 브라우저를 통해 처리
    Alert.alert('GitHub 로그인', 'GitHub 계정으로 로그인하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '확인',
        onPress: () => {
          // TODO: GitHub OAuth2 처리
          console.log('GitHub OAuth2 login');
        },
      },
    ]);
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp' as never);
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword' as never);
  };

  const updateFormData = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 에러 클리어
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (loginMutation.isPending) {
    return <LoadingSpinner message="로그인 중..." overlay />;
  }

  return (
    <>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>⚡</Text>
              </View>
              <Text style={styles.appTitle}>DevTracker</Text>
            </View>
            <Text style={styles.subtitle}>개발자를 위한 스마트 시간 추적</Text>
          </View>

          {/* Login Form */}
          <Card variant="elevated" style={styles.formCard}>
            <Text style={styles.formTitle}>로그인</Text>

            <Input
              label="이메일"
              value={formData.email}
              onChangeText={value => updateFormData('email', value)}
              placeholder="developer@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="email"
              error={errors.email}
              required
            />

            <Input
              label="비밀번호"
              value={formData.password}
              onChangeText={value => updateFormData('password', value)}
              placeholder="비밀번호를 입력하세요"
              secureTextEntry={!showPassword}
              leftIcon="lock"
              rightIcon={showPassword ? 'eye-off' : 'eye'}
              onRightIconPress={() => setShowPassword(!showPassword)}
              error={errors.password}
              required
            />

            <TouchableOpacity style={styles.forgotPasswordContainer} onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>비밀번호를 잊으셨나요?</Text>
            </TouchableOpacity>

            <Button
              title="로그인"
              onPress={handleLogin}
              variant="primary"
              size="lg"
              style={styles.loginButton}
              disabled={loginMutation.isPending}
              loading={loginMutation.isPending}
            />
          </Card>

          {/* OAuth Login */}
          <Card variant="outlined" style={styles.oauthCard}>
            <Text style={styles.oauthTitle}>또는</Text>

            <Button
              title="GitHub 계정으로 로그인"
              onPress={handleGitHubLogin}
              variant="outline"
              size="lg"
              style={styles.githubButton}
              textStyle={styles.githubButtonText}
              icon={<Icon name="github" size={20} color={colors.text} style={styles.githubIcon} />}
            />
          </Card>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpPrompt}>계정이 없으신가요? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpLink}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logo: {
    width: 60,
    height: 60,
    backgroundColor: colors.primary,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  logoText: {
    fontSize: 24,
    color: colors.white,
  },
  appTitle: {
    ...typography.heading2,
    color: colors.text,
    fontWeight: typography.fontWeight.bold,
  },
  subtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formCard: {
    marginBottom: spacing.lg,
  },
  formTitle: {
    ...typography.heading3,
    color: colors.text,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    ...typography.body2,
    color: colors.primary,
  },
  loginButton: {
    marginTop: spacing.sm,
  },
  oauthCard: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  oauthTitle: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  githubButton: {
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  githubButtonText: {
    color: colors.text,
    marginLeft: spacing.sm,
  },
  githubIcon: {
    marginRight: spacing.xs,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  signUpPrompt: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  signUpLink: {
    ...typography.body2,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
});

export default LoginScreen;
