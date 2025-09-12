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

  const Row = ({ icon, label, value }) => (
    <View style={styles.row}>
      <Ionicons
        name={icon}
        size={RFPercentage(2)}
        color={COLORS.gray4}
        style={styles.icon}
      />
      <Text style={styles.label}>
        {label}: <Text style={styles.value}>{value}</Text>
      </Text>
    </View>
  );

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
          label="Registration"
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
            size={22}
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
    fontSize: RFPercentage(1.8),
    fontFamily: "SemiBold",
    color: COLORS.gray4,
  },
  value: {
    fontFamily: "Regular",
    color: COLORS.gray3,
    fontSize: RFPercentage(1.7),
  },
  comment: {
    fontSize: RFPercentage(1.7),
    color: COLORS.gray3,
    lineHeight: 22,
    fontFamily: "Regular",
  },
});
