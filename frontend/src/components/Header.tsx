import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const { logout } = useAuth();

  return (
    <View style={styles.header}>
      <Image
        source={require('../assets/images/logo2.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <TouchableOpacity onPress={logout}>
        <Ionicons name="log-out-outline" size={26} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 52,
    paddingBottom: 12,
  },
  logo: {
    width: 50,
    height: 32,
  },
})