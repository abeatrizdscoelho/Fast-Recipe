import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RecipeForm } from './components/RecipeForm';
import { Header } from '../../components/Header';
import { BottomNav } from '../../components/BottomNav';
import { colors } from '../../theme/color';
import { useCreateRecipe } from '../../hooks/recipe/useRecipeCreate';

export default function CreateRecipeScreen() {
  const { loading, handleSubmit } = useCreateRecipe()

  return (
    <View style={styles.container}>
      <Header />
      <RecipeForm onSubmit={handleSubmit} submitLabel="Publicar Receita" loading={loading} />
      <BottomNav />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
})