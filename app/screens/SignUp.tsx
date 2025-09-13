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
import * as yup from "yup";
import { Formik } from "formik";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { showToast } from "../utils/toastMessage";
import { saveCredentials } from "../utils/storageHelper";

let validationSchema = yup.object({
  name: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
});

export default function SignUp({ navigation }) {
  const [loading, setLoading] = useState(false);
  const handleSignUp = async (values: any) => {
    if (!values.name || !values.email || !values.password) return;
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "Users", user.uid), {
        userId: user.uid, // <-- add this line
        name: values.name,
        email: values.email,
        createdAt: serverTimestamp(),
      });

      await saveCredentials(values.email, values.password);
      navigation.navigate("BottomTabs");
      showToast({
        type: "success",
        title: "Sign Up",
        message: "Signed Up successfully",
      });
      console.log("User registered & profile saved:", user.uid);
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Sign Up Failed",
        message: "Email is already in use",
      });
      console.log("Sign-up error:", error.message);
    } finally {
      setLoading(false);
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

            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>
              {`Sign up to start managing your vehicle safety\nchecks effortlessly.`}
            </Text>

            {/* Inputs */}

            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => handleSignUp(values)}
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
                    onChangeText={handleChange("name")}
                    handleBlur={handleBlur("name")}
                    value={values.name}
                    placeholder="Enter Your Name"
                    icon={(hasValue) => (
                      <FontAwesome5
                        name="user-alt"
                        size={RFPercentage(2.2)}
                        color={hasValue ? COLORS.black : COLORS.gray}
                      />
                    )}
                    error={touched.name && !!errors.name}
                  />
                  {touched.name && errors.name && (
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
                          {errors.name}
                        </Text>
                      </View>
                    </>
                  )}

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

                  {/* Primary Button */}
                  <View style={styles.primaryBtnWrapper}>
                    <PrimaryButton
                      title="Sign Up"
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
    fontSize: RFPercentage(1.8),
    color: COLORS.gray2,
    textAlign: "center",
    fontFamily: "Medium",
  },
  loginText: {
    color: COLORS.black,
    fontFamily: "SemiBold",
  },
});
