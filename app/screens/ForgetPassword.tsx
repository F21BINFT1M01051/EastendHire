import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { RFPercentage } from "react-native-responsive-fontsize";
import { COLORS } from "../theme/constants";
import Feather from "@expo/vector-icons/Feather";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const ForgetPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");

  return (
    <LinearGradient
      colors={[COLORS.white, COLORS.white2, COLORS.white3]}
      style={styles.gradient}
    >
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Feather
              name="chevron-left"
              size={RFPercentage(3)}
              color={COLORS.black}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Reset Password</Text>
        </View>

        {/* Input Field */}
        <View style={styles.inputWrapper}>
          <InputField
            value={email}
            onChangeText={setEmail}
            placeholder="Enter Your Email"
            icon={(hasValue) => (
              <MaterialIcons
                name="email"
                size={RFPercentage(2)}
                color={hasValue ? COLORS.black : COLORS.gray}
              />
            )}
          />
        </View>

        {/* Button */}
        <View style={styles.buttonWrapper}>
          <PrimaryButton title="Send Link" onPress={() => {}} />
        </View>
      </View>
    </LinearGradient>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    width: "90%",
    alignItems: "center",
    alignSelf: "center",
    marginTop: RFPercentage(9),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 0,
  },
  headerText: {
    textAlign: "center",
    fontFamily: "Bold",
    fontSize: RFPercentage(2.2),
  },

  inputWrapper: {
    width: "100%",
    marginTop: RFPercentage(3),
  },
  label: {
    color: COLORS.black,
    fontFamily: "SemiBold",
    fontSize: RFPercentage(1.6),
    marginBottom: RFPercentage(-0.7),
  },
  buttonWrapper: {
    width: "100%",
    marginTop: RFPercentage(5),
    alignItems: "center",
  },
});
