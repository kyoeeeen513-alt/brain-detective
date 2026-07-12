import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@brain_detective_player_data';

export const DEFAULT_PLAYER_DATA = {
  level: 1,
  exp: 0,
  totalExp: 0,
  streakDays: 0,
  lastPlayedDate: null,
  bestScore: 0,
  difficulty: 'beginner',
  recentAccuracyHistory: [],
};

export async function loadPlayerData() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return DEFAULT_PLAYER_DATA;
    const parsed = JSON.parse(json);
    return { ...DEFAULT_PLAYER_DATA, ...parsed };
  } catch (e) {
    console.warn('プレイヤーデータの読み込みに失敗しました', e);
    return DEFAULT_PLAYER_DATA;
  }
}

export async function savePlayerData(data) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('プレイヤーデータの保存に失敗しました', e);
  }
}

export function getTodayString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getYesterdayString() {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function updateStreak(data) {
  const today = getTodayString();
  const yesterday = getYesterdayString();

  if (data.lastPlayedDate === today) {
    return data;
  }

  if (data.lastPlayedDate === yesterday) {
    return { ...data, streakDays: data.streakDays + 1, lastPlayedDate: today };
  }

  return { ...data, streakDays: 1, lastPlayedDate: today };
}
