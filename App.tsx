import React, { useCallback, useEffect, useState } from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import AppTabs from "./navigation/AppTabs";
import { EntriesProvider, useEntries } from "./context/EntriesContext";
import AnimatedSplashScreen from "./components/AnimatedSplashScreen";

SplashScreen.preventAutoHideAsync().catch(() => {});

const MyTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#0D1117",
    card: "#11151D",
    border: "rgba(255,255,255,0.08)",
    primary: "#8FE3C8",
    text: "#F4F7FB",
  },
};

export default function App(): React.JSX.Element {
  const [appReady, setAppReady] = useState(false);
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);

  useEffect(() => {
    const prepare = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
      } finally {
        setAppReady(true);
      }
    };

    prepare();
  }, []);

  function AppContent(): React.JSX.Element | null {
    const { isHydrated } = useEntries();

    if (!isHydrated) {
      return null;
    }

    return <AppTabs />;
  }

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) {
    return <></>;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <EntriesProvider>
        <NavigationContainer theme={MyTheme}>
          <AppContent />
          {showAnimatedSplash ? (
            <AnimatedSplashScreen
              onFinish={() => setShowAnimatedSplash(false)}
            />
          ) : null}
        </NavigationContainer>
      </EntriesProvider>
    </SafeAreaProvider>
  );
}
