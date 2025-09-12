import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Onboarding from "../screens/OnBoarding";
import SignUp from "../screens/SignUp";
import SignIn from "../screens/Login";
import BottomTabs from "./BottomTabs";
import DetailsScreen from "../screens/Details";
import EditProfile from "../screens/EditProfile";
import ForgetPassword from "../screens/ForgetPassword";

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
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
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
