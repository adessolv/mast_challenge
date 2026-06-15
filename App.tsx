import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from 'react-native';

const TOTAL_DAYS = 42;
const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MOODS = ['мягко', 'спокойно', 'ярко', 'интенсивно', 'вау'];

type DayEntry = {
  active: boolean;
  minutes: number;
  orgasmRating: number;
  note: string;
};

type Entries = Record<number, DayEntry>;

const defaultEntry: DayEntry = {
  active: false,
  minutes: 15,
  orgasmRating: 3,
  note: ''
};

const makeInitialEntries = (): Entries =>
  Array.from({ length: TOTAL_DAYS }, (_, index) => index + 1).reduce<Entries>((acc, day) => {
    acc[day] = { ...defaultEntry };
    return acc;
  }, {});

export default function App() {
  const [entries, setEntries] = useState<Entries>(makeInitialEntries);
  const [selectedDay, setSelectedDay] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

  const stats = useMemo(() => {
    const values = (Object.values(entries) as DayEntry[]).filter(entry => entry.active);
    const activeDays = values.length;
    const totalMinutes = values.reduce((sum, entry) => sum + entry.minutes, 0);
    const averageRating = activeDays
      ? values.reduce((sum, entry) => sum + entry.orgasmRating, 0) / activeDays
      : 0;
    return { activeDays, totalMinutes, averageRating, progress: activeDays / TOTAL_DAYS };
  }, [entries]);

  const selectedEntry = entries[selectedDay] ?? defaultEntry;

  const updateSelectedEntry = (patch: Partial<DayEntry>) => {
    setEntries((current: Entries) => ({
      ...current,
      [selectedDay]: {
        ...(current[selectedDay] ?? defaultEntry),
        ...patch
      }
    }));
  };

  const resetChallenge = () => {
    Alert.alert('Начать заново?', 'Все отметки за 6 недель будут очищены.', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Очистить', style: 'destructive', onPress: () => setEntries(makeInitialEntries()) }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>6 недель</Text>
          </View>
          <Text style={styles.title}>Pleasure Challenge</Text>
          <Text style={styles.subtitle}>
            Личный трекер практики: отмечай активные дни, длительность и качество результата.
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.round(stats.progress * 100)}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{stats.activeDays} из {TOTAL_DAYS} дней отмечено</Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard label="Активных" value={`${stats.activeDays}`} />
          <StatCard label="Минут" value={`${stats.totalMinutes}`} />
          <StatCard label="Средняя" value={stats.averageRating ? stats.averageRating.toFixed(1) : '—'} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Календарь челленджа</Text>
          <Pressable onPress={resetChallenge} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Сброс</Text>
          </Pressable>
        </View>

        <View style={styles.calendarCard}>
          <View style={styles.weekHeader}>
            {WEEK_DAYS.map(day => <Text key={day} style={styles.weekDay}>{day}</Text>)}
          </View>
          {Array.from({ length: 6 }, (_, weekIndex) => (
            <View key={weekIndex} style={styles.weekRow}>
              {Array.from({ length: 7 }, (_, dayIndex) => {
                const day = weekIndex * 7 + dayIndex + 1;
                const entry = entries[day] ?? defaultEntry;
                return (
                  <Pressable
                    key={day}
                    onPress={() => {
                      setSelectedDay(day);
                      setModalVisible(true);
                    }}
                    style={[styles.dayCell, entry.active && styles.dayCellActive]}
                  >
                    <Text style={[styles.dayNumber, entry.active && styles.dayNumberActive]}>{day}</Text>
                    {entry.active && <Text style={styles.dayMeta}>{entry.minutes}м • {entry.orgasmRating}</Text>}
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Идея недели</Text>
          <Text style={styles.tipText}>
            Следи не только за частотой, но и за ощущениями: отмечай, что помогло расслабиться, и не сравнивай дни между собой.
          </Text>
        </View>
      </ScrollView>

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>День {selectedDay}</Text>
            <View style={styles.switchRow}>
              <Text style={styles.inputLabel}>Активный день</Text>
              <Switch
                value={selectedEntry.active}
                trackColor={{ false: '#514866', true: '#ff8ab3' }}
                thumbColor={selectedEntry.active ? '#ffffff' : '#b8adc9'}
                onValueChange={(active: boolean) => updateSelectedEntry({ active })}
              />
            </View>

            <Text style={styles.inputLabel}>Длительность: {selectedEntry.minutes} минут</Text>
            <View style={styles.durationRow}>
              {[5, 10, 15, 30, 45, 60].map(minutes => (
                <Pressable
                  key={minutes}
                  onPress={() => updateSelectedEntry({ minutes })}
                  style={[styles.durationChip, selectedEntry.minutes === minutes && styles.durationChipActive]}
                >
                  <Text style={[styles.durationChipText, selectedEntry.minutes === minutes && styles.durationChipTextActive]}>{minutes}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.stepperRow}>
              <Pressable onPress={() => updateSelectedEntry({ minutes: Math.max(1, selectedEntry.minutes - 1) })} style={styles.stepperButton}>
                <Text style={styles.stepperText}>−</Text>
              </Pressable>
              <Text style={styles.stepperValue}>{selectedEntry.minutes} мин</Text>
              <Pressable onPress={() => updateSelectedEntry({ minutes: Math.min(120, selectedEntry.minutes + 1) })} style={styles.stepperButton}>
                <Text style={styles.stepperText}>+</Text>
              </Pressable>
            </View>

            <Text style={styles.inputLabel}>Результат: {selectedEntry.orgasmRating}/5 — {MOODS[selectedEntry.orgasmRating - 1]}</Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map(rating => (
                <Pressable
                  key={rating}
                  onPress={() => updateSelectedEntry({ orgasmRating: rating })}
                  style={[styles.ratingButton, selectedEntry.orgasmRating >= rating && styles.ratingButtonActive]}
                >
                  <Text style={[styles.ratingText, selectedEntry.orgasmRating >= rating && styles.ratingTextActive]}>{rating}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.inputLabel}>Заметка</Text>
            <TextInput
              value={selectedEntry.note}
              onChangeText={(note: string) => updateSelectedEntry({ note })}
              placeholder="Что сработало сегодня?"
              placeholderTextColor="#8d819f"
              style={styles.noteInput}
              multiline
            />

            <Pressable onPress={() => setModalVisible(false)} style={styles.doneButton}>
              <Text style={styles.doneButtonText}>Готово</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#171225' },
  container: { padding: 20, paddingBottom: 42 },
  hero: { backgroundColor: '#251936', borderRadius: 32, padding: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#3b2b52' },
  heroBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: '#3b2b52', marginBottom: 16 },
  heroBadgeText: { color: '#ffd166', fontWeight: '800', letterSpacing: 0.5 },
  title: { color: '#fff7fb', fontSize: 34, lineHeight: 38, fontWeight: '900' },
  subtitle: { color: '#d7cbe6', fontSize: 16, lineHeight: 23, marginTop: 12 },
  progressTrack: { height: 12, backgroundColor: '#4b3c61', borderRadius: 999, marginTop: 24, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#ff6b9a', borderRadius: 999 },
  progressLabel: { marginTop: 10, color: '#b8adc9', fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  statCard: { flex: 1, backgroundColor: '#21182f', borderRadius: 22, padding: 16, borderWidth: 1, borderColor: '#352846' },
  statValue: { color: '#fff7fb', fontSize: 25, fontWeight: '900' },
  statLabel: { color: '#a99bb9', marginTop: 4, fontWeight: '700' },
  sectionHeader: { marginTop: 28, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: '#fff7fb', fontSize: 22, fontWeight: '900' },
  resetButton: { backgroundColor: '#352846', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  resetButtonText: { color: '#ffd166', fontWeight: '800' },
  calendarCard: { backgroundColor: '#21182f', borderRadius: 28, padding: 12, borderWidth: 1, borderColor: '#352846' },
  weekHeader: { flexDirection: 'row', marginBottom: 8 },
  weekDay: { flex: 1, textAlign: 'center', color: '#8d819f', fontWeight: '800' },
  weekRow: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  dayCell: { flex: 1, minHeight: 58, borderRadius: 16, backgroundColor: '#2b203c', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#3c2e50' },
  dayCellActive: { backgroundColor: '#ff6b9a', borderColor: '#ffd166' },
  dayNumber: { color: '#d7cbe6', fontWeight: '900', fontSize: 16 },
  dayNumberActive: { color: '#24172f' },
  dayMeta: { color: '#24172f', fontSize: 10, marginTop: 2, fontWeight: '800' },
  tipCard: { backgroundColor: '#332544', borderRadius: 24, padding: 18, marginTop: 18, borderWidth: 1, borderColor: '#4c3a63' },
  tipTitle: { color: '#ffd166', fontWeight: '900', fontSize: 18 },
  tipText: { color: '#e9deef', lineHeight: 22, marginTop: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(10, 7, 16, 0.72)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#21182f', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 22, borderWidth: 1, borderColor: '#403052' },
  sheetHandle: { width: 48, height: 5, borderRadius: 999, backgroundColor: '#665776', alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { color: '#fff7fb', fontSize: 26, fontWeight: '900', marginBottom: 18 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  inputLabel: { color: '#e9deef', fontSize: 16, fontWeight: '800', marginTop: 12, marginBottom: 8 },
  durationRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  durationChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: '#332544', borderWidth: 1, borderColor: '#4c3a63' },
  durationChipActive: { backgroundColor: '#ff6b9a', borderColor: '#ffd166' },
  durationChipText: { color: '#d7cbe6', fontWeight: '900' },
  durationChipTextActive: { color: '#24172f' },
  stepperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#2b203c', borderRadius: 18, padding: 8, borderWidth: 1, borderColor: '#4c3a63' },
  stepperButton: { width: 46, height: 46, borderRadius: 15, backgroundColor: '#ffd166', alignItems: 'center', justifyContent: 'center' },
  stepperText: { color: '#24172f', fontWeight: '900', fontSize: 24 },
  stepperValue: { color: '#fff7fb', fontWeight: '900', fontSize: 17 },
  ratingRow: { flexDirection: 'row', gap: 10 },
  ratingButton: { flex: 1, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#332544', borderWidth: 1, borderColor: '#4c3a63' },
  ratingButtonActive: { backgroundColor: '#ffd166', borderColor: '#ffefb3' },
  ratingText: { color: '#d7cbe6', fontWeight: '900' },
  ratingTextActive: { color: '#2a1730' },
  noteInput: { minHeight: 88, borderRadius: 18, backgroundColor: '#2b203c', color: '#fff7fb', padding: 14, textAlignVertical: 'top', borderWidth: 1, borderColor: '#4c3a63' },
  doneButton: { marginTop: 20, backgroundColor: '#ff6b9a', borderRadius: 20, alignItems: 'center', paddingVertical: 16 },
  doneButtonText: { color: '#24172f', fontSize: 17, fontWeight: '900' }
});
