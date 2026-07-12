import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import BigButton from '../components/BigButton';
import { colors, fontSize, spacing, radius } from '../theme/colors';

function getEncouragementMessage(accuracy) {
  if (accuracy === 1) {
    return '素晴らしい！全問正解です。今日も冴えていますね！';
  }
  if (accuracy >= 0.7) {
    return '昨日より記憶力が5%アップしました。この調子で続けましょう！';
  }
  if (accuracy >= 0.4) {
    return 'よく頑張りました。毎日続けることが1番の近道です。';
  }
  return '今日は難しい事件でしたね。明日また挑戦しましょう！';
}

export default function ResultScreen({ route, navigation }) {
  const { result } = route.params;
  const accuracy = result.totalCount > 0 ? result.correctCount / result.totalCount : 0;
  const message = getEncouragementMessage(accuracy);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>🕵️ 事件解決！</Text>

        <View style={styles.card}>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>正解数</Text>
            <Text style={styles.resultValue}>
              {result.correctCount} / {result.totalCount}
            </Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>スコア</Text>
            <Text style={styles.resultValue}>{result.score} 点</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>脳年齢</Text>
            <Text style={styles.resultValueHighlight}>{result.brainAge} 歳</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>獲得経験値</Text>
            <Text style={styles.resultValue}>+{result.earnedExp} EXP</Text>
          </View>
        </View>

        <View style={styles.messageCard}>
          <Text style={styles.messageText}>{message}</Text>
        </View>

        <BigButton
          label="ホームに戻る"
          onPress={() => navigation.navigate('Home')}
          style={styles.button}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: '800',
    color: colors.textMain,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  resultLabel: {
    fontSize: fontSize.body,
    color: colors.textSub,
  },
  resultValue: {
    fontSize: fontSize.large,
    fontWeight: '700',
    color: colors.textMain,
  },
  resultValueHighlight: {
    fontSize: fontSize.large,
    fontWeight: '700',
    color: colors.primary,
  },
  messageCard: {
    backgroundColor: colors.gold,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  messageText: {
    fontSize: fontSize.body,
    color: colors.textMain,
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    marginBottom: spacing.md,
  },
});
