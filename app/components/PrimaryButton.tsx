import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { RFPercentage } from "react-native-responsive-fontsize";
import { COLORS } from "../theme/constants";

interface Props {
  title: string;
  onPress: () => void;
}

const PrimaryButton = (props: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={props.onPress}
      style={styles.buttonContainer}
    >
      <LinearGradient
        colors={[COLORS.black, COLORS.black3, COLORS.black4]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.title}>{props.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    height: RFPercentage(6.5),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFPercentage(2),
  },
  gradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFPercentage(2),
    width: "100%",
  },
  title: {
    color: "white",
    fontFamily: "Medium",
    fontSize: RFPercentage(2),
  },
});
