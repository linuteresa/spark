import { Tabs } from 'expo-router';
import { Image, StyleSheet, type ColorValue, type ImageSourcePropType } from 'react-native';

const ICONS: Record<string, ImageSourcePropType> = {
  'check-in': require('@/assets/images/nav/check-in.png'),
  recharge: require('@/assets/images/nav/recharge.png'),
  index: require('@/assets/images/nav/home.png'),
  'social-hub': require('@/assets/images/nav/social-hub.png'),
  profile: require('@/assets/images/nav/profile.png'),
};

function TabIcon({ route, color }: { route: string; color: ColorValue }) {
  return <Image source={ICONS[route]} style={[styles.icon, { tintColor: color }]} resizeMode="contain" />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#5B8DEF',
        tabBarInactiveTintColor: '#9AA3B2',
        tabBarStyle: { backgroundColor: '#FFFFFF' },
      }}>
      <Tabs.Screen
        name="check-in"
        options={{ title: 'Check-in', tabBarIcon: ({ color }) => <TabIcon route="check-in" color={color} /> }}
      />
      <Tabs.Screen
        name="recharge"
        options={{ title: 'Recharge', tabBarIcon: ({ color }) => <TabIcon route="recharge" color={color} /> }}
      />
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: ({ color }) => <TabIcon route="index" color={color} /> }}
      />
      <Tabs.Screen
        name="social-hub"
        options={{ title: 'Social Hub', tabBarIcon: ({ color }) => <TabIcon route="social-hub" color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ color }) => <TabIcon route="profile" color={color} /> }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});
