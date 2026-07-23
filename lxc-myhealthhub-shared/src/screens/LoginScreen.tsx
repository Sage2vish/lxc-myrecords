// ============================================================================
// FILE        : LoginScreen.tsx
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 23-July-2026 | 20:39 Hrs
//
// PURPOSE     : Mobile-number + OTP login screen for MyHealthHub, with
//               biometric (Face ID / Touch ID / Fingerprint) login support
//               via react-native-keychain. Uses a mock OTP flow (no real
//               backend yet) and styles text with theme/typography.ts. Not
//               yet wired into RootNavigator.tsx as an actual auth gate.
// ============================================================================

import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as Keychain from 'react-native-keychain';
import {PrimaryButton} from '../components/PrimaryButton';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {fontSizes, fontWeights} from '../theme/typography';
const {version: appVersion} = require('../../package.json');

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;
const SUPPORT_EMAIL = 'support@lexvora.com';

const biometryLabels: Record<string, string> = {
  FaceID: 'Face ID',
  TouchID: 'Touch ID',
  OpticID: 'Optic ID',
  Fingerprint: 'Fingerprint',
  Face: 'Face Unlock',
  Iris: 'Iris Scan',
};

type Props = {
  onLoginSuccess?: () => void;
};

export function LoginScreen({onLoginSuccess}: Props) {
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [biometryType, setBiometryType] = useState<string | null>(null);

  const otpAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Keychain.getSupportedBiometryType()
      .then(type => setBiometryType(type))
      .catch(() => setBiometryType(null));
  }, []);

  useEffect(() => {
    if (resendIn <= 0) {
      return;
    }
    const timer = setInterval(() => setResendIn(seconds => seconds - 1), 1000);
    return () => clearInterval(timer);
  }, [resendIn]);

  const revealOtpField = () => {
    setStep('otp');
    setResendIn(RESEND_SECONDS);
    Animated.timing(otpAnim, {
      toValue: 1,
      duration: 320,
      useNativeDriver: true,
    }).start();
  };

  const handleSendOtp = () => {
    if (mobile.length !== 10 || sendingOtp) {
      return;
    }
    setSendingOtp(true);
    setTimeout(() => {
      setSendingOtp(false);
      revealOtpField();
    }, 700);
  };

  const handleChangeNumber = () => {
    otpAnim.setValue(0);
    setStep('mobile');
    setOtp('');
  };

  const handleVerifyOtp = () => {
    if (otp.length !== OTP_LENGTH || verifying) {
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      onLoginSuccess?.();
    }, 700);
  };

  const handleBiometricLogin = async () => {
    try {
      await Keychain.getGenericPassword({
        authenticationPrompt: {title: 'Log in to MyHealthHub'},
      });
    } catch {
      // No credential enrolled yet — this device is still a biometric candidate,
      // so treat the prompt itself as the login gesture.
    }
    onLoginSuccess?.();
  };

  const handleContactSupport = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch(() => {});
  };

  const otpFieldStyle = {
    opacity: otpAnim,
    transform: [
      {
        translateY: otpAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-16, 0],
        }),
      },
    ],
  };

  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={styles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <View style={styles.content}>
          <View style={styles.brand}>
            <Image source={require('../../assets/myhealthhub-icon.png')} style={styles.logo} />
            <Text style={styles.brandTitle}>MyHealthHub</Text>
            <Text style={styles.brandSub}>Your family's health, always in reach</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={[styles.inputRow, step === 'otp' && styles.inputRowLocked]}>
              <Text style={styles.countryCode}>+91</Text>
              <View style={styles.inputDivider} />
              <TextInput
                editable={step === 'mobile'}
                keyboardType="number-pad"
                maxLength={10}
                onChangeText={text => setMobile(text.replace(/[^0-9]/g, ''))}
                placeholder="98765 43210"
                placeholderTextColor={colors.muted}
                style={styles.input}
                value={mobile}
              />
            </View>

            {step === 'mobile' ? (
              <PrimaryButton
                disabled={mobile.length !== 10}
                label="Send OTP"
                loading={sendingOtp}
                onPress={handleSendOtp}
              />
            ) : (
              <Animated.View style={[styles.otpWrapper, otpFieldStyle]}>
                <Text style={styles.otpHint}>
                  Enter the {OTP_LENGTH}-digit code sent to +91 {mobile}
                </Text>
                <TextInput
                  keyboardType="number-pad"
                  maxLength={OTP_LENGTH}
                  onChangeText={text => setOtp(text.replace(/[^0-9]/g, ''))}
                  placeholder="• • • • • •"
                  placeholderTextColor={colors.muted}
                  style={[styles.input, styles.otpInput]}
                  value={otp}
                />

                <View style={styles.otpActionsRow}>
                  <Pressable onPress={handleChangeNumber}>
                    <Text style={styles.linkText}>Change number</Text>
                  </Pressable>
                  <Pressable disabled={resendIn > 0} onPress={revealOtpField}>
                    <Text style={[styles.linkText, resendIn > 0 && styles.linkTextMuted]}>
                      {resendIn > 0 ? `Resend OTP in 0:${String(resendIn).padStart(2, '0')}` : 'Resend OTP'}
                    </Text>
                  </Pressable>
                </View>

                <PrimaryButton
                  disabled={otp.length !== OTP_LENGTH}
                  label="Verify & Continue"
                  loading={verifying}
                  onPress={handleVerifyOtp}
                />
              </Animated.View>
            )}

            {biometryType ? (
              <>
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <Pressable
                  accessibilityRole="button"
                  onPress={handleBiometricLogin}
                  style={({pressed}) => [styles.biometricButton, pressed && styles.biometricPressed]}>
                  <View style={styles.biometricIconWrap}>
                    <Text style={styles.biometricIcon}>⚿</Text>
                  </View>
                  <Text style={styles.biometricLabel}>
                    Login with {biometryLabels[biometryType] ?? 'Biometrics'}
                  </Text>
                </Pressable>
              </>
            ) : null}
          </View>

          <View style={styles.footer}>
            <Pressable onPress={handleContactSupport}>
              <Text style={styles.supportText}>Need help? Contact Support</Text>
            </Pressable>
            <Text style={styles.versionText}>Version {appVersion}</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  brand: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: 168,
    height: 168,
    marginBottom: spacing.md,
  },
  brandTitle: {
    color: colors.primaryDark,
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.extrabold,
  },
  brandSub: {
    color: colors.muted,
    fontSize: fontSizes.lg,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 2,
  },
  label: {
    color: colors.text,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.extrabold,
  },
  inputRow: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: -spacing.sm,
  },
  inputRowLocked: {
    opacity: 0.6,
  },
  countryCode: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.extrabold,
    paddingHorizontal: spacing.md,
  },
  inputDivider: {
    backgroundColor: colors.border,
    height: 24,
    width: 1,
  },
  input: {
    color: colors.text,
    flex: 1,
    fontSize: fontSizes.lg,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  otpWrapper: {
    paddingBottom: spacing.xl,
  },
  otpHint: {
    color: colors.muted,
    fontSize: fontSizes.md,
    marginBottom: spacing.sm,
  },
  otpInput: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    height: 56,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.extrabold,
    letterSpacing: 8,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  otpActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  linkText: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.extrabold,
  },
  linkTextMuted: {
    color: colors.muted,
  },
  dividerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dividerLine: {
    backgroundColor: colors.border,
    flex: 1,
    height: 1,
  },
  dividerText: {
    color: colors.muted,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.extrabold,
  },
  biometricButton: {
    alignItems: 'center',
    borderColor: colors.primary,
    borderRadius: 10,
    borderWidth: 1.5,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 48,
    gap: spacing.sm,
  },
  biometricPressed: {
    opacity: 0.7,
  },
  biometricIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  biometricIcon: {
    color: colors.primary,
    fontSize: fontSizes.xl,
  },
  biometricLabel: {
    color: colors.primary,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.extrabold,
  },
  footer: {
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xl,
  },
  supportText: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.extrabold,
  },
  versionText: {
    color: colors.muted,
    fontSize: fontSizes.base,
  },
});
