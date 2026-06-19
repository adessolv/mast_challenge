import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Entry, EntryMap, initialEntries } from "../data/mockData";
import { getStats } from "../utils/stats";

type EntriesContextValue = {
  entries: EntryMap;
  setEntries: React.Dispatch<React.SetStateAction<EntryMap>>;
  updateEntry: (
    day: number,
    field: keyof Entry,
    value: Entry[keyof Entry],
  ) => void;
  toggleActive: (day: number) => void;
  saveEntry: (day: number, entry: Entry) => void;
  clearAllEntries: () => Promise<void>;
  stats: ReturnType<typeof getStats>;
  isHydrated: boolean;
};

const EntriesContext = createContext<EntriesContextValue | undefined>(
  undefined,
);

const STORAGE_KEY = "private-flow-entries";

export function EntriesProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [entries, setEntries] = useState<EntryMap>(initialEntries);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);

        if (raw) {
          setEntries(JSON.parse(raw));
        }
      } catch (error) {
        console.log("Failed to load entries:", error);
      } finally {
        setIsHydrated(true);
      }
    };

    loadEntries();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const saveEntries = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      } catch (error) {
        console.log("Failed to save entries:", error);
      }
    };

    saveEntries();
  }, [entries, isHydrated]);

  const updateEntry = (
    day: number,
    field: keyof Entry,
    value: Entry[keyof Entry],
  ) => {
    setEntries((prev) => {
      const currentEntry: Entry = prev[day] ?? {
        active: false,
        duration: 20,
        rating: 3,
        note: "",
      };

      return {
        ...prev,
        [day]: {
          ...currentEntry,
          active: true,
          [field]: value,
        },
      };
    });
  };

  const toggleActive = (day: number) => {
    setEntries((prev) => {
      const currentEntry: Entry = prev[day] ?? {
        active: false,
        duration: 20,
        rating: 3,
        note: "",
      };

      return {
        ...prev,
        [day]: {
          ...currentEntry,
          active: !currentEntry.active,
        },
      };
    });
  };

  const saveEntry = (day: number, entry: Entry) => {
    setEntries((prev) => ({
      ...prev,
      [day]: {
        ...entry,
        active: true,
      },
    }));
  };

  const clearAllEntries = async () => {
    setEntries({});
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const stats = useMemo(() => getStats(entries), [entries]);

  const value = useMemo(
    () => ({
      entries,
      setEntries,
      updateEntry,
      toggleActive,
      saveEntry,
      clearAllEntries,
      stats,
      isHydrated,
    }),
    [entries, stats, isHydrated],
  );

  return (
    <EntriesContext.Provider value={value}>{children}</EntriesContext.Provider>
  );
}

export function useEntries(): EntriesContextValue {
  const context = useContext(EntriesContext);

  if (!context) {
    throw new Error("useEntries must be used within EntriesProvider");
  }

  return context;
}
