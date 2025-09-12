import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { RFPercentage } from "react-native-responsive-fontsize";
import { COLORS, IMAGES } from "../theme/constants";
import PrimaryButton from "../components/PrimaryButton";

export default function Onboarding({ navigation }) {
  return (
    <LinearGradient
      colors={[COLORS.white, COLORS.white]}
      style={styles.container}
    >
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <Image
        source={IMAGES.logo}
        resizeMode="contain"
        style={{ width: RFPercentage(30), height: RFPercentage(10) }}
      />
      <Image
        source={IMAGES.onBoarding}
        resizeMode="cover"
        style={{
          width: RFPercentage(50),
          height: RFPercentage(25),
          marginTop: RFPercentage(5),
        }}
      />
      <Text style={styles.title}>Welcome to Eastend Hire</Text>

      <Text style={styles.subtitle}>
        Keep your vehicle in top shape with quick safety checks. Pass or fail
        items, leave feedback, and stay road-ready!
      </Text>

      <View style={styles.btnContainer}>
        <PrimaryButton
          title="Get Started"
          onPress={() => navigation.navigate("SignUp")}
        />

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={styles.secondaryBtnText}>Already Have An Account</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: RFPercentage(6),
    alignItems: "center",
    paddingHorizontal: RFPercentage(2),
  },
  title: {
    fontSize: RFPercentage(3),
    color: COLORS.black,
    textAlign: "center",
    marginTop: RFPercentage(8),
    fontFamily: "Headline",
  },
  subtitle: {
    fontSize: RFPercentage(1.8),
    color: COLORS.black2,
    textAlign: "center",
    lineHeight: RFPercentage(2.4),
    marginTop: RFPercentage(1.5),
    fontFamily: "Regular",
  },
  btnContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: RFPercentage(8),
  },

  secondaryBtn: {
    marginTop: RFPercentage(1.5),
  },
  secondaryBtnText: {
    color: COLORS.gray2,
    fontSize: RFPercentage(1.6),
    fontFamily: "Medium",
  },
});
