import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RecipeForm } from './components/RecipeForm';
import { Header } from '../../components/Header';
import { BottomNav } from '../../components/BottomNav';
import { useCreateRecipe } from '../../hooks/recipe/useRecipeCreate';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/src/context/ThemeContext';

export default function CreateRecipeScreen() {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { loading, handleSubmit } = useCreateRecipe()

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header />
      <RecipeForm
        onSubmit={handleSubmit}
        submitLabel={loading ? t('recipeForm.submittingBtn') : t('recipeForm.submitBtn')}
        loading={loading}
      />
      <BottomNav />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#7A0000' },
})