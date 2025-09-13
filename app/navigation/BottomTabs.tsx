import React, { useEffect, useState } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { CurvedBottomBarExpo } from "react-native-curved-bottom-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import History from "../screens/History";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import { RFPercentage } from "react-native-responsive-fontsize";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { COLORS } from "../theme/constants";

export default function BottomTabs() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const _renderIcon = (routeName, selectedTab) => {
    let icon = "";

    switch (routeName) {
      case "history":
        icon = "timer-settings";
        break;
      case "profile":
        icon = "user";
        break;
      default:
        icon = "ellipse-outline";
    }

    return routeName === "profile" ? (
      <FontAwesome
        name={icon}
        size={RFPercentage(3.3)}
        color={routeName === selectedTab ? COLORS.black : COLORS.gray}
      />
    ) : (
      <MaterialCommunityIcons
        name={icon}
        size={RFPercentage(3.3)}
        color={routeName === selectedTab ? COLORS.black : COLORS.gray}
      />
    );
  };

  const renderTabBar = ({ routeName, selectedTab, navigate }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigate(routeName)}
      style={styles.tabbarItem}
    >
      {_renderIcon(routeName, selectedTab)}
    </TouchableOpacity>
  );

  return (
    <CurvedBottomBarExpo.Navigator
      type="DOWN"
      style={[
        styles.bottomBar,
        keyboardVisible && { display: "none" }, 
      ]}
      shadowStyle={styles.shadow}
      height={Platform.OS === "ios" ? RFPercentage(8) : RFPercentage(9)}
      circleWidth={50}
      bgColor={COLORS.tab}
      initialRouteName="home"
      borderWidth={2}
      borderColor={"rgba(230, 230, 230, 1)"}
      borderTopLeftRight
      screenOptions={{ headerShown: false }}
      renderCircle={({ selectedTab, navigate }) => (
        <Animated.View
          style={[
            styles.btnCircleUp,
            { bottom: Platform.OS === "ios" ? 30 : 20 },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.button}
            onPress={() => navigate("home")}
          >
            <Ionicons
              name="home"
              size={RFPercentage(3.2)}
              color={selectedTab === "home" ? "black" : "gray"}
            />
          </TouchableOpacity>
        </Animated.View>
      )}
      tabBar={renderTabBar}
    >
      <CurvedBottomBarExpo.Screen
        name="history"
        position="LEFT"
        component={History}
      />
      <CurvedBottomBarExpo.Screen
        name="profile"
        position="RIGHT"
        component={Profile}
      />
      <CurvedBottomBarExpo.Screen
        name="home"
        position="CENTER"
        component={Home}
      />
    </CurvedBottomBarExpo.Navigator>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#DDDDDD",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomBar: {},
  btnCircleUp: {
    width: RFPercentage(7),
    height: RFPercentage(7),
    borderRadius: RFPercentage(100),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.tab,
    bottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1,
  },
  tabbarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
