import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../theme/constants";

export default function History({ navigation }) {
  const dummyHistory = [
    {
      id: "1",
      date: "September 11, 2025",
      registration: "ABC-1234",
      brakes: "pass",
      lights: "fail",
      seatBelt: "pass",
      handBrake: "pass",
      comments: "Lights need replacement soon.",
    },
    {
      id: "2",
      date: "September 10, 2025",
      registration: "XYZ-7890",
      brakes: "fail",
      lights: "pass",
      seatBelt: "fail",
      handBrake: "pass",
      comments: "Brakes making noise, seat belt jammed.",
    },
  ];

  const renderCard = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={() => navigation.navigate("DetailsScreen", { data: item })}
    >
      <View>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.registration}>Reg: {item.registration}</Text>
      </View>

      <TouchableOpacity activeOpacity={0.8}>
        <Feather
          name="chevron-right"
          size={RFPercentage(2.2)}
          color={COLORS.black}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={[COLORS.white, COLORS.white2, COLORS.white3]}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <Text style={styles.title}>History</Text>
      <FlatList
        data={dummyHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: RFPercentage(3),
    paddingTop: RFPercentage(8),
  },
  title: {
    fontSize: RFPercentage(2.3),
    marginBottom: RFPercentage(2),
    color: COLORS.black,
    fontFamily: "Bold",
  },
  card: {
    backgroundColor: COLORS.white,
    padding: RFPercentage(2),
    borderRadius: 12,
    marginBottom: RFPercentage(1.5),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderBottomWidth: RFPercentage(0.6),
    borderColor: "rgba(235, 235, 235, 1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  date: {
    fontSize: RFPercentage(1.8),
    fontFamily: "SemiBold",
    color: COLORS.black,
  },
  registration: {
    fontSize: RFPercentage(1.7),
    color: COLORS.gray2,
    marginTop: RFPercentage(0.7),
    fontFamily: "Regular",
  },
});
