import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Modal,
  Pressable,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import InputBlock from "../components/InputBlock";
import { TOTAL_DAYS, Entry } from "../data/mockData";
import { useEntries } from "../context/EntriesContext";

export default function CalendarScreen(): React.JSX.Element {
  const { entries, updateEntry, toggleActive, saveEntry, stats } = useEntries();
  const [selectedDay, setSelectedDay] = useState<number>(21);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [draftEntry, setDraftEntry] = useState<Entry>({
    active: true,
    duration: 20,
    rating: 3,
    note: "",
  });

  const { width } = useWindowDimensions();
  const calendarHorizontalPadding = 14;
  const calendarGap = 8;
  const screenPadding = 20;
  const calendarInnerWidth =
    width - screenPadding * 2 - calendarHorizontalPadding * 2;
  const dayCellSize = Math.floor((calendarInnerWidth - calendarGap * 6) / 7);

  const selected: Entry = entries[selectedDay] || {
    active: false,
    duration: "",
    rating: 0,
    note: "",
  };

  const handleDayPress = (day: number) => {
    setSelectedDay(day);
    const existingEntry = entries[day];

    if (existingEntry?.active) {
      setModalVisible(false);
      return;
    }

    setDraftEntry({
      active: true,
      duration: 20,
      rating: 3,
      note: "",
    });
    setModalVisible(true);
  };

  const saveDraftEntry = () => {
    saveEntry(selectedDay, draftEntry);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.eyebrow}>6-недельный челлендж</Text>
              <Text style={styles.heroTitle}>Трекер практики</Text>
            </View>
            <View style={styles.logoBubble}>
              <Ionicons name="pulse" size={20} color="#0D1117" />
            </View>
          </View>

          <Text style={styles.heroText}>
            Отмечай активные дни, длительность и субъективный результат по шкале
            от 1 до 5.
          </Text>

          <View style={styles.streakCard}>
            <View style={styles.streakIconWrap}>
              <Ionicons name="flame" size={18} color="#0D1117" />
            </View>

            <View style={styles.streakContent}>
              <Text style={styles.streakLabel}>Текущий стрик</Text>
              <Text style={styles.streakValue}>{stats.streak} д.</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>42 дня челленджа</Text>
          <Text style={styles.sectionMeta}>{stats.activeDays} отмечено</Text>
        </View>

        <View style={styles.calendarGrid}>
          <FlatList
            data={Array.from({ length: TOTAL_DAYS }, (_, index) => index + 1)}
            keyExtractor={(item) => String(item)}
            numColumns={7}
            scrollEnabled={false}
            columnWrapperStyle={styles.calendarRow}
            contentContainerStyle={styles.calendarListContent}
            renderItem={({ item: day }) => {
              const entry = entries[day];
              const isSelected = day === selectedDay;

              return (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => handleDayPress(day)}
                  style={[
                    styles.dayCell,
                    {
                      width: dayCellSize,
                      height: dayCellSize,
                    },
                    entry?.active && styles.dayCellActive,
                    isSelected && styles.dayCellSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      entry?.active && styles.dayTextActive,
                    ]}
                  >
                    {day}
                  </Text>
                  {entry?.active ? <View style={styles.dayDot} /> : null}
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Запись дня {selectedDay}</Text>
          <TouchableOpacity
            style={[
              styles.togglePill,
              selected.active && styles.togglePillActive,
            ]}
            onPress={() => toggleActive(selectedDay)}
          >
            <Text
              style={[
                styles.togglePillText,
                selected.active && styles.togglePillTextActive,
              ]}
            >
              {selected.active ? "Активный день" : "Не отмечено"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.editorCard}>
          <InputBlock label="Длительность, минут">
            <TextInput
              value={String(selected.duration ?? "")}
              onChangeText={(value) =>
                updateEntry(
                  selectedDay,
                  "duration",
                  value.replace(/[^0-9]/g, ""),
                )
              }
              keyboardType="number-pad"
              placeholder="Например, 20"
              placeholderTextColor="#6F7685"
              style={styles.input}
            />
          </InputBlock>

          <InputBlock label="Оценка результата">
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((value) => {
                const active = Number(selected.rating) >= value;

                return (
                  <TouchableOpacity
                    key={value}
                    onPress={() => updateEntry(selectedDay, "rating", value)}
                    style={[
                      styles.ratingChip,
                      active && styles.ratingChipActive,
                    ]}
                  >
                    <Ionicons
                      name={active ? "star" : "star-outline"}
                      size={18}
                      color={active ? "#0D1117" : "#9CA3AF"}
                    />
                    <Text
                      style={[
                        styles.ratingText,
                        active && styles.ratingTextActive,
                      ]}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </InputBlock>

          <InputBlock label="Заметка">
            <TextInput
              value={selected.note ?? ""}
              onChangeText={(value) => updateEntry(selectedDay, "note", value)}
              placeholder="Самочувствие, настроение, наблюдения"
              placeholderTextColor="#6F7685"
              multiline
              style={[styles.input, styles.textArea]}
            />
          </InputBlock>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalEyebrow}>Новая запись</Text>
                <Text style={styles.modalTitle}>День {selectedDay}</Text>
              </View>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={20} color="#E5E7EB" />
              </TouchableOpacity>
            </View>

            <InputBlock label="Длительность, минут">
              <TextInput
                value={String(draftEntry.duration ?? "")}
                onChangeText={(value) =>
                  setDraftEntry((prev) => ({
                    ...prev,
                    duration: value.replace(/[^0-9]/g, ""),
                  }))
                }
                keyboardType="number-pad"
                placeholder="Например, 20"
                placeholderTextColor="#6F7685"
                style={styles.input}
              />
            </InputBlock>

            <InputBlock label="Оценка результата">
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((value) => {
                  const active = Number(draftEntry.rating) >= value;

                  return (
                    <TouchableOpacity
                      key={value}
                      onPress={() =>
                        setDraftEntry((prev) => ({
                          ...prev,
                          rating: value,
                        }))
                      }
                      style={[
                        styles.ratingChip,
                        active && styles.ratingChipActive,
                      ]}
                    >
                      <Ionicons
                        name={active ? "star" : "star-outline"}
                        size={18}
                        color={active ? "#0D1117" : "#9CA3AF"}
                      />
                      <Text
                        style={[
                          styles.ratingText,
                          active && styles.ratingTextActive,
                        ]}
                      >
                        {value}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </InputBlock>

            <InputBlock label="Заметка">
              <TextInput
                value={draftEntry.note}
                onChangeText={(value) =>
                  setDraftEntry((prev) => ({
                    ...prev,
                    note: value,
                  }))
                }
                placeholder="Самочувствие, настроение, наблюдения"
                placeholderTextColor="#6F7685"
                multiline
                style={[styles.input, styles.textArea]}
              />
            </InputBlock>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.secondaryButtonText}>Отмена</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={saveDraftEntry}
              >
                <Text style={styles.primaryButtonText}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0D1117" },
  container: { padding: 20, paddingBottom: 36, gap: 18 },
  heroCard: {
    borderRadius: 28,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#12151C",
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eyebrow: {
    color: "#8FE3C8",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  heroTitle: {
    color: "#F5F7FB",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 4,
  },
  heroText: { color: "#B7C0CF", fontSize: 15, lineHeight: 22, maxWidth: "92%" },
  logoBubble: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#8FE3C8",
    alignItems: "center",
    justifyContent: "center",
  },
  streakCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(143,227,200,0.08)",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(143,227,200,0.18)",
  },
  streakIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#8FE3C8",
    alignItems: "center",
    justifyContent: "center",
  },
  streakContent: { gap: 2 },
  streakLabel: { color: "#A7B3C7", fontSize: 13, fontWeight: "700" },
  streakValue: { color: "#F5F7FB", fontSize: 20, fontWeight: "800" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  sectionTitle: { color: "#F4F7FB", fontSize: 20, fontWeight: "800" },
  sectionMeta: { color: "#8E97A5", fontSize: 13 },
  calendarGrid: {
    backgroundColor: "#151A22",
    padding: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  calendarListContent: { gap: 8 },
  calendarRow: { justifyContent: "space-between", marginBottom: 8 },
  dayCell: {
    backgroundColor: "#1B2230",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
    gap: 3,
  },
  dayCellActive: { backgroundColor: "#243B35" },
  dayCellSelected: { borderColor: "#8FE3C8" },
  dayText: { color: "#7E8795", fontSize: 13, fontWeight: "700" },
  dayTextActive: { color: "#EAFBF4" },
  dayDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#8FE3C8",
  },
  togglePill: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#1A202C",
  },
  togglePillActive: { backgroundColor: "#8FE3C8" },
  togglePillText: { color: "#BBC4D2", fontSize: 13, fontWeight: "700" },
  togglePillTextActive: { color: "#0D1117" },
  editorCard: {
    backgroundColor: "#151A22",
    borderRadius: 24,
    padding: 18,
    gap: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  input: {
    backgroundColor: "#1A2130",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: "#F5F7FB",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  textArea: { minHeight: 100, textAlignVertical: "top" },
  ratingRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  ratingChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#1A2130",
  },
  ratingChipActive: { backgroundColor: "#8FE3C8" },
  ratingText: { color: "#C7CFDB", fontSize: 14, fontWeight: "700" },
  ratingTextActive: { color: "#0D1117" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modalBackdrop: StyleSheet.absoluteFill,
  modalCard: {
    backgroundColor: "#151A22",
    borderRadius: 24,
    padding: 18,
    gap: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalEyebrow: {
    color: "#8FE3C8",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  modalTitle: {
    color: "#F4F7FB",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 4,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A2130",
    alignItems: "center",
    justifyContent: "center",
  },
  modalActions: { flexDirection: "row", gap: 12 },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#1A2130",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: { color: "#D7DCE5", fontSize: 15, fontWeight: "700" },
  primaryButton: {
    flex: 1,
    backgroundColor: "#8FE3C8",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: { color: "#0D1117", fontSize: 15, fontWeight: "800" },
});
