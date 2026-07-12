import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import BigButton from '../components/BigButton';
import ProgressBar from '../components/ProgressBar';
import { colors, fontSize, spacing, radius } from '../theme/colors';
import { loadPlayerData, DEFAULT_PLAYER_DATA } from '../data/storage';
import { getTitleForLevel, getRequiredExpForLevel } from '../data/levels';

export default function HomeScreen({ navigation }) {
  const [playerData, setPlayerData] = useState(DEFAULT_PLAYER_DATA);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        const data = await loadPlayerData();
        if (isActive) {
          setPlayerData(data);
          setLoading(false);
        }
      })();
      return () => {
        isActive = false;
      };
    }, [])
  );

  const title = getTitleForLevel(playerData.level);
  const requiredExp = getRequiredExpForLevel(playerData.level);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.appTitle}>🔍 脳トレ探偵</Text>
        <Text style={styles.subTitle}>今日の事件を解決しよう</Text>

        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>現在の称号</Text>
            <Text style={styles.statusValueHighlight}>Lv.{playerData.level} {title}</Text>
          </View>

          <ProgressBar current={playerData.exp} max={requiredExp} />
          <Text style={styles.expText}>
            次のレベルまで {Math.max(0, requiredExp - playerData.exp)} EXP
          </Text>

          <View style={styles.divider} />

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>連続プレイ日数</Text>
            <Text style={styles.statusValue}>🔥 {playerData.streakDays}日</Text>
          </View>
        </View>

        <BigButton
          label={loading ? '読み込み中...' : '今日の脳トレを始める'}
          onPress={() => navigation.navigate('Game')}
          disabled={loading}
          style={styles.startButton}
        />

        <Text style={styles.footerNote}>1回3分。毎日コツコツ続けよう。</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: fontSize.title,
    fontWeight: '800',
    color: colors.textMain,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subTitle: {
    fontSize: fontSize.body,
    color: colors.textSub,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  statusCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusLabel: {
    fontSize: fontSize.body,
    color: colors.textSub,
  },
  statusValue: {
    fontSize: fontSize.large,
    fontWeight: '700',
    color: colors.textMain,
  },
  statusValueHighlight: {
    fontSize: fontSize.large,
    fontWeight: '700',
    color: colors.primary,
  },
  expText: {
    fontSize: fontSize.small,
    color: colors.textSub,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  startButton: {
    marginBottom: spacing.sm,
  },
  footerNote: {
    fontSize: fontSize.small,
    color: colors.textSub,
    textAlign: 'center',
  },
});
