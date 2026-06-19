import { EntryMap, TOTAL_DAYS } from '../data/mockData';

export function getStats(entries: EntryMap) {
  const values = Object.entries(entries).filter(([, item]) => item.active);
  const activeEntries = values.map(([, item]) => item);

  const activeDays = activeEntries.length;
  const totalMinutes = activeEntries.reduce((sum, item) => sum + Number(item.duration || 0), 0);

  const avgRating = activeDays
    ? (activeEntries.reduce((sum, item) => sum + Number(item.rating || 0), 0) / activeDays).toFixed(1)
    : '0.0';

  let streak = 0;
  for (let day = TOTAL_DAYS; day >= 1; day -= 1) {
    if (entries[day]?.active) streak += 1;
    else if (streak > 0) break;
  }

  let longestStreak = 0;
  let currentRun = 0;
  for (let day = 1; day <= TOTAL_DAYS; day += 1) {
    if (entries[day]?.active) {
      currentRun += 1;
      if (currentRun > longestStreak) longestStreak = currentRun;
    } else {
      currentRun = 0;
    }
  }

  const completion = Math.round((activeDays / TOTAL_DAYS) * 100);
  const averageDuration = activeDays ? Math.round(totalMinutes / activeDays) : 0;

  const sortedByRating = Object.entries(entries)
    .filter(([, entry]) => entry.active)
    .sort((a, b) => Number(b[1].rating) - Number(a[1].rating));

  const bestDay = sortedByRating[0]?.[0] ?? '—';
  const bestRating = sortedByRating[0]?.[1]?.rating ?? 0;

  const weekStats = Array.from({ length: 6 }, (_, index) => {
    const startDay = index * 7 + 1;
    const endDay = startDay + 6;
    let count = 0;
    let totalWeekRating = 0;
    let ratedDays = 0;

    for (let day = startDay; day <= endDay; day += 1) {
      if (entries[day]?.active) {
        count += 1;
        totalWeekRating += Number(entries[day].rating || 0);
        ratedDays += 1;
      }
    }

    return {
      label: `Н${index + 1}`,
      activeDays: count,
      avgRating: ratedDays ? Number((totalWeekRating / ratedDays).toFixed(1)) : 0,
    };
  });

  const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
    label: String(rating),
    count: activeEntries.filter((item) => Number(item.rating) === rating).length,
  }));

  return {
    activeDays,
    totalMinutes,
    avgRating,
    streak,
    longestStreak,
    completion,
    averageDuration,
    bestDay,
    bestRating,
    weekStats,
    ratingDistribution,
  };
}