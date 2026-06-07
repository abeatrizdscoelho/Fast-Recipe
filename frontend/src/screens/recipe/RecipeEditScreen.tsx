import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { RecipeForm } from './components/RecipeForm';
import { Header } from '../../components/Header';
import { BottomNav } from '../../components/BottomNav';
import { useEditRecipe } from '../../hooks/recipe/useRecipeEdit';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/src/context/ThemeContext';

export default function EditRecipeScreen() {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { initialData, loading, fetching, handleSubmit } = useEditRecipe(id)

  if (fetching) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.white} />
          <Text style={styles.loadingText}>{t('recipeForm.loadingRecipe')}</Text>
        </View>
        <BottomNav />
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header />
      <RecipeForm
        initialData={initialData ?? {}}
        onSubmit={handleSubmit}
        submitLabel={loading ? t('recipeForm.savingBtn') : t('recipeForm.saveBtn')}
        loading={loading}
      />
      <BottomNav />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#7A0000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: '#FFFFFF', fontSize: 14 },
})