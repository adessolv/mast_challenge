import React from "react";
import { View, Text, StyleSheet } from "react-native";

type InputBlockProps = {
  label: string;
  children: React.ReactNode;
};

export default function InputBlock({
  label,
  children,
}: InputBlockProps): React.JSX.Element {
  return (
    <View style={styles.inputBlock}>
      <Text style={styles.inputLabel}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  inputBlock: {
    gap: 10,
  },
  inputLabel: {
    color: "#DDE5F0",
    fontSize: 14,
    fontWeight: "700",
  },
});
