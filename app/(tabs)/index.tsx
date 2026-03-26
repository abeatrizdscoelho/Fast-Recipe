import { View, Text } from 'react-native';
import { BottomNav } from '@/frontend/src/components/BottomNav';
import { colors } from '@/frontend/src/theme/color';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#fff' }}>Home</Text>
      <BottomNav />
    </View>
  )
}