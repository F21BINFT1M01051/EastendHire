// storageHelpers.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveCredentials = async (email, password) => {
  try {
    const jsonValue = JSON.stringify({ email, password });
    await AsyncStorage.setItem("userCredentials", jsonValue);
    console.log("Credentials saved");
  } catch (e) {
    console.log("Saving error:", e);
  }
};

export const getCredentials = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("userCredentials");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log("Reading error:", e);
  }
};

export const clearCredentials = async () => {
  try {
    await AsyncStorage.removeItem("userCredentials");
    console.log("Credentials cleared");
  } catch (e) {
    console.log("Clearing error:", e);
  }
};
