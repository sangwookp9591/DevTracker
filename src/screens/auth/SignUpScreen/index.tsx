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
import { colors, typography, spacing, borderRadius } from '../../../styles';
import { registerAPI } from '../../../services/api/auth';
import { DeveloperType } from '../../../store/type';
import { DEVELOPER_TYPES } from '../../../constants';

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  developerType: DeveloperType | string;
  hourlyRate: string;
  githubUsername: string;
}

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    developerType: '',
    hourlyRate: '',
    githubUsername: '',
  });
  const [errors, setErrors] = useState<Partial<SignUpFormData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 회원가입 mutation
  const signUpMutation = useMutation({
    mutationFn: registerAPI,
    onSuccess: response => {
      if (response.data?.user) {
        Alert.alert('회원가입 완료', '회원가입이 완료되었습니다. 로그인해주세요.', [
          {
            text: '확인',
            onPress: () => navigation.navigate('Login' as never),
          },
        ]);
      }
    },
    onError: (error: any) => {
      Alert.alert(
        '회원가입 실패',
        error.response?.data?.message || '회원가입에 실패했습니다. 다시 시도해주세요.',
        [{ text: '확인' }],
      );
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<SignUpFormData> = {};

    // 이메일 검증
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    // 비밀번호 검증
    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    } else if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]*$/.test(formData.password)
    ) {
      newErrors.password = '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.';
    }

    // 비밀번호 확인 검증
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    // 닉네임 검증
    if (!formData.nickname.trim()) {
      newErrors.nickname = '닉네임을 입력해주세요.';
    } else if (formData.nickname.length < 2) {
      newErrors.nickname = '닉네임은 2자 이상이어야 합니다.';
    }

    // 개발자 타입 검증
    if (!formData.developerType) {
      newErrors.developerType = '개발자 타입을 선택해주세요.';
    }

    // 시급 검증 (선택사항이지만 입력시 검증)
    if (
      formData.hourlyRate &&
      (isNaN(Number(formData.hourlyRate)) || Number(formData.hourlyRate) < 0)
    ) {
      newErrors.hourlyRate = '올바른 시급을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = () => {
    if (validateForm()) {
      const submitData = {
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        nickname: formData.nickname.trim(),
        developerType: formData.developerType as DeveloperType,
        hourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : undefined,
        githubUsername: formData.githubUsername.trim() || undefined,
      };

      signUpMutation.mutate(submitData);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login' as never);
  };

  const updateFormData = (field: keyof SignUpFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 에러 클리어
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const selectDeveloperType = (type: DeveloperType) => {
    updateFormData('developerType', type);
  };

  if (signUpMutation.isPending) {
    return <LoadingSpinner message="회원가입 처리 중..." overlay />;
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
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>

            <Text style={styles.title}>회원가입</Text>
            <Text style={styles.subtitle}>개발자 정보를 입력해주세요</Text>
          </View>

          {/* Form */}
          <Card variant="elevated" style={styles.formCard}>
            {/* 기본 정보 */}
            <Text style={styles.sectionTitle}>기본 정보</Text>

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
              placeholder="영문, 숫자, 특수문자 포함 8자 이상"
              secureTextEntry={!showPassword}
              leftIcon="lock"
              rightIcon={showPassword ? 'eye-off' : 'eye'}
              onRightIconPress={() => setShowPassword(!showPassword)}
              error={errors.password}
              required
            />

            <Input
              label="비밀번호 확인"
              value={formData.confirmPassword}
              onChangeText={value => updateFormData('confirmPassword', value)}
              placeholder="비밀번호를 다시 입력하세요"
              secureTextEntry={!showConfirmPassword}
              leftIcon="lock-check"
              rightIcon={showConfirmPassword ? 'eye-off' : 'eye'}
              onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
              error={errors.confirmPassword}
              required
            />

            <Input
              label="닉네임"
              value={formData.nickname}
              onChangeText={value => updateFormData('nickname', value)}
              placeholder="개발자님"
              leftIcon="account"
              error={errors.nickname}
              required
            />

            {/* 개발자 타입 선택 */}
            <Text style={styles.sectionTitle}>당신의 전문 분야는?</Text>
            {errors.developerType && <Text style={styles.errorText}>{errors.developerType}</Text>}

            <View style={styles.developerTypeGrid}>
              {DEVELOPER_TYPES.map(type => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.developerTypeCard,
                    formData.developerType === type.value && styles.selectedTypeCard,
                  ]}
                  onPress={() => selectDeveloperType(type.value as DeveloperType)}
                >
                  <Text style={styles.typeIcon}>{type.icon}</Text>
                  <Text
                    style={[
                      styles.typeLabel,
                      formData.developerType === type.value && styles.selectedTypeLabel,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 추가 정보 */}
            <Text style={styles.sectionTitle}>추가 정보 (선택)</Text>

            <Input
              label="시간당 요금"
              value={formData.hourlyRate}
              onChangeText={value => updateFormData('hourlyRate', value)}
              placeholder="50000"
              keyboardType="numeric"
              leftIcon="currency-krw"
              error={errors.hourlyRate}
            />

            <Input
              label="GitHub 사용자명"
              value={formData.githubUsername}
              onChangeText={value => updateFormData('githubUsername', value)}
              placeholder="developer123"
              autoCapitalize="none"
              leftIcon="github"
              error={errors.githubUsername}
            />

            <Button
              title="시작하기"
              onPress={handleSignUp}
              variant="primary"
              size="lg"
              style={styles.signUpButton}
              disabled={signUpMutation.isPending}
              loading={signUpMutation.isPending}
            />
          </Card>

          {/* GitHub OAuth Alternative */}
          <Card variant="outlined" style={styles.oauthCard}>
            <Text style={styles.oauthTitle}>또는</Text>

            <Button
              title="GitHub 계정으로 시작"
              onPress={() => {
                Alert.alert('GitHub 연동', 'GitHub 계정으로 간편하게 가입하시겠습니까?');
              }}
              variant="outline"
              size="lg"
              style={styles.githubButton}
              textStyle={styles.githubButtonText}
              icon={<Icon name="github" size={20} color={colors.text} style={styles.githubIcon} />}
            />
          </Card>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginPrompt}>이미 계정이 있으신가요? </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>로그인</Text>
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
    paddingTop: 50,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: spacing.xs,
  },
  title: {
    ...typography.heading2,
    color: colors.text,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formCard: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.heading4,
    color: colors.text,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  developerTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  developerTypeCard: {
    width: '48%',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  selectedTypeCard: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  typeLabel: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  selectedTypeLabel: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  signUpButton: {
    marginTop: spacing.lg,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  loginPrompt: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  loginLink: {
    ...typography.body2,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginBottom: spacing.sm,
  },
});

export default SignUpScreen;
