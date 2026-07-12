import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme/colors';

export default function ItemCard({ item, onPress, selected, resultState = 'none' }) {
  let borderColor = colors.border;
  if (resultState === 'correct') borderColor = colors.success;
  if (resultState === 'wrong') borderColor = colors.danger;
  if (selected && resultState === 'none') borderColor = colors.primary;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          { borderColor, opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={styles.label}>{item.label}</Text>
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, { borderColor }]}>
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={styles.label}>{item.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderWidth: 3,
    borderRadius: radius.card,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    width: '46%',
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: fontSize.body,
    color: colors.textMain,
    fontWeight: '600',
  },
});
