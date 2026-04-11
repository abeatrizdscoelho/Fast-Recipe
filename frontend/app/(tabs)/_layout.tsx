import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="profile-edit" />
      <Tabs.Screen name="recipe-create" />
      <Tabs.Screen name="recipe-edit" />
      <Tabs.Screen name="recipe-detail" />
    </Tabs>
  )
}