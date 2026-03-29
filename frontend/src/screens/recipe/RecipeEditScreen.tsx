import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { RecipeForm } from './components/RecipeForm';
import { Header } from '../../components/Header';
import { BottomNav } from '../../components/BottomNav';
import { colors } from '../../theme/color';
import { useEditRecipe } from '../../hooks/recipe/useRecipeEdit';

export default function EditRecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { initialData, loading, fetching, handleSubmit } = useEditRecipe(id)

  if (fetching) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.white} />
          <Text style={styles.loadingText}>Carregando receita...</Text>
        </View>
        <BottomNav />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header />
      <RecipeForm
        initialData={initialData ?? {}}
        onSubmit={handleSubmit}
        submitLabel="Salvar Alterações"
        loading={loading}
      />
      <BottomNav />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: colors.white, fontSize: 14 },
})