export const LEVEL_TITLES = [
  { level: 1, title: '見習い探偵' },
  { level: 2, title: '駆け出し探偵' },
  { level: 3, title: '観察上手な探偵' },
  { level: 4, title: '記憶の助手' },
  { level: 5, title: '一人前の探偵' },
  { level: 6, title: '鋭い目の探偵' },
  { level: 7, title: 'ベテラン探偵' },
  { level: 8, title: '名推理の探偵' },
  { level: 9, title: '記憶の達人' },
  { level: 10, title: '記憶の名探偵' },
  { level: 11, title: '伝説の観察者' },
  { level: 12, title: '知恵の探偵' },
  { level: 13, title: '洞察の達人' },
  { level: 14, title: '最上級探偵' },
  { level: 15, title: '記憶の巨匠' },
  { level: 16, title: '頭脳明晰探偵' },
  { level: 17, title: '不動の名探偵' },
  { level: 18, title: '究極の観察者' },
  { level: 19, title: '殿堂入り探偵' },
  { level: 20, title: '伝説の脳トレ王' },
];

export function getRequiredExpForLevel(level) {
  return Math.floor(100 * level * (1 + level * 0.08));
}

export function getTitleForLevel(level) {
  const found = LEVEL_TITLES.find((l) => l.level === level);
  if (found) return found.title;
  if (level > 20) return '殿堂入り探偵・伝説級';
  return '見習い探偵';
}

export function calculateLevelFromTotalExp(totalExp) {
  let level = 1;
  let remaining = totalExp;

  while (remaining >= getRequiredExpForLevel(level)) {
    remaining -= getRequiredExpForLevel(level);
    level += 1;
    if (level > 99) break;
  }

  return {
    level,
    expInLevel: remaining,
    expForNextLevel: getRequiredExpForLevel(level),
  };
}
