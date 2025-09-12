import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { COLORS } from "../theme/constants";

export default function DetailsScreen({ route, navigation }) {
  const { data } = route.params;

  const Row = ({ icon, label, value }) => {
    const lowerValue = value?.toLowerCase();
    const showStatus = lowerValue === "pass" || lowerValue === "fail";

    return (
      <View style={styles.row}>
        <Ionicons
          name={icon}
          size={RFPercentage(2.2)}
          color={COLORS.gray4}
          style={styles.icon}
        />

        <Text style={styles.label}>
          {label}: <Text style={styles.value}>{value}</Text>
        </Text>

        {showStatus && (
          <Ionicons
            name={lowerValue === "pass" ? "checkmark-circle" : "close-circle"}
            size={RFPercentage(3)}
            color={lowerValue === "pass" ? COLORS.black : COLORS.gray}
            style={styles.statusIcon}
          />
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.goBack()}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <Feather
          name="chevron-left"
          size={RFPercentage(3)}
          color={COLORS.black}
        />
        <Text style={styles.title}>Details</Text>
      </TouchableOpacity>
      <View style={{ marginTop: RFPercentage(3) }}>
        <Row icon="calendar-outline" label="Date" value={data.date} />
        <Row
          icon="car-outline"
          label="Registration No"
          value={data.registration}
        />
        <Row icon="speedometer-outline" label="Brakes" value={data.brakes} />
        <Row icon="bulb-outline" label="Lights" value={data.lights} />
        <Row
          icon="lock-closed-outline"
          label="Seat Belt"
          value={data.seatBelt}
        />
        <Row
          icon="hand-left-outline"
          label="Hand Brake"
          value={data.handBrake}
        />
      </View>
      <View style={{ marginTop: RFPercentage(0) }}>
        <View style={[styles.row, { marginBottom: RFPercentage(0.9) }]}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={RFPercentage(2.2)}
            color={COLORS.gray4}
            style={styles.icon}
          />
          <Text style={styles.label}>Comments:</Text>
        </View>
        <Text style={styles.comment}>{data.comments}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: RFPercentage(3),
    backgroundColor: COLORS.white,
    paddingTop: RFPercentage(8),
  },
  title: {
    fontSize: RFPercentage(2.5),
    fontFamily: "Bold",
    color: COLORS.gray3,
    marginLeft: RFPercentage(1),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: RFPercentage(3),
  },
  icon: {
    marginRight: RFPercentage(0.9),
  },
  label: {
    fontSize: RFPercentage(1.9),
    fontFamily: "SemiBold",
    color: COLORS.gray4,
  },
  value: {
    fontFamily: "Regular",
    color: COLORS.gray3,
    fontSize: RFPercentage(1.8),
  },
  comment: {
    fontSize: RFPercentage(1.8),
    color: COLORS.gray3,
    lineHeight: 22,
    fontFamily: "Regular",
  },
  statusIcon: {
    marginLeft: RFPercentage(1.5),
  },
});
