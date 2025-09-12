import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { RFPercentage } from "react-native-responsive-fontsize";
import { IMAGES } from "../theme/constants";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../theme/constants";

const Profile = () => {
  const navigation = useNavigation();
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
            source={IMAGES.img}
            resizeMode="cover"
            style={styles.profileImage}
          />
        </View>

        <Text style={styles.name}>Sophia Elizabeth</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("EditProfile")}
          activeOpacity={0.8}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Feather
              name="chevron-right"
              size={RFPercentage(2)}
              color={COLORS.gray3}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default Profile;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    width: "90%",
    alignItems: "center",
    alignSelf: "center",
    marginTop: RFPercentage(7),
  },
  title: {
    textAlign: "center",
    fontFamily: "Bold",
    fontSize: RFPercentage(2.2),
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
    borderColor: COLORS.lightwhite,
    borderRadius: RFPercentage(1.2),
    paddingHorizontal: RFPercentage(2),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginTop: RFPercentage(5),
  },
  editButtonText: {
    color: COLORS.gray3,
    fontFamily: "Medium",
    fontSize: RFPercentage(1.8),
  },
});
