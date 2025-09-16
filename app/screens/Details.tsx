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

  const inspectionResults = [
    data.brakes,
    data.lights,
    data.seatBelt,
    data.handBrake,
  ];

  // Filter only pass/fail for summary
  const validResults = inspectionResults.filter(
    (item) => item?.toLowerCase() === "pass" || item?.toLowerCase() === "fail"
  );

  const totalChecks = validResults.length;
  const passedCount = validResults.filter((item) => item.toLowerCase() === "pass")
    .length;
  const failedCount = validResults.filter((item) => item.toLowerCase() === "fail")
    .length;
  const notInspectedCount = inspectionResults.length - validResults.length;

  // Badge component for pass/fail/unknown
  const StatusBadge = ({ status }) => {
    const lowerStatus = status?.toLowerCase();
    const isPass = lowerStatus === "pass";
    const isFail = lowerStatus === "fail";
    const isUnknown = !status || (!isPass && !isFail);

    const bgColor = isPass
      ? COLORS.successLight
      : isFail
      ? COLORS.errorLight
      : COLORS.grayLight; // gray for unknown

    const iconName = isPass
      ? "checkmark-circle"
      : isFail
      ? "close-circle"
      : "help-circle"; // help icon for unknown

    const iconColor = isPass
      ? COLORS.success
      : isFail
      ? COLORS.error
      : COLORS.gray4;

    return (
      <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
        <Ionicons name={iconName} size={RFPercentage(2)} color={iconColor} />
        <Text style={[styles.statusText, { color: iconColor }]}>
          {isUnknown ? "Not Inspected" : status}
        </Text>
      </View>
    );
  };

  const DetailCard = ({ title, items }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.cardContent}>{items}</View>
    </View>
  );

  const DetailRow = ({ icon, label, value, showStatus = false }) => (
    <View style={styles.detailRow}>
      <View style={styles.rowLeft}>
        <Ionicons
          name={icon}
          size={RFPercentage(2.2)}
          color={COLORS.black}
          style={styles.rowIcon}
        />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>

      <View style={styles.rowRight}>
        {showStatus ? (
          <StatusBadge status={value} />
        ) : (
          <Text style={styles.rowValue} numberOfLines={1}>
            {value?.length > 20 ? value.substring(0, 20) + "..." : value}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: RFPercentage(10) }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Feather
              name="chevron-left"
              size={RFPercentage(3.5)}
              color={COLORS.dark}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Inspection Details</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Vehicle Info Card */}
        <DetailCard
          title="Vehicle Information"
          items={
            <>
              <DetailRow
                icon="calendar-outline"
                label="Inspection Date"
                value={data.date}
              />
              <View style={styles.divider} />
              <DetailRow
                icon="car-outline"
                label="Registration No"
                value={data.registration}
              />
            </>
          }
        />

        {/* Inspection Results Card */}
        <DetailCard
          title="Inspection Results"
          items={
            <>
              <DetailRow
                icon="speedometer-outline"
                label="Brakes"
                value={data.brakes}
                showStatus={true}
              />
              <View style={styles.divider} />
              <DetailRow
                icon="bulb-outline"
                label="Lights"
                value={data.lights}
                showStatus={true}
              />
              <View style={styles.divider} />
              <DetailRow
                icon="lock-closed-outline"
                label="Seat Belt"
                value={data.seatBelt}
                showStatus={true}
              />
              <View style={styles.divider} />
              <DetailRow
                icon="hand-left-outline"
                label="Hand Brake"
                value={data.handBrake}
                showStatus={true}
              />
            </>
          }
        />

        {/* Comments Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Inspector Comments</Text>
          <View style={styles.commentCard}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={RFPercentage(2.5)}
              color={COLORS.black}
              style={styles.commentIcon}
            />
            <Text style={styles.commentText}>
              {data.comments || "No comments provided"}
            </Text>
          </View>
        </View>

        {/* Summary Card */}
        <View style={[styles.card, styles.summaryCard]}>
          <Text style={styles.summaryTitle}>Inspection Summary</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{inspectionResults.length}</Text>
              <Text style={styles.summaryLabel}>Checks</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: COLORS.success }]}>
                {passedCount}
              </Text>
              <Text style={styles.summaryLabel}>Passed</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: COLORS.error }]}>
                {failedCount}
              </Text>
              <Text style={styles.summaryLabel}>Failed</Text>
            </View>
            {notInspectedCount > 0 && (
              <>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryNumber, { color: COLORS.gray4 }]}>
                    {notInspectedCount}
                  </Text>
                  <Text style={styles.summaryLabel}>Not Inspected</Text>
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Styles (unchanged)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollView: { flex: 1, padding: RFPercentage(2) },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: RFPercentage(6),
    marginBottom: RFPercentage(2),
  },
  backButton: { padding: RFPercentage(1) },
  headerTitle: { fontSize: RFPercentage(2.4), fontFamily: "Bold", color: COLORS.dark },
  headerRight: { width: RFPercentage(5) },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RFPercentage(1.5),
    padding: RFPercentage(2.5),
    marginBottom: RFPercentage(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: { fontSize: RFPercentage(2), fontFamily: "Bold", color: COLORS.dark, marginBottom: RFPercentage(2) },
  cardContent: { paddingHorizontal: RFPercentage(0.5) },
  detailRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: RFPercentage(1.5) },
  rowLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  rowRight: { marginLeft: RFPercentage(1) },
  rowIcon: { marginRight: RFPercentage(1.5) },
  rowLabel: { fontSize: RFPercentage(1.9), fontFamily: "SemiBold", color: COLORS.gray4 },
  rowValue: { fontSize: RFPercentage(1.8), fontFamily: "Medium", color: COLORS.dark },
  divider: { height: 1, backgroundColor: COLORS.lightGray, marginVertical: RFPercentage(0.5) },
  statusBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: RFPercentage(1.2), paddingVertical: RFPercentage(0.6), borderRadius: RFPercentage(1) },
  statusText: { fontSize: RFPercentage(1.6), fontFamily: "SemiBold", marginLeft: RFPercentage(0.5) },
  commentCard: { flexDirection: "row", backgroundColor: COLORS.lightBlue, borderRadius: RFPercentage(1), padding: RFPercentage(2) },
  commentIcon: { marginRight: RFPercentage(1.5), marginTop: RFPercentage(0.3) },
  commentText: { flex: 1, fontSize: RFPercentage(1.8), color: COLORS.gray3, lineHeight: RFPercentage(2.5), fontFamily: "Regular" },
  summaryCard: { alignItems: "center" },
  summaryTitle: { fontSize: RFPercentage(2), fontFamily: "Bold", color: COLORS.dark, marginBottom: RFPercentage(2), textAlign: "center" },
  summaryRow: { flexDirection: "row", justifyContent: "space-around", width: "100%" },
  summaryItem: { alignItems: "center" },
  summaryNumber: { fontSize: RFPercentage(3.5), fontFamily: "Bold", color: COLORS.black, marginBottom: RFPercentage(0.5) },
  summaryLabel: { fontSize: RFPercentage(1.6), fontFamily: "Medium", color: COLORS.gray4 },
  summaryDivider: { width: 1, backgroundColor: COLORS.lightGray },
});
