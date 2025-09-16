import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { RFPercentage } from "react-native-responsive-fontsize";
import * as ImagePicker from "expo-image-picker";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import axios from "axios";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase"; // adjust to your path
import { COLORS, IMAGES } from "../theme/constants";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { showToast } from "../utils/toastMessage";
import { listenToUserData } from "../utils/userData";

const CLOUD_NAME = "do0rk5mrh";
const UPLOAD_PRESET = "EastendHire";

export default function EditProfile({ navigation }) {
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(null); // fallback
  const [existingImage, setExistingImage] = useState(null); // current image from Firestore
  const [name, setName] = useState("");
  const [pickedNewImage, setPickedNewImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    let unsubscribe;

    const setupListener = async () => {
      unsubscribe = await listenToUserData((data) => {
        if (data) {
          setUserData(data);
          setName(data.name || "");
          if (data.image) setProfileImage({ uri: data.image });
        } else {
          setUserData(null);
          setName("");
          setProfileImage(null);
        }
        setLoading(false);
      });
    };

    setupListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "Allow access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage({ uri });
      setPickedNewImage(true);
    }
  };

  // ---------- Upload to Cloudinary ----------
  const uploadImageToCloudinary = async (uri) => {
    try {
      const formData = new FormData();
      formData.append("file", { uri, type: "image/jpeg", name: "profile.jpg" });
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return res.data.secure_url;
    } catch (err) {
      return null;
    }
  };

  // ---------- Save Profile ----------
  const handleSaveProfile = async () => {
    if (!userData?.id) {
      Alert.alert("Error", "User data not loaded yet.");
      return;
    }

    try {
      setUploading(true);

      let imageUrl = profileImage?.uri || "";

      if (pickedNewImage && profileImage?.uri) {
        const uploaded = await uploadImageToCloudinary(profileImage.uri);
        if (uploaded) imageUrl = uploaded;
      }

      const userRef = doc(db, "Users", userData.id); // use user ID from Firestore
      await updateDoc(userRef, {
        name,
        image: imageUrl,
        updatedAt: new Date(),
      });

      setPickedNewImage(false);
      setUploading(false);
      showToast({
        type: "success",
        title: "Profile Update",
        message: "Profile updated successfully!",
      });
      // navigation.goBack();
    } catch (error) {
      setUploading(false);
      showToast({
        type: "error",
        title: "Profile Update",
        message: "Failed to update profile.",
      });
      console.log("EditProfile error:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            {loading ? (
              <ActivityIndicator size={"small"} color={COLORS.black} />
            ) : (
              <>
                <Image
                  source={profileImage ? profileImage : IMAGES.img}
                  style={profileImage ? styles.profileImage : styles.default}
                />

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
              </>
            )}
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
            <PrimaryButton
              title={uploading ? "Saving..." : "Save"}
              onPress={handleSaveProfile}
              loader={uploading}
            />
          </View>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
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
  backButton: { position: "absolute", left: 0 },
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
  default: {
    width: RFPercentage(21),
    height: RFPercentage(21),
    borderRadius: RFPercentage(100),
  },
  loader: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  editIconContainer: {
    position: "absolute",
    bottom: RFPercentage(-1.4),
    zIndex: 999,
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
