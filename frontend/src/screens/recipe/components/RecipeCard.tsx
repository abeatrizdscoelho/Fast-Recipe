import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '@/frontend/src/theme/color';

type Props = {
  id: string
  title: string
  time: string
  difficulty?: string | null
  description?: string | null
  photos?: string | null
  favorite: boolean
  author?: {
    name: string
    avatarUrl?: string | null
    createdAt?: string
  }
  isOwner?: boolean
  onFavorite?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function RecipeCard({
  id, title, time, difficulty, description, photos,
  favorite, author, isOwner, onFavorite, onEdit, onDelete,
}: Props) {

  const authorInitials = author?.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()

  function formatDate(dateStr?: string) {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    })
  }

  return (
    <View style={styles.wrapper}>
      {author && (
        <View style={styles.authorRow}>
          {author.avatarUrl ? (
            <Image source={{ uri: author.avatarUrl }} style={styles.authorAvatar} />
          ) : (
            <View style={styles.authorAvatar}>
              <Text style={styles.authorInitials}>{authorInitials}</Text>
            </View>
          )}
          <View>
            <Text style={styles.authorName}>
              <Text style={styles.authorNameBold}>{author.name}</Text>
              {' '}publicou uma receita
            </Text>
            {author.createdAt && (
              <Text style={styles.authorDate}>{formatDate(author.createdAt)}</Text>
            )}
          </View>
        </View>
      )}

      <View style={styles.recipeCard}>
        {photos ? (
          <Image source={{ uri: photos }} style={styles.recipeImage} />
        ) : (
          <View style={[styles.recipeImage, styles.recipeImagePlaceholder]}>
            <Ionicons name="image-outline" size={32} color="rgba(0,0,0,0.2)" />
          </View>
        )}

        <View style={styles.recipeInfo}>

          <View style={styles.recipeTitleRow}>
            <Text style={[styles.recipeTitle, { flex: 1 }]} numberOfLines={2}>
              {title}
            </Text>
            {isOwner && (
              <View style={styles.recipeOwnerActions}>
                <TouchableOpacity onPress={() => onEdit?.(id)}>
                  <Ionicons name="pencil-outline" size={15} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete?.(id)}>
                  <Ionicons name="trash-outline" size={15} color="#e05c5c" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.recipeMeta}>
            <Ionicons name="time-outline" size={13} color={colors.primary} />
            <Text style={styles.recipeMetaText}>{time}min</Text>
            {difficulty && (
              <>
                <Text style={styles.recipeDot}>|</Text>
                <Text style={styles.recipeMetaText}>{difficulty}</Text>
              </>
            )}
          </View>

          <TouchableOpacity
            style={styles.favoriteRow}
            onPress={() => onFavorite?.(id)}
          >
            <Ionicons
              name={favorite ? 'heart' : 'heart-outline'}
              size={14}
              color={favorite ? '#e05c5c' : colors.primary}
            />
            <Text style={[styles.favoriteText, favorite && { color: '#e05c5c' }]}>
              {favorite ? 'Favoritado' : 'Favoritar'}
            </Text>
          </TouchableOpacity>

          {description && (
            <Text style={styles.recipeDescription} numberOfLines={2}>
              {description}
            </Text>
          )}

          <TouchableOpacity
            style={styles.seeMoreBtn}
            onPress={() => router.push({ pathname: '/(tabs)/recipe-detail', params: { id } })}
          >
            <Text style={styles.seeMoreText}>Ver mais</Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },

  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorInitials: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  authorName: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
  },
  authorNameBold: {
    fontWeight: 'bold',
    color: colors.white,
  },
  authorDate: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 1,
  },

  recipeCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  recipeImage: {
    width: 120,
    height: '100%',
    minHeight: 110,
  },
  recipeImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  recipeInfo: {
    flex: 1,
    padding: 12,
    gap: 4,
  },
  recipeTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  recipeTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary,
    lineHeight: 18,
  },
  recipeOwnerActions: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 2,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recipeMetaText: {
    fontSize: 11,
    color: colors.primary,
  },
  recipeDot: {
    color: '#ccc',
    fontSize: 11,
  },
  favoriteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  favoriteText: {
    fontSize: 11,
    color: colors.primary,
  },
  recipeDescription: {
    fontSize: 11,
    color: '#888',
    lineHeight: 16,
  },
  seeMoreBtn: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderRadius: 50,
    marginTop: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  seeMoreText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
})