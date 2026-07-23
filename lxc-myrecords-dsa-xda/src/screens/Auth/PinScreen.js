// ============================================================================
// FILE        : PinScreen.js
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 23-July-2026 | 20:39 Hrs
//
// PURPOSE     : PIN setup + login screen (4-6 digit, device-locked via
//               AsyncStorage) gating the DSA Tablet App before AppNavigator.
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  StatusBar, Image, Vibration,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { savePin, verifyPin, isPinSetup } from '../../storage/database';
import { t, loadLocale } from '../../localization';

const PIN_LENGTH = 6;

const PinDot = ({ filled }) => (
  <View style={[styles.dot, filled && styles.dotFilled]} />
);

const PinPad = ({ onPress, onDelete }) => {
  const keys = [
    ['1','2','3'], ['4','5','6'], ['7','8','9'], ['','0','⌫']
  ];
  return (
    <View style={styles.pad}>
      {keys.map((row, ri) => (
        <View key={ri} style={styles.padRow}>
          {row.map((key, ki) => (
            key === '' ? <View key={ki} style={styles.padKeyEmpty} /> :
            <TouchableOpacity
              key={ki}
              style={styles.padKey}
              activeOpacity={0.7}
              onPress={() => key === '⌫' ? onDelete() : onPress(key)}
            >
              <Text style={styles.padKeyText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

export default function AuthScreen({ onAuthenticated }) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [stage, setStage] = useState('loading'); // loading | setup | confirm | login
  const [error, setError] = useState('');
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      await loadLocale();
      const setup = await isPinSetup();
      setStage(setup ? 'login' : 'setup');
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    })();
  }, []);

  const shake = () => {
    Vibration.vibrate(400);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 12, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -12, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleKey = async (key) => {
    setError('');
    const current = stage === 'confirm' ? confirmPin : pin;
    if (current.length >= PIN_LENGTH) return;
    const next = current + key;

    if (stage === 'setup') {
      setPin(next);
      if (next.length === PIN_LENGTH) {
        setTimeout(() => { setStage('confirm'); setConfirmPin(''); }, 300);
      }
    } else if (stage === 'confirm') {
      setConfirmPin(next);
      if (next.length === PIN_LENGTH) {
        if (next === pin) {
          await savePin(next);
          setTimeout(() => onAuthenticated(), 300);
        } else {
          shake();
          setError(t('pinMismatch'));
          setTimeout(() => { setStage('setup'); setPin(''); setConfirmPin(''); }, 1200);
        }
      }
    } else if (stage === 'login') {
      setPin(next);
      if (next.length === PIN_LENGTH) {
        const ok = await verifyPin(next);
        if (ok) {
          setTimeout(() => onAuthenticated(), 300);
        } else {
          shake();
          setError(t('wrongPin'));
          setTimeout(() => setPin(''), 800);
        }
      }
    }
  };

  const handleDelete = () => {
    setError('');
    if (stage === 'confirm') setConfirmPin(p => p.slice(0, -1));
    else setPin(p => p.slice(0, -1));
  };

  const currentPin = stage === 'confirm' ? confirmPin : pin;
  const title = stage === 'setup' ? t('setupPin') : stage === 'confirm' ? t('confirmPin') : t('enterPin');
  const subtitle = stage === 'setup' ? t('setupPinSubtitle') : stage === 'confirm' ? t('confirmPin') : t('pinSubtitle');

  if (stage === 'loading') return <View style={styles.container} />;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>LXC</Text>
        </View>
        <Text style={styles.appName}>Lexvora DSA</Text>
        <Text style={styles.appTagline}>MyRecords Field Agent</Text>
      </View>

      <View style={styles.pinBox}>
        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <Text style={styles.pinTitle}>{title}</Text>
          <Text style={styles.pinSubtitle}>{subtitle}</Text>

          <View style={styles.dotsRow}>
            {Array.from({ length: PIN_LENGTH }).map((_, i) => (
              <PinDot key={i} filled={i < currentPin.length} />
            ))}
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : <View style={{ height: 20 }} />}
        </Animated.View>
      </View>

      <PinPad onPress={handleKey} onDelete={handleDelete} />

      <Text style={styles.footer}>Lexvora Consulting • Secure Access</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 48,
    paddingHorizontal: 40,
  },
  header: { alignItems: 'center', marginTop: 20 },
  logoBox: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: { ...Typography.displaySmall, color: Colors.white, fontWeight: '800' },
  appName: { ...Typography.displaySmall, color: Colors.white, marginBottom: 4 },
  appTagline: { ...Typography.bodyMedium, color: 'rgba(255,255,255,0.55)' },

  pinBox: { alignItems: 'center', width: '100%' },
  pinTitle: { ...Typography.headingLarge, color: Colors.white, textAlign: 'center', marginBottom: 8 },
  pinSubtitle: { ...Typography.bodyMedium, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 32 },
  dotsRow: { flexDirection: 'row', gap: 16, justifyContent: 'center', marginBottom: 16 },
  dot: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'transparent',
  },
  dotFilled: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  errorText: { ...Typography.bodySmall, color: Colors.accentLight, textAlign: 'center', marginTop: 4 },

  pad: { width: '80%', maxWidth: 340, gap: 12 },
  padRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  padKey: {
    flex: 1, height: 70, borderRadius: Radius.lg,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  padKeyEmpty: { flex: 1, height: 70 },
  padKeyText: { ...Typography.displaySmall, color: Colors.white },

  footer: { ...Typography.caption, color: 'rgba(255,255,255,0.3)' },
});
