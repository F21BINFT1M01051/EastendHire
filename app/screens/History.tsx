import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import Feather from "@expo/vector-icons/Feather";
import moment from "moment";
import { COLORS, IMAGES } from "../theme/constants";
import {
  getDoc,
  doc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { listenToUserData } from "../utils/userData";
import { useExitAppOnBack } from "../utils/appBack";

export default function History({ navigation }) {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);
  useExitAppOnBack();

  useEffect(() => {
    let unsub;
    const setupListener = async () => {
      unsub = await listenToUserData(setUserData);
    };
    setupListener();
    return () => {
      if (unsub) unsub();
    };
  }, []);

  useEffect(() => {
    if (!userData?.userId) return;
    let unsubscribe;
    const loadData = async () => {
      setLoading(true);
      const userSnap = await getDoc(doc(db, "Users", userData.userId));
      const userCreatedAt =
        userSnap.data()?.createdAt?.toDate?.() ?? new Date();
      const expiryDate = moment(userCreatedAt).add(2, "months").endOf("day");

      const qOld = query(
        collection(db, "Inspections"),
        where("userId", "==", userData.userId)
      );
      const snapOld = await getDocs(qOld);
      snapOld.forEach((d) => {
        const created = d.data()?.createdAt?.toDate?.();
        if (
          created &&
          moment(created).isBefore(moment().subtract(2, "months"))
        ) {
          deleteDoc(doc(db, "Inspections", d.id));
        }
      });

      const q = query(
        collection(db, "Inspections"),
        where("userId", "==", userData.userId),
        orderBy("createdAt", "desc")
      );

      unsubscribe = onSnapshot(q, (snap) => {
        const keep = snap.docs.map((d) => {
          const data = d.data();
          const created = data?.createdAt?.toDate?.() ?? null;
          return {
            id: d.id,
            ...data,
            date: created
              ? moment(created).format("MMMM DD, YYYY")
              : "Pending date",
          };
        });
        setInspections(keep);
        setLoading(false);
      });
    };

    loadData();

    return () => unsubscribe && unsubscribe();
  }, [userData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600); // short delay for UI feedback
  }, []);

  // Add pass/fail counts
  const enhancedHistory = useMemo(() => {
    return inspections.map((item) => {
      const checks = ["brakes", "lights", "seatBelt", "handBrake"];
      const passed = checks.filter((c) => item[c] === "pass").length;
      const failed = checks.length - passed;

      return {
        ...item,
        passed,
        failed,
        status: failed >= 2 ? "fail" : "pass",
      };
    });
  }, [inspections]);

  // Group by month
  const groupedData = useMemo(() => {
    const groups = {};
    enhancedHistory.forEach((item) => {
      const month = moment(item.date, "MMMM DD, YYYY").format("MMMM YYYY");
      if (!groups[month]) groups[month] = [];
      groups[month].push(item);
    });

    return Object.entries(groups).map(([month, data]) => ({ month, data }));
  }, [enhancedHistory]);

  const StatusPill = ({ status }) => {
    const isPass = status === "pass";
    return (
      <View
        style={[
          styles.statusPill,
          { backgroundColor: isPass ? COLORS.successLight : COLORS.errorLight },
        ]}
      >
        <View
          style={[
            styles.statusDot,
            { backgroundColor: isPass ? COLORS.success : COLORS.error },
          ]}
        />
        <Text
          style={[
            styles.statusText,
            { color: isPass ? COLORS.success : COLORS.error },
          ]}
        >
          {isPass ? "PASSED" : "FAILED"}
        </Text>
      </View>
    );
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={() => navigation.navigate("DetailsScreen", { data: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.date}>{item.date}</Text>
        <StatusPill status={item.status} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{color:COLORS.gray4, fontFamily:"SemiBold", fontSize:RFPercentage(1.6)}}>Vehicle Reg:</Text>
        <Text style={styles.registration}> {item.registration}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: COLORS.success }]}>
            {item.passed}
          </Text>
          <Text style={styles.statLabel}>Passed</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: COLORS.error }]}>
            {item.failed}
          </Text>
          <Text style={styles.statLabel}>Failed</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: COLORS.dark }]}>
            {item.passed + item.failed}
          </Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.viewDetails}>View details</Text>
        <Feather
          name="chevron-right"
          size={RFPercentage(2)}
          color={COLORS.black}
        />
      </View>
    </TouchableOpacity>
  );

  const renderMonthSection = ({ item }) => (
    <View style={styles.monthSection}>
      <View style={styles.monthHeader}>
        <Text style={styles.monthLabel}>{item.month}</Text>
        <Text style={styles.monthCount}>
          {item.data.length}{" "}
          {item.data.length > 1 ? "Inspections" : "Inspection"}
        </Text>
      </View>
      <FlatList
        data={item.data}
        keyExtractor={(d) => d.id}
        renderItem={renderCard}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.cardSeparator} />}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: RFPercentage(8) }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.black]}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Inspection History</Text>
          <Text style={styles.subtitle}>Last 2 months</Text>
        </View>
        {loading ? (
          <ActivityIndicator
            color={COLORS.black}
            size={"large"}
            style={{ marginTop: RFPercentage(25) }}
          />
        ) : (
          <FlatList
            data={groupedData}
            renderItem={renderMonthSection}
            scrollEnabled={false}
            keyExtractor={(item) => item.month}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: RFPercentage(25),
                }}
              >
                <Image
                  source={IMAGES.noData}
                  resizeMode="contain"
                  style={{ width: RFPercentage(12), height: RFPercentage(12) }}
                />
                <Text
                  style={{
                    fontSize: RFPercentage(2),
                    color: COLORS.gray,
                    marginTop: RFPercentage(1),
                    fontFamily: "Regular",
                  }}
                >
                  No inspections found.
                </Text>
              </View>
            }
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    padding: RFPercentage(3),
    marginTop: RFPercentage(4),
  },
  title: {
    fontSize: RFPercentage(2.5),
    fontFamily: "Bold",
    color: COLORS.dark,
    marginBottom: RFPercentage(0.5),
  },
  subtitle: {
    fontSize: RFPercentage(1.9),
    fontFamily: "Medium",
    color: COLORS.gray,
  },
  listContent: {
    paddingHorizontal: RFPercentage(2),
    paddingBottom: RFPercentage(4),
  },
  monthSection: {
    marginBottom: RFPercentage(3),
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: RFPercentage(2),
    paddingHorizontal: RFPercentage(1),
  },
  monthLabel: {
    fontSize: RFPercentage(1.8),
    fontFamily: "SemiBold",
    color: COLORS.dark,
    backgroundColor: "rgba(238, 238, 238, 1)",
    paddingHorizontal: RFPercentage(1.8),
    paddingVertical: RFPercentage(1),
    borderRadius: RFPercentage(100),
  },
  monthCount: {
    fontSize: RFPercentage(1.6),
    fontFamily: "Medium",
    color: COLORS.gray,
  },
  card: {
    backgroundColor: COLORS.white,
    padding: RFPercentage(2.5),
    borderRadius: RFPercentage(1.5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardSeparator: { height: RFPercentage(1.5) },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: RFPercentage(1),
  },
  date: {
    fontSize: RFPercentage(1.8),
    fontFamily: "SemiBold",
    color: COLORS.dark,
    flex: 1,
    paddingRight: RFPercentage(1),
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: RFPercentage(1.2),
    paddingVertical: RFPercentage(0.6),
    borderRadius: RFPercentage(1),
  },
  statusDot: {
    width: RFPercentage(1),
    height: RFPercentage(1),
    borderRadius: RFPercentage(0.5),
    marginRight: RFPercentage(0.5),
  },
  statusText: {
    fontSize: RFPercentage(1.4),
    fontFamily: "SemiBold",
  },
  registration: {
    fontSize: RFPercentage(1.5),
    color: COLORS.gray,
    fontFamily: "Regular",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: RFPercentage(1.5),
    paddingVertical: RFPercentage(1.5),
    backgroundColor: COLORS.lightBlue,
    borderRadius: RFPercentage(1),
  },
  statItem: { alignItems: "center", flex: 1 },
  statNumber: {
    fontSize: RFPercentage(2.5),
    fontFamily: "Bold",
    marginBottom: RFPercentage(0.5),
  },
  statLabel: {
    fontSize: RFPercentage(1.4),
    fontFamily: "Medium",
    color: COLORS.gray,
  },
  statDivider: {
    width: 1,
    height: RFPercentage(3),
    backgroundColor: COLORS.lightGray,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: RFPercentage(2),
    paddingTop: RFPercentage(1.5),
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  viewDetails: {
    fontSize: RFPercentage(1.6),
    fontFamily: "SemiBold",
    color: COLORS.black,
  },
});
