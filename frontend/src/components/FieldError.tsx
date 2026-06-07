import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors } from '../theme/color';

export default function FieldError({ message, centered = false }: { message?: string; centered?: boolean }) {
  if (!message) return null
  return (
    <Text style={[styles.error, centered && styles.centered]}>{message}</Text>
  )
}

const styles = StyleSheet.create({
  error: {
    color: colors.error,
    fontSize: 12,
    fontWeight: 400,
    marginTop: 4,
  },
  centered: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
})