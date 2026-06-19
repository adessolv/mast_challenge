import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";

type AnimatedSplashScreenProps = {
  onFinish: () => void;
};

export default function AnimatedSplashScreen({
  onFinish,
}: AnimatedSplashScreenProps): React.JSX.Element {
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(16)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateY, {
          toValue: 0,
          duration: 900,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(1100),
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 650,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        onFinish();
      }
    });
  }, [
    contentOpacity,
    contentTranslateY,
    onFinish,
    overlayOpacity,
    screenOpacity,
  ]);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <ImageBackground
        source={require("../assets/splash-image.png")}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />

        <Animated.View
          style={[
            styles.content,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslateY }],
            },
          ]}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Private wellness</Text>
          </View>

          <Text style={styles.title}>Private Flow</Text>
          <Text style={styles.subtitle}>
            Твой приватный ритм, прогресс и наблюдения в одном красивом трекере.
          </Text>
        </Animated.View>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 20,
    elevation: 20,
    backgroundColor: "#0D1117",
  },
  imageBackground: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(6,10,14,0.38)",
  },
  content: {
    paddingHorizontal: 28,
    paddingBottom: 72,
    gap: 12,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(143,227,200,0.14)",
    borderWidth: 1,
    borderColor: "rgba(143,227,200,0.28)",
  },
  badgeText: {
    color: "#CFF8EA",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  subtitle: {
    color: "rgba(244,247,251,0.82)",
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 320,
  },
});
