import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { RFPercentage } from "react-native-responsive-fontsize";
import { COLORS } from "../theme/constants";
import Feather from "@expo/vector-icons/Feather";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as yup from "yup";
import { Formik } from "formik";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

let validationSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const ForgetPassword = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const handleReset = async (values) => {
    if (!values.email) return;

    try {
      setLoading(true);
      const usersRef = collection(db, "Users");
      const q = query(usersRef, where("email", "==", values.email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setModalTitle("Not Found");
        setModalMessage("No account found with this email.");
        setShowModal(true);
        return;
      }

      await sendPasswordResetEmail(auth, values.email);

      setModalTitle("Email Sent");
      setModalMessage(
        "A password reset link has been sent to your email.\nIf you don’t see it in your inbox, please check your spam or junk folder."
      );
      setShowModal(true);
    } catch (error) {
      console.error("Reset error:", error);
      setModalTitle("Error");
      setModalMessage(error.message || "Something went wrong.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <>
        <LinearGradient
          colors={[COLORS.white, COLORS.white]}
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
                  size={RFPercentage(3.3)}
                  color={COLORS.black}
                />
              </TouchableOpacity>
              <Text style={styles.headerText}>Reset Password</Text>
            </View>

            {/* Input Field */}
            <Formik
              initialValues={{
                email: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => handleReset(values)}
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
                  <View style={styles.inputWrapper}>
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
                          style={{
                            marginTop: RFPercentage(0.5),
                            width: "100%",
                          }}
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
                  </View>

                  {/* Button */}
                  <View style={styles.buttonWrapper}>
                    <PrimaryButton
                      title="Send Link"
                      onPress={handleSubmit}
                      loader={loading}
                    />
                  </View>
                </>
              )}
            </Formik>
          </View>
        </LinearGradient>
        <Modal
          visible={showModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Ionicons
                name={
                  modalTitle === "Error"
                    ? "close-circle"
                    : modalTitle === "Not Found"
                    ? "alert-circle"
                    : "checkmark-circle"
                }
                size={60}
                color={COLORS.black}
                style={{ marginBottom: 15 }}
              />
              <Text style={styles.modalTitle}>{modalTitle}</Text>
              <Text style={styles.modalMessage}>{modalMessage}</Text>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>
    </TouchableWithoutFeedback>
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
    fontSize: RFPercentage(2.5),
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: COLORS.white,
    padding: RFPercentage(3),
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: RFPercentage(2.3),
    fontFamily: "SemiBold",
    color: COLORS.black,
    marginBottom: RFPercentage(1),
  },
  modalMessage: {
    fontSize: RFPercentage(1.8),
    color: COLORS.gray3,
    textAlign: "center",
    marginBottom: RFPercentage(3),
  },
  modalButton: {
    backgroundColor: COLORS.black,
    paddingVertical: RFPercentage(1.2),
    paddingHorizontal: RFPercentage(5),
    borderRadius: 50,
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: RFPercentage(1.8),
    fontFamily: "Medium",
  },
});
