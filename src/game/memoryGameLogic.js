import { ALL_ITEMS } from './items';

export const DIFFICULTY_CONFIG = {
  beginner: { itemCount: 3, questionCount: 3, showSeconds: 5 },
  normal: { itemCount: 4, questionCount: 4, showSeconds: 4 },
  advanced: { itemCount: 5, questionCount: 5, showSeconds: 3 },
};

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generateDisplayItems(difficulty) {
  const config = DIFFICULTY_CONFIG[difficulty];
  return shuffle(ALL_ITEMS).slice(0, config.itemCount);
}

export function generateQuestions(displayItems, difficulty) {
  const config = DIFFICULTY_CONFIG[difficulty];
  const questionCount = Math.min(config.questionCount, displayItems.length);

  const targets = shuffle(displayItems).slice(0, questionCount);

  return targets.map((correctItem) => {
    const notShown = ALL_ITEMS.filter(
      (item) => !displayItems.find((d) => d.id === item.id)
    );
    const dummies = shuffle(notShown).slice(0, 3);
    const choices = shuffle([correctItem, ...dummies]);

    return { correctItem, choices };
  });
}

export function adjustDifficulty(currentDifficulty, recentAccuracyHistory) {
  if (recentAccuracyHistory.length === 0) return currentDifficulty;

  const recent = recentAccuracyHistory.slice(-2);
  const avg = recent.reduce((sum, v) => sum + v, 0) / recent.length;

  const order = ['beginner', 'normal', 'advanced'];
  const currentIndex = order.indexOf(currentDifficulty);

  if (avg >= 0.85 && currentIndex < order.length - 1) {
    return order[currentIndex + 1];
  }
  if (avg < 0.5 && currentIndex > 0) {
    return order[currentIndex - 1];
  }
  return currentDifficulty;
}

export function calculateBrainAge(accuracy, difficulty) {
  const baseAge = difficulty === 'advanced' ? 20 : difficulty === 'normal' ? 30 : 40;
  const penalty = Math.round((1 - accuracy) * 40);
  const age = baseAge + penalty;
  return Math.max(20, Math.min(80, age));
}

export function calculateEarnedExp(correctCount, totalCount, difficulty) {
  const difficultyMultiplier =
    difficulty === 'advanced' ? 2 : difficulty === 'normal' ? 1.5 : 1;
  const baseExp = correctCount * 15;
  return Math.round(baseExp * difficultyMultiplier);
}
