import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";

import Onboarding from "../screens/OnBoarding";
import SignUp from "../screens/SignUp";
import SignIn from "../screens/Login";
import BottomTabs from "./BottomTabs";
import DetailsScreen from "../screens/Details";
import EditProfile from "../screens/EditProfile";
import ForgetPassword from "../screens/ForgetPassword";
import { getCredentials } from "../utils/storageHelper";
import { COLORS } from "../theme/constants";
import { RFPercentage } from "react-native-responsive-fontsize";

export type RootStackParamList = {
  Onboarding: undefined;
  SignUp: undefined;
  SignIn: undefined;
  BottomTabs: undefined;
  DetailsScreen: undefined;
  EditProfile: undefined;
  ForgetPassword: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainNavigator() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const creds = await getCredentials();
        if (creds) {
          setInitialRoute("BottomTabs");
        } else {
          setInitialRoute("Onboarding");
        }
      } catch (e) {
        console.log("Error loading credentials:", e);
        setInitialRoute("Onboarding");
      }
    };
    loadUser();
  }, []);

  if (!initialRoute) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: RFPercentage(15),
        }}
      >
        <ActivityIndicator size="large" color={COLORS.black} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="BottomTabs" component={BottomTabs} />
        <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
