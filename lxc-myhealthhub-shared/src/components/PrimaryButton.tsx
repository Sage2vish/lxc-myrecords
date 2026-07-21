import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text} from 'react-native';
import {colors} from '../theme/colors';

type Props = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export function PrimaryButton({label, onPress, disabled, loading}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{disabled: isDisabled}}
      disabled={isDisabled}
      onPress={onPress}
      style={({pressed}) => [
        styles.button,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}>
      {loading ? (
        <ActivityIndicator color={colors.surface} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  pressed: {
    opacity: 0.86,
  },
  disabled: {
    backgroundColor: colors.muted,
    opacity: 0.5,
  },
  label: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
});
