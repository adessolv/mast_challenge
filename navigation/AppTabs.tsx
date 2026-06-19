import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CalendarScreen from "../screens/CalendarScreen";
import StatsScreen from "../screens/StatsScreen";

export type RootTabParamList = {
  Calendar: undefined;
  Stats: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function AppTabs(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 10);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#8FE3C8",
        tabBarInactiveTintColor: "#6E7687",
        tabBarStyle: [
          styles.tabBar,
          {
            height: 64 + bottomInset,
            paddingTop: 8,
            paddingBottom: bottomInset,
          },
        ],
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        tabBarIconStyle: styles.tabBarIcon,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "ellipse";

          if (route.name === "Calendar") {
            iconName = focused ? "calendar" : "calendar-outline";
          }

          if (route.name === "Stats") {
            iconName = focused ? "stats-chart" : "stats-chart-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ tabBarLabel: "Календарь" }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{ tabBarLabel: "Статистика" }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#11151D",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
  },
  tabBarItem: {
    paddingVertical: 2,
  },
  tabBarIcon: {
    marginTop: 2,
  },
});
