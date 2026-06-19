import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StatCard from "../components/StatCard";
import { useEntries } from "../context/EntriesContext";

export default function StatsScreen(): React.JSX.Element {
  const { stats } = useEntries();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Аналитика</Text>
          <Text style={styles.title}>Статистика</Text>
        </View>

        <View style={styles.grid}>
          <StatCard
            label="Активные дни"
            value={`${stats.activeDays}/42`}
            icon="calendar-outline"
          />
          <StatCard
            label="Минут всего"
            value={`${stats.totalMinutes}`}
            icon="time-outline"
          />
          <StatCard
            label="Средняя оценка"
            value={`${stats.avgRating}/5`}
            icon="sparkles-outline"
          />
          <StatCard
            label="Текущий стрик"
            value={`${stats.streak} д.`}
            icon="flame-outline"
          />
          <StatCard
            label="Лучший стрик"
            value={`${stats.longestStreak} д.`}
            icon="trophy-outline"
          />
          <StatCard
            label="Средняя длительность"
            value={`${stats.averageDuration} мин`}
            icon="timer-outline"
          />
          <StatCard
            label="Прогресс"
            value={`${stats.completion}%`}
            icon="pie-chart-outline"
          />
          <StatCard
            label="Лучший день"
            value={`#${stats.bestDay}`}
            icon="ribbon-outline"
          />
        </View>

        <View style={styles.largeCard}>
          <Text style={styles.largeCardTitle}>Активность по неделям</Text>

          <View style={styles.weekChart}>
            {stats.weekStats.map((week) => (
              <View key={week.label} style={styles.weekBarItem}>
                <View style={styles.weekBarTrack}>
                  <View
                    style={[
                      styles.weekBarFill,
                      {
                        height: `${Math.max((week.activeDays / 7) * 100, week.activeDays > 0 ? 12 : 0)}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.weekBarValue}>{week.activeDays}</Text>
                <Text style={styles.weekBarLabel}>{week.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.largeCard}>
          <Text style={styles.largeCardTitle}>Распределение оценок</Text>

          <View style={styles.ratingStatsList}>
            {stats.ratingDistribution.map((item) => {
              const maxCount = Math.max(
                ...stats.ratingDistribution.map((x) => x.count),
                1,
              );
              const widthPercent = `${(item.count / maxCount) * 100}%`;

              return (
                <View key={item.label} style={styles.ratingRowItem}>
                  <Text style={styles.ratingRowLabel}>{item.label}/5</Text>

                  <View style={styles.ratingBarTrack}>
                    <View
                      style={[
                        styles.ratingBarFill,
                        {
                          width:
                            `${(item.count / maxCount) * 100}%` as `${number}%`,
                        },
                      ]}
                    />
                  </View>

                  <Text style={styles.ratingRowCount}>{item.count}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.largeCard}>
          <Text style={styles.largeCardTitle}>Лучший день</Text>
          <Text style={styles.largeCardValue}>День {stats.bestDay}</Text>
          <Text style={styles.largeCardText}>
            Максимальная оценка: {stats.bestRating}/5.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0D1117",
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
    gap: 16,
    flexGrow: 1,
  },
  header: {
    gap: 6,
    marginBottom: 4,
  },
  eyebrow: {
    color: "#8FE3C8",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  title: {
    color: "#F4F7FB",
    fontSize: 28,
    fontWeight: "800",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  largeCard: {
    backgroundColor: "#151A22",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    gap: 8,
  },
  largeCardTitle: {
    color: "#9AA4B2",
    fontSize: 14,
    fontWeight: "700",
  },
  largeCardValue: {
    color: "#F4F7FB",
    fontSize: 28,
    fontWeight: "800",
  },
  largeCardText: {
    color: "#B8C1CE",
    fontSize: 14,
    lineHeight: 20,
  },
  weekChart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 8,
    gap: 10,
  },
  weekBarItem: {
    alignItems: "center",
    flex: 1,
  },
  weekBarTrack: {
    width: 28,
    height: 110,
    borderRadius: 14,
    backgroundColor: "#1C2430",
    justifyContent: "flex-end",
    padding: 4,
  },
  weekBarFill: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#8FE3C8",
    minHeight: 6,
  },
  weekBarValue: {
    color: "#F4F7FB",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 8,
  },
  weekBarLabel: {
    color: "#8E97A5",
    fontSize: 12,
    marginTop: 2,
  },
  ratingStatsList: {
    gap: 12,
    marginTop: 6,
  },
  ratingRowItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  ratingRowLabel: {
    width: 28,
    color: "#D9E0EA",
    fontSize: 13,
    fontWeight: "700",
  },
  ratingBarTrack: {
    flex: 1,
    height: 10,
    backgroundColor: "#1C2430",
    borderRadius: 999,
    overflow: "hidden",
  },
  ratingBarFill: {
    height: "100%",
    backgroundColor: "#8FE3C8",
    borderRadius: 999,
  },
  ratingRowCount: {
    width: 20,
    textAlign: "right",
    color: "#9AA4B2",
    fontSize: 13,
    fontWeight: "700",
  },
});
