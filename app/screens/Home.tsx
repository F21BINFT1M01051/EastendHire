import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  ActivityIndicator,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { IMAGES } from "../theme/constants";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { COLORS } from "../theme/constants";
import { db } from "../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { listenToUserData } from "../utils/userData";
import { useExitAppOnBack } from "../utils/appBack";
import { showToast } from "../utils/toastMessage";

export default function HomeScreen() {
  const [registration, setRegistration] = useState("");
  const [brakes, setBrakes] = useState(null);
  const [lights, setLights] = useState(null);
  const [seatBelt, setSeatBelt] = useState(null);
  const [handBrake, setHandBrake] = useState(null);
  const [comments, setComments] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [userData, setUserData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  useExitAppOnBack();

  useEffect(() => {
    let unsub;
    const setupListener = async () => {
      try {
        unsub = await listenToUserData((data) => {
          setUserData(data);
          setLoading(false);
        });
      } catch (error) {
        console.log("Error fetching user data:", error);
        setLoading(false);
      }
    };
    setupListener();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const handleClear = () => {
    setRegistration("");
    setBrakes(null);
    setLights(null);
    setSeatBelt(null);
    setHandBrake(null);
    setComments("");
  };

  const handleSave = async () => {
    if (!registration.trim()) {
      showToast({
        type: "info",
        title: "Inspection Report",
        message: "Vehicle Registration is required!",
      });
      return;
    }
    try {
      setSaving(true);

      if (!userData?.userId) {
        console.log("No user ID found in userData");
        return;
      }
      const inspectionData = {
        userId: userData.userId,
        registration: registration.trim(),
        brakes,
        lights,
        seatBelt,
        handBrake,
        comments: comments.trim(),
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "Inspections"), inspectionData);
      setShowSuccess(true);
      handleClear();
    } catch (error) {
      console.log("Error saving inspection:", error);
    } finally {
      setSaving(false);
    }
  };

  const hasFormData =
    registration.trim() !== "" ||
    (brakes !== null ||
      lights !== null ||
      seatBelt !== null ||
      handBrake !== null ||
      comments.trim() !== "");

  const renderOption = (label, state, setState, iconName, iconType) => {
    let IconComponent;
    switch (iconType) {
      case "MaterialCommunityIcons":
        IconComponent = MaterialCommunityIcons;
        break;
      case "FontAwesome5":
        IconComponent = FontAwesome5;
        break;
      case "MaterialIcons":
        IconComponent = MaterialIcons;
        break;
      default:
        IconComponent = Ionicons;
    }

    return (
      <View style={styles.checkboxCard}>
        <View style={styles.cardHeader}>
          <IconComponent
            name={iconName}
            size={RFPercentage(2.2)}
            color={COLORS.gray4}
          />
          <Text style={styles.cardLabel}>{label}</Text>
        </View>
        <View style={styles.checkboxRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.optionButton,
              state === "pass" && styles.passSelected,
            ]}
            onPress={() => setState("pass")}
          >
            {state === "pass" && (
              <Ionicons
                name="checkmark-circle"
                size={RFPercentage(2.3)}
                color={COLORS.success}
              />
            )}
            <Text
              style={[
                styles.optionText,
                state === "pass" && styles.selectedText1,
              ]}
            >
              Pass
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.optionButton,
              state === "fail" && styles.failSelected,
            ]}
            onPress={() => setState("fail")}
          >
            {state === "fail" && (
              <Ionicons
                name="close-circle"
                size={RFPercentage(2.3)}
                color={COLORS.error}
              />
            )}
            <Text
              style={[
                styles.optionText,
                state === "fail" && styles.selectedText2,
              ]}
            >
              Fail
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: COLORS.white }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor="transparent"
        />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={[
              styles.container,
              {
                paddingBottom:
                  Platform.OS === "android"
                    ? RFPercentage(28)
                    : RFPercentage(15),
              },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
          >
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.avatarContainer}>
                {loading ? (
                  <ActivityIndicator size={"small"} color={COLORS.gray} />
                ) : (
                  <Image
                    source={
                      userData?.image ? { uri: userData.image } : IMAGES.img
                    }
                    resizeMode="cover"
                    style={userData?.image ? styles.avatar : styles.default}
                  />
                )}
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.greeting}>Welcome!</Text>
                <Text style={styles.date}>{today}</Text>
              </View>
            </View>

            {/* Form Header */}
            <View style={styles.formHeader}>
              <View style={styles.formTitleContainer}>
                <MaterialCommunityIcons
                  name="clipboard-check-outline"
                  size={RFPercentage(3.2)}
                  color={COLORS.black}
                />
                <Text style={styles.formTitle}>Vehicle Inspection Form</Text>
              </View>
              {/* <View style={styles.formDivider} /> */}
            </View>

            {/* Vehicle Registration */}
            <View style={[styles.inputContainer]}>
              <Text style={styles.inputLabel}>Vehicle Registration</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter registration number"
                value={registration}
                onChangeText={setRegistration}
                placeholderTextColor={COLORS.placholder}
                selectionColor={COLORS.black}
              />
            </View>

            {/* Checklist Items */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Inspection Report</Text>
              <Text style={styles.sectionSubtitle}>
                Select Pass/Fail For Each
              </Text>
            </View>

            {renderOption(
              "Brakes",
              brakes,
              setBrakes,
              "car-brake-abs",
              "MaterialCommunityIcons"
            )}
            {renderOption(
              "Lights",
              lights,
              setLights,
              "car-parking-lights",
              "MaterialCommunityIcons"
            )}
            {renderOption(
              "Seat Belt",
              seatBelt,
              setSeatBelt,
              "seatbelt",
              "MaterialCommunityIcons"
            )}
            {renderOption(
              "Hand Brake",
              handBrake,
              setHandBrake,
              "car-brake-retarder",
              "MaterialCommunityIcons"
            )}

            {/* Comments */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Comments / Feedback</Text>
              <TextInput
                style={[styles.input, styles.commentsBox]}
                placeholder="Add any additional notes here"
                value={comments}
                onChangeText={setComments}
                multiline
                placeholderTextColor={COLORS.placholder}
                selectionColor={COLORS.black}
              />
            </View>

            {/* Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.btn, styles.saveBtn]}
                onPress={handleSave}
                disabled={!hasFormData || saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={[styles.btnText, { color: COLORS.white }]}>
                    Save
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.btn,
                  styles.clearBtn,
                  !hasFormData && { opacity: 0.8 },
                ]}
                onPress={handleClear}
                disabled={!hasFormData}
              >
                <Text style={styles.btnText}>Clear All</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <Modal
          visible={showSuccess}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSuccess(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Ionicons
                name="checkmark-circle"
                size={60}
                color={COLORS.black}
                style={{ marginBottom: 15 }}
              />
              <Text style={styles.modalTitle}>Saved Successfully!</Text>
              <Text style={styles.modalMessage}>
                Your inspection details have been saved.
              </Text>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowSuccess(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: RFPercentage(7),
    paddingHorizontal: RFPercentage(3),
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: RFPercentage(1),
  },
  headerTextContainer: {
    marginLeft: RFPercentage(1.5),
    flex: 1,
  },
  avatarContainer: {
    width: RFPercentage(7),
    height: RFPercentage(7),
    borderRadius: RFPercentage(100),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.black,
    overflow: "hidden",
  },
  avatar: {
    width: RFPercentage(6.8),
    height: RFPercentage(6.8),
    borderRadius: RFPercentage(100),
  },
  default: {
    width: RFPercentage(8.8),
    height: RFPercentage(8.8),
    borderRadius: RFPercentage(100),
  },
  greeting: {
    color: COLORS.black,
    fontFamily: "Headline",
    fontSize: RFPercentage(2.3),
  },
  date: {
    fontSize: RFPercentage(1.8),
    color: COLORS.gray3,
    fontFamily: "Medium",
    marginTop: RFPercentage(0.3),
  },
  // Form Header Styles
  formHeader: {
    marginVertical: RFPercentage(2),
  },
  formTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: RFPercentage(1.5),
  },
  formTitle: {
    color: COLORS.black,
    fontFamily: "Bold",
    fontSize: RFPercentage(2.2),
    marginLeft: RFPercentage(1),
    textAlign: "center",
  },
  formDivider: {
    height: 2,
    backgroundColor: COLORS.black,
    width: "80%",
    alignSelf: "center",
    borderRadius: 2,
  },
  // Section Header
  sectionHeader: {
    marginBottom: RFPercentage(2),
  },
  sectionTitle: {
    fontSize: RFPercentage(1.9),
    color: COLORS.gray4,
    fontFamily: "SemiBold",
    marginBottom: RFPercentage(0.5),
  },
  sectionSubtitle: {
    color: COLORS.gray2,
    fontFamily: "Regular",
    fontSize: RFPercentage(1.6),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: RFPercentage(1.5),
  },
  inputContainer: {
    marginBottom: RFPercentage(2.5),
  },
  inputLabel: {
    fontSize: RFPercentage(1.9),
    color: COLORS.gray4,
    fontFamily: "SemiBold",
    marginBottom: RFPercentage(1),
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: RFPercentage(2),
    paddingVertical: RFPercentage(1.8),
    fontFamily: "Regular",
    fontSize: RFPercentage(1.7),
    color: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: COLORS.lightwhite,
  },
  commentsBox: {
    height: RFPercentage(12),
    textAlignVertical: "top",
  },
  checkboxCard: {
    backgroundColor: COLORS.white,
    padding: RFPercentage(2.5),
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: RFPercentage(2),
    borderWidth: 1,
    borderColor: COLORS.lightwhite,
  },
  cardLabel: {
    fontSize: RFPercentage(1.8),
    color: COLORS.gray3,
    fontFamily: "SemiBold",
    marginLeft: RFPercentage(0.5),
  },
  checkboxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionButton: {
    flex: 0.48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white4,
    borderRadius: 8,
    paddingVertical: RFPercentage(1.5),
    gap: 6,
  },
  passSelected: {
    backgroundColor: "#cff6e0ff",
  },
  failSelected: {
    backgroundColor: "#fcdad7ff",
  },
  optionText: {
    color: COLORS.gray2,
    fontSize: RFPercentage(1.8),
    fontFamily: "Medium",
  },
  selectedText1: {
    color: COLORS.success,
    fontFamily: "SemiBold",
  },
  selectedText2: {
    color: COLORS.error,
    fontFamily: "SemiBold",
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: RFPercentage(3),
  },
  btn: {
    flex: 0.48,
    paddingVertical: RFPercentage(1.6),
    borderRadius: RFPercentage(100),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveBtn: {
    backgroundColor: COLORS.black,
  },
  clearBtn: {
    backgroundColor: "#c8c5c5ff",
  },
  btnText: {
    color: COLORS.white,
    fontSize: RFPercentage(1.9),
    fontFamily: "Medium",
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
    fontFamily: "Regular",
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
