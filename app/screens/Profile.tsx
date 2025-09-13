import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { RFPercentage } from "react-native-responsive-fontsize";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  signOut,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  doc,
  getDoc,
  deleteDoc,
  getDocs,
  query,
  collection,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { IMAGES, COLORS } from "../theme/constants";
import { showToast } from "../utils/toastMessage";
import { useFocusEffect } from "@react-navigation/native";
import { getCredentials, clearCredentials } from "../utils/storageHelper";
import { listenToUser } from "../utils/authState";
import { listenToUserData } from "../utils/userData";

const Profile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    let unsub;
    const setupListener = async () => {
      unsub = await listenToUserData(setUserData); // setUserData state will update in real-time
    };
    setupListener();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const handleAction = async () => {
    setActionLoading(true); // start loader
    try {
      if (actionType === "logout") {
        await AsyncStorage.removeItem("userCredentials");
        await signOut(auth);
        navigation.navigate("SignIn");
        showToast({
          type: "success",
          title: "Signed Out",
          message: "You have been signed out successfully.",
        });
      }

      if (actionType === "delete") {
        const user = auth.currentUser;
        if (!user) return;

        const creds = await getCredentials();
        if (!creds?.email || !creds?.password) return;

        const credential = EmailAuthProvider.credential(
          creds.email,
          creds.password
        );
        await reauthenticateWithCredential(user, credential);

        try {
          const userDocRef = doc(db, "Users", user.uid);
          await deleteDoc(userDocRef);

          const q = query(
            collection(db, "Users"),
            where("email", "==", user.email)
          );
          const snap = await getDocs(q);
          snap.forEach((d) => deleteDoc(d.ref));
        } catch (err) {
          console.log("Error deleting Firestore doc:", err);
        }

        await deleteUser(user);
        await clearCredentials();
        navigation.navigate("Onboarding");
        showToast({
          type: "success",
          title: "Account Deleted",
          message: "Your account has been deleted successfully.",
        });
      }

      setShowConfirm(false);
    } catch (e) {
      console.log("Action error", e);
    } finally {
      setActionLoading(false); // stop loader
    }
  };

  return (
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
        <Text style={styles.title}>Profile</Text>

        <View style={styles.imageContainer}>
          <Image
            source={userData?.image ? { uri: userData.image } : IMAGES.img}
            resizeMode="cover"
            style={userData?.image ? styles.profileImage : styles.default}
          />
        </View>

        <Text style={styles.name}>{userData?.name}</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("EditProfile")}
          activeOpacity={0.8}
          style={styles.editButton}
        >
          <FontAwesome5
            name="user-edit"
            size={RFPercentage(2)}
            color={COLORS.black}
          />
          <Text style={styles.editButtonText}>Edit Profile</Text>
          <Feather
            name="chevron-right"
            size={RFPercentage(2)}
            color={COLORS.gray3}
            style={{ position: "absolute", right: RFPercentage(2) }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setActionType("logout");
            setShowConfirm(true);
          }}
          activeOpacity={0.8}
          style={[styles.editButton, { marginTop: RFPercentage(2) }]}
        >
          <AntDesign name="logout" size={RFPercentage(2)} color={COLORS.red} />
          <Text style={[styles.editButtonText, { color: COLORS.red }]}>
            Log Out
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setActionType("delete");
            setShowConfirm(true);
          }}
          activeOpacity={0.8}
          style={[styles.editButton, { marginTop: RFPercentage(2) }]}
        >
          <MaterialIcons
            name="delete-sweep"
            size={RFPercentage(3)}
            color={COLORS.red}
          />
          <Text style={[styles.editButtonText, { color: COLORS.red }]}>
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {actionType === "logout" ? "Log Out" : "Delete Account"}
            </Text>
            <Text style={styles.modalMessage}>
              {actionType === "logout"
                ? "Are you sure you want to log out?"
                : "Are you sure you want to delete your account? This action cannot be undone."}
            </Text>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.modalButton,
                  { backgroundColor: "rgba(194, 194, 194, 1)" },
                ]}
                onPress={() => setShowConfirm(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.modalButton, { backgroundColor: COLORS.black }]}
                onPress={handleAction}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>
                    {actionType === "logout" ? "Log Out" : "Delete"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default Profile;

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    width: "90%",
    alignItems: "center",
    alignSelf: "center",
    marginTop: RFPercentage(7),
  },
  title: {
    textAlign: "center",
    fontFamily: "Bold",
    fontSize: RFPercentage(2.5),
    marginTop: RFPercentage(2),
  },
  imageContainer: {
    width: RFPercentage(16),
    height: RFPercentage(16),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFPercentage(100),
    borderWidth: RFPercentage(0.3),
    borderColor: COLORS.black,
    marginTop: RFPercentage(5),
  },
  profileImage: {
    width: RFPercentage(15.6),
    height: RFPercentage(15.6),
    borderRadius: RFPercentage(100),
  },
  default: {
    width: RFPercentage(21),
    height: RFPercentage(21),
    borderRadius: RFPercentage(100),
  },
  name: {
    textAlign: "center",
    fontFamily: "SemiBold",
    fontSize: RFPercentage(2),
    marginTop: RFPercentage(2),
    color: COLORS.black,
  },
  editButton: {
    width: "100%",
    height: RFPercentage(6.5),
    borderRadius: RFPercentage(1.2),
    paddingHorizontal: RFPercentage(2),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    marginTop: RFPercentage(5),
    borderWidth: 1,
    borderColor: COLORS.lightwhite,
  },
  editButtonText: {
    color: COLORS.gray3,
    fontFamily: "Medium",
    fontSize: RFPercentage(1.8),
    marginLeft: RFPercentage(1),
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
  modalBtnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: RFPercentage(1.3),
    borderRadius: 100,
    alignItems: "center",
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: RFPercentage(1.8),
    fontFamily: "Medium",
  },
});
