import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./types";
import { CheckInWheelScreen } from "../screens/CheckInWheelScreen";
import { YourOptionsScreen } from "../screens/YourOptionsScreen";
import { DailyChallengeScreen } from "../screens/DailyChallengeScreen";
import { CompleteReflectScreen } from "../screens/CompleteReflectScreen";
import { StreakScreen } from "../screens/StreakScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

// Wave 1 only. Wave 2 (Solo Reset, Community Feed, Onboarding, Login,
// Settings) is scoped in docs/screen-data-contract.md but not wired here yet.
export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CheckIn" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CheckIn" component={CheckInWheelScreen} />
        <Stack.Screen name="YourOptions" component={YourOptionsScreen} />
        <Stack.Screen name="DailyChallenge" component={DailyChallengeScreen} />
        <Stack.Screen name="CompleteReflect" component={CompleteReflectScreen} />
        <Stack.Screen name="Streak" component={StreakScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
