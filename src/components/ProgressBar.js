import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius } from '../theme/colors';

export default function ProgressBar({ current, max }) {
  const percent = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${percent}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    height: 16,
    backgroundColor: colors.border,
    borderRadius: radius.button,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.gold,
    borderRadius: radius.button,
  },
});
