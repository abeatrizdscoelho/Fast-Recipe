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
      <Tabs.Screen name="create-recipe" />
      <Tabs.Screen name="edit-recipe" />
      <Tabs.Screen name="recipe-detail" />
      <Tabs.Screen name="edit-profile" options={{ href: null }} />
    </Tabs>
  )
}