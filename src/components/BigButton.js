import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme/colors';

export default function BigButton({
  label,
  onPress,
  variant = 'primary',
  style,
  disabled = false,
}) {
  const backgroundColor =
    variant === 'primary'
      ? colors.primary
      : variant === 'secondary'
      ? colors.secondary
      : 'transparent';

  const textColor = variant === 'outline' ? colors.primary : '#FFFFFF';
  const borderStyle =
    variant === 'outline'
      ? { borderWidth: 2, borderColor: colors.primary }
      : {};

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor, opacity: disabled ? 0.5 : pressed ? 0.8 : 1 },
        borderStyle,
        style,
      ]}
    >
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 64,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: fontSize.button,
    fontWeight: '700',
  },
});
