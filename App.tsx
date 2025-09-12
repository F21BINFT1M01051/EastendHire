import { ActivityIndicator, View } from "react-native";
import MainNavigator from "./app/navigation/StackNavigator";
import { useFonts } from "expo-font";

export default function App() {
  const [fontsLoaded] = useFonts({
    Headline: require("./app/theme/fonts/Caprasimo-Regular.ttf"),
    Regular: require("./app/theme/fonts/Poppins-Regular.ttf"),
    Medium: require("./app/theme/fonts/Poppins-Medium.ttf"),
    SemiBold: require("./app/theme/fonts/Poppins-SemiBold.ttf"),
    Bold: require("./app/theme/fonts/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View>
        <ActivityIndicator size={"large"} color={"black"} />
      </View>
    );
  }

  return <MainNavigator />;
}
