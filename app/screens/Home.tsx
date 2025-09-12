import React, { useState } from "react";
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { RFPercentage } from "react-native-responsive-fontsize";
import { IMAGES } from "../theme/constants";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { COLORS } from "../theme/constants";

export default function HomeScreen() {
  const [registration, setRegistration] = useState("");
  const [brakes, setBrakes] = useState(null);
  const [lights, setLights] = useState(null);
  const [seatBelt, setSeatBelt] = useState(null);
  const [handBrake, setHandBrake] = useState(null);
  const [comments, setComments] = useState("");

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleClear = () => {
    setRegistration("");
    setBrakes(null);
    setLights(null);
    setSeatBelt(null);
    setHandBrake(null);
    setComments("");
  };

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
                name="checkmark"
                size={RFPercentage(2.3)}
                color={COLORS.white}
              />
            )}
            <Text
              style={[
                styles.optionText,
                state === "pass" && styles.selectedText,
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
              <Ionicons name="close" size={RFPercentage(2.3)} color={COLORS.white} />
            )}
            <Text
              style={[
                styles.optionText,
                state === "fail" && styles.selectedText,
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
    <LinearGradient
      colors={[COLORS.white, COLORS.white2, COLORS.white3]}
      style={{ flex: 1 }}
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
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <Image
                source={IMAGES.img}
                resizeMode="cover"
                style={styles.avatar}
              />
            </View>
            <Text style={styles.greeting}>Hi, Sophia Elizabeth</Text>
          </View>

          <Text style={styles.date}>{today}</Text>

          {/* Vehicle Registration */}
          <View style={styles.inputContainer}>
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
          <Text style={styles.inputLabel}>Inspection Checklist</Text>
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
            >
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.btn, styles.clearBtn]}
              onPress={handleClear}
            >
              <Text style={styles.btnText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: RFPercentage(7),
    paddingHorizontal: RFPercentage(3),
    paddingBottom: RFPercentage(12),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: RFPercentage(2),
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
  greeting: {
    color: COLORS.black,
    fontFamily: "Headline",
    fontSize: RFPercentage(2),
    marginLeft: RFPercentage(1.5),
  },
  date: {
    fontSize: RFPercentage(1.8),
    color: COLORS.gray2,
    marginBottom: RFPercentage(3),
    fontFamily: "SemiBold",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: RFPercentage(1.5),
  },
  sectionTitle: {
    fontSize: RFPercentage(2),
    color: COLORS.gray3,
    fontFamily: "SemiBold",
    marginBottom: RFPercentage(2),
  },
  inputContainer: {
    marginBottom: RFPercentage(2.5),
  },
  inputLabel: {
    fontSize: RFPercentage(1.7),
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
    elevation: 2,
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
    // marginBottom: RFPercentage(1.5),
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
    backgroundColor:COLORS.white4,
    borderRadius: 8,
    paddingVertical: RFPercentage(1.5),
    gap: 6,
  },
  passSelected: {
    backgroundColor: COLORS.black,
  },
  failSelected: {
    backgroundColor:  COLORS.black,
  },
  optionText: {
    color:  COLORS.gray2,
    fontSize: RFPercentage(1.7),
    fontFamily: "Medium",
  },
  selectedText: {
    color:  COLORS.white,
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
    backgroundColor:  COLORS.black,
  },
  clearBtn: {
    backgroundColor: "#c8c5c5ff",
  },
  btnText: {
    color:  COLORS.white,
    fontSize: RFPercentage(1.8),
    fontFamily: "Medium",
  },
});
