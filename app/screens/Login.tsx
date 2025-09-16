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
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Fontisto from "@expo/vector-icons/Fontisto";
import { COLORS } from "../theme/constants";
import * as yup from "yup";
import { Formik } from "formik";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { showToast } from "../utils/toastMessage";
import { saveCredentials } from "../utils/storageHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";

let validationSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
});

export default function SignIn({ navigation }) {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (values: any) => {
    if (!values.email || !values.password) {
      return;
    } else {
      try {
        setLoading(true);
        const userCredential = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        await saveCredentials(values.email, values.password);
        await AsyncStorage.setItem("isLoggedOut", "false");
        navigation.navigate("BottomTabs");
        showToast({
          type: "success",
          title: "Welcome Back!",
          message: "Signed In successfully",
        });
        console.log("User signed in:", userCredential.user);
      } catch (error) {
        showToast({
          type: "error",
          title: "Sign In Failed",
          message: error.message,
        });
        console.log("Sign-in error:", error.message);
      } finally {
        setLoading(false);
      }
    }
  };

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

            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              {` Log in to access your vehicle safety\nchecks with ease.`}
            </Text>

            {/* Inputs */}

            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => handleSignIn(values)}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <>
                  <InputField
                    onChangeText={handleChange("email")}
                    handleBlur={handleBlur("email")}
                    value={values.email}
                    placeholder="Enter Your Email"
                    icon={(hasValue) => (
                      <MaterialIcons
                        name="email"
                        size={RFPercentage(2.2)}
                        color={hasValue ? COLORS.black : COLORS.gray}
                      />
                    )}
                    error={touched.email && !!errors.email}
                  />
                  {touched.email && errors.email && (
                    <>
                      <View
                        style={{ marginTop: RFPercentage(0.5), width: "100%" }}
                      >
                        <Text
                          style={{
                            color: "red",
                            fontFamily: "Regular",
                            fontSize: RFPercentage(1.7),
                          }}
                        >
                          {errors.email}
                        </Text>
                      </View>
                    </>
                  )}
                  <InputField
                    onChangeText={handleChange("password")}
                    handleBlur={handleBlur("password")}
                    value={values.password}
                    placeholder="Enter Your Password"
                    password
                    icon={(hasValue) => (
                      <Fontisto
                        name="locked"
                        size={RFPercentage(2.2)}
                        color={hasValue ? COLORS.black : COLORS.gray}
                      />
                    )}
                    error={touched.password && !!errors.password}
                  />
                  {touched.password && errors.password && (
                    <>
                      <View
                        style={{ marginTop: RFPercentage(0.5), width: "100%" }}
                      >
                        <Text
                          style={{
                            color: "red",
                            fontFamily: "Regular",
                            fontSize: RFPercentage(1.7),
                          }}
                        >
                          {errors.password}
                        </Text>
                      </View>
                    </>
                  )}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate("ForgetPassword")}
                    style={{
                      alignSelf: "flex-end",
                      marginTop: RFPercentage(0.7),
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.gray2,
                        fontFamily: "Medium",
                        fontSize: RFPercentage(1.7),
                      }}
                    >
                      Forget Password?
                    </Text>
                  </TouchableOpacity>
                  {/* Primary Button */}
                  <View style={styles.primaryBtnWrapper}>
                    <PrimaryButton
                      title="Sign In"
                      onPress={handleSubmit}
                      loader={loading}
                    />
                  </View>
                </>
              )}
            </Formik>

            {/* Already have an account */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate("SignUp")}
            >
              <Text style={styles.secondaryBtnText}>
                Don&apos;t have an account?
                <Text style={styles.highlightText}> Sign Up</Text>
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
  highlightText: {
    color: COLORS.black,
    fontFamily: "SemiBold",
  },
});
