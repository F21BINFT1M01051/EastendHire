import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { RFPercentage } from "react-native-responsive-fontsize";
import * as ImagePicker from "expo-image-picker";
import { IMAGES } from "../theme/constants";
import Feather from "@expo/vector-icons/Feather";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { COLORS } from "../theme/constants";

const EditProfile = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(IMAGES.img);
  const [name, setName] = useState("Sana Asghar");

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "You need to allow access to your photos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri });
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Feather
              name="chevron-left"
              size={RFPercentage(3)}
              color={COLORS.black}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Edit Profile</Text>
        </View>

        {/* Profile Image */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={pickImage}
          style={styles.imageContainer}
        >
          <Image source={profileImage} style={styles.profileImage} />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={pickImage}
            style={styles.editIconContainer}
          >
            <Image
              source={IMAGES.edit}
              resizeMode="contain"
              style={styles.editIcon}
            />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Input Field */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Edit Your Name</Text>
          <InputField
            value={name}
            onChangeText={setName}
            placeholder=""
            icon={(hasValue) => (
              <FontAwesome5
                name="user-alt"
                size={RFPercentage(2)}
                color={hasValue ? COLORS.black : COLORS.gray}
              />
            )}
          />
        </View>

        {/* Button */}
        <View style={styles.buttonWrapper}>
          <PrimaryButton title="Edit" onPress={() => {}} />
        </View>
      </View>
    </LinearGradient>
  );
};

export default EditProfile;

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
  editIconContainer: {
    position: "absolute",
    bottom: RFPercentage(-1.5),
  },
  editIcon: {
    width: RFPercentage(4.3),
    height: RFPercentage(4.3),
  },
  inputWrapper: {
    width: "100%",
    marginTop: RFPercentage(5),
  },
  label: {
    color: COLORS.black,
    fontFamily: "SemiBold",
    fontSize: RFPercentage(1.8),
    marginBottom: RFPercentage(-0.7),
  },
  buttonWrapper: {
    width: "100%",
    marginTop: RFPercentage(5),
    alignItems: "center",
  },
});
