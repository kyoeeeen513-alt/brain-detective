import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import ItemCard from '../components/ItemCard';
import { colors, fontSize, spacing } from '../theme/colors';
import {
  generateDisplayItems,
  generateQuestions,
  DIFFICULTY_CONFIG,
  calculateBrainAge,
  calculateEarnedExp,
  adjustDifficulty,
} from '../game/memoryGameLogic';
import { loadPlayerData, savePlayerData, updateStreak } from '../data/storage';
import { calculateLevelFromTotalExp } from '../data/levels';

export default function GameScreen({ navigation }) {
  const [phase, setPhase] = useState('loading');
  const [displayItems, setDisplayItems] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const difficultyRef = useRef('beginner');
  const correctCountRef = useRef(0);

  useEffect(() => {
    (async () => {
      const playerData = await loadPlayerData();
      difficultyRef.current = playerData.difficulty;

      const items = generateDisplayItems(playerData.difficulty);
      const qs = generateQuestions(items, playerData.difficulty);

      setDisplayItems(items);
      setQuestions(qs);
      setCountdown(DIFFICULTY_CONFIG[playerData.difficulty].showSeconds);
      setPhase('memorize');
    })();
  }, []);

  useEffect(() => {
    if (phase !== 'memorize') return;
    if (countdown <= 0) {
      setPhase('quiz');
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, countdown]);

  const handleAnswer = (choice) => {
    if (phase !== 'quiz') return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = choice.id === currentQuestion.correctItem.id;

    setSelectedItemId(choice.id);
    setPhase('answered');

    if (isCorrect) {
      correctCountRef.current += 1;
    }

    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < questions.length) {
        setCurrentQuestionIndex(nextIndex);
        setSelectedItemId(null);
        setPhase('quiz');
      } else {
        finishGame();
      }
    }, 1000);
  };

  const finishGame = async () => {
    const finalCorrectCount = correctCountRef.current;
    const totalCount = questions.length;
    const accuracy = totalCount > 0 ? finalCorrectCount / totalCount : 0;
    const difficulty = difficultyRef.current;

    const brainAge = calculateBrainAge(accuracy, difficulty);
    const earnedExp = calculateEarnedExp(finalCorrectCount, totalCount, difficulty);
    const score = finalCorrectCount * 100;

    let playerData = await loadPlayerData();
    playerData = updateStreak(playerData);

    const newTotalExp = playerData.totalExp + earnedExp;
    const { level, expInLevel } = calculateLevelFromTotalExp(newTotalExp);

    const newHistory = [...playerData.recentAccuracyHistory, accuracy].slice(-5);
    const nextDifficulty = adjustDifficulty(playerData.difficulty, newHistory);

    const updatedData = {
      ...playerData,
      level,
      exp: expInLevel,
      totalExp: newTotalExp,
      bestScore: Math.max(playerData.bestScore, score),
      recentAccuracyHistory: newHistory,
      difficulty: nextDifficulty,
    };

    await savePlayerData(updatedData);

    navigation.replace('Result', {
      result: {
        correctCount: finalCorrectCount,
        totalCount,
        score,
        brainAge,
        difficulty,
        earnedExp,
      },
    });
  };

  if (phase === 'loading' || questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>事件の準備をしています...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (phase === 'memorize') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.instruction}>これから出てくるものを覚えてください</Text>
          <Text style={styles.countdown}>{countdown}</Text>
          <View style={styles.itemGrid}>
            {displayItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.progressText}>
          問題 {currentQuestionIndex + 1} / {questions.length}
        </Text>
        <Text style={styles.instruction}>さっき出てきたのはどれ？</Text>

        <View style={styles.itemGrid}>
          {currentQuestion.choices.map((choice) => {
            let resultState = 'none';
            if (phase === 'answered') {
              if (choice.id === currentQuestion.correctItem.id) {
                resultState = 'correct';
              } else if (choice.id === selectedItemId) {
                resultState = 'wrong';
              }
            }
            return (
              <ItemCard
                key={choice.id}
                item={choice}
                onPress={() => handleAnswer(choice)}
                selected={choice.id === selectedItemId}
                resultState={resultState}
              />
            );
          })}
        </View>
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSize.body,
    color: colors.textSub,
  },
  instruction: {
    fontSize: fontSize.heading,
    fontWeight: '700',
    color: colors.textMain,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  countdown: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  progressText: {
    fontSize: fontSize.body,
    color: colors.textSub,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  itemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
