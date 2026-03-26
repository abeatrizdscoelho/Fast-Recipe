import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { fonts } from '../theme/typography';
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
    fontFamily: fonts.regular,
    marginTop: 4,
  },
  centered: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
})