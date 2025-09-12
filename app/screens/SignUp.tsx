import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { RFPercentage } from "react-native-responsive-fontsize";
import { IMAGES } from "../theme/constants";
import PrimaryButton from "../components/PrimaryButton";
import InputField from "../components/InputField";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Fontisto from "@expo/vector-icons/Fontisto";
import { COLORS } from "../theme/constants";

export default function SignUp({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={[COLORS.white, COLORS.white]}
        style={styles.container}
      >
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor="transparent"
        />

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
          >
            <Image
              source={IMAGES.logo}
              resizeMode="contain"
              style={styles.logo}
            />

            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>
              {`Sign up to start managing your vehicle safety\nchecks effortlessly.`}
            </Text>

            {/* Inputs */}
            <InputField
              value={name}
              onChangeText={setName}
              placeholder="Enter Your Name"
              icon={(hasValue) => (
                <FontAwesome5
                  name="user-alt"
                  size={RFPercentage(2.2)}
                  color={hasValue ? COLORS.black : COLORS.gray}
                />
              )}
            />

            <InputField
              value={email}
              onChangeText={setEmail}
              placeholder="Enter Your Email"
              icon={(hasValue) => (
                <MaterialIcons
                  name="email"
                  size={RFPercentage(2.2)}
                  color={hasValue ? COLORS.black : COLORS.gray}
                />
              )}
            />

            <InputField
              value={password}
              onChangeText={setPassword}
              placeholder="Enter Your Password"
              password
              icon={(hasValue) => (
                <Fontisto
                  name="locked"
                  size={RFPercentage(2.2)}
                  color={hasValue ? COLORS.black : COLORS.gray}
                />
              )}
            />

            {/* Primary Button */}
            <View style={styles.primaryBtnWrapper}>
              <PrimaryButton title="Sign Up" onPress={() => {}} />
            </View>

            {/* Already have an account */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate("SignIn")}
            >
              <Text style={styles.secondaryBtnText}>
                Already have an account?
                <Text style={styles.loginText}> Log In</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    paddingTop: RFPercentage(6),
    paddingHorizontal: RFPercentage(3),
    paddingBottom: RFPercentage(5),
    alignItems: "center",
  },
  logo: {
    width: RFPercentage(30),
    height: RFPercentage(10),
  },
  title: {
    fontSize: RFPercentage(2.7),
    color: COLORS.black,
    fontFamily: "Headline",
    marginBottom: RFPercentage(1.5),
    textAlign: "center",
    marginTop: RFPercentage(4),
  },
  subtitle: {
    fontSize: RFPercentage(1.7),
    color: COLORS.black2,
    textAlign: "center",
    marginBottom: RFPercentage(5),
    lineHeight: RFPercentage(2.3),
    fontFamily: "Regular",
  },
  primaryBtnWrapper: {
    marginTop: RFPercentage(6),
    width: "100%",
  },
  secondaryBtn: {
    marginTop: RFPercentage(1.6),
  },
  secondaryBtnText: {
    fontSize: RFPercentage(1.7),
    color: COLORS.gray2,
    textAlign: "center",
    fontFamily: "Medium",
  },
  loginText: {
    color: COLORS.black,
    fontFamily:"SemiBold"
  },
});
