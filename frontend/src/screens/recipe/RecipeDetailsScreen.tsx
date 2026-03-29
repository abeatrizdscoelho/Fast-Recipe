import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { ActivityIndicator, Dimensions, Image, ScrollView,
    StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BottomNav } from '../../components/BottomNav'
import { colors } from '../../theme/color'
import { useRecipeDetail } from '../../hooks/recipe/useRecipeDetail'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const MOCK_REVIEWS = [
    { name: 'Usuário', time: '1 semana atrás', text: 'Receita deliciosa, ficou muito saborosa. Adorei!', likes: 12 },
    { name: 'Usuário', time: '5 dias atrás', text: 'Ótima receita, fiz aqui em casa e ficou maravilhosa!', likes: 6 },
]

export default function RecipeDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const insets = useSafeAreaInsets()
    const { 
        recipe, loading, activePhoto, setActivePhoto, toggleFavorite, photos, authorInitials 
    } = useRecipeDetail(id)

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.white} />
            </View>
        )
    }

    if (!recipe) return null

    return (
        <View style={styles.container}>

            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
                    <Ionicons name="arrow-back-outline" size={24} color={colors.white} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerBtn}>
                    <Ionicons name="share-outline" size={22} color={colors.white} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {photos.length > 0 ? (
                    <View style={styles.galleryContainer}>
                        <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onMomentumScrollEnd={e => {
                                const index = Math.round(
                                    e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width
                                )
                                setActivePhoto(index)
                            }}
                        >
                            {photos.map((uri, index) => (
                                <Image key={index} source={{ uri }} style={styles.mainPhoto} />
                            ))}
                        </ScrollView>

                        {photos.length > 1 && (
                            <View style={styles.dotsRow}>
                                {photos.map((_, index) => (
                                    <View key={index} style={[styles.dot, activePhoto === index && styles.dotActive]} />
                                ))}
                            </View>
                        )}

                        {photos.length > 1 && (
                            <View style={styles.photoCounter}>
                                <Text style={styles.photoCounterText}>{activePhoto + 1}/{photos.length}</Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <View style={styles.photoPlaceholder}>
                        <Ionicons name="image-outline" size={56} color="rgba(255,255,255,0.25)" />
                        <Text style={styles.photoPlaceholderText}>Sem foto</Text>
                    </View>
                )}

                <View style={styles.card}>

                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{recipe.title}</Text>
                        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteBtn}>
                            <Ionicons
                                name={recipe.favorite ? 'heart' : 'heart-outline'}
                                size={22}
                                color={recipe.favorite ? '#e05c5c' : colors.primary}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.authorRow}>
                        {recipe.author?.avatarUrl ? (
                            <Image source={{ uri: recipe.author.avatarUrl }} style={styles.authorAvatar} />
                        ) : (
                            <View style={styles.authorAvatar}>
                                <Text style={styles.authorInitials}>{authorInitials}</Text>
                            </View>
                        )}
                        <View>
                            <Text style={styles.authorName}>{recipe.author?.name ?? 'Autor desconhecido'}</Text>
                            <Text style={styles.authorDate}>
                                {new Date(recipe.createdAt).toLocaleDateString('pt-BR', {
                                    day: '2-digit', month: 'long', year: 'numeric',
                                })}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.metaRow}>
                        <View style={styles.metaChip}>
                            <Ionicons name="time-outline" size={13} color={colors.primary} />
                            <Text style={styles.metaChipText}>{recipe.time}min</Text>
                        </View>
                        {recipe.difficulty && (
                            <View style={styles.metaChip}>
                                <Ionicons name="flame-outline" size={13} color={colors.primary} />
                                <Text style={styles.metaChipText}>{recipe.difficulty}</Text>
                            </View>
                        )}
                        <View style={styles.metaChip}>
                            <Ionicons name="pricetag-outline" size={13} color={colors.primary} />
                            <Text style={styles.metaChipText}>{recipe.category}</Text>
                        </View>
                        <View style={styles.metaChip}>
                            <Ionicons name="people-outline" size={13} color={colors.primary} />
                            <Text style={styles.metaChipText}>
                                {recipe.portions} {Number(recipe.portions) === 1 ? 'porção' : 'porções'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {recipe.description && (
                        <>
                            <Text style={styles.sectionTitle}>Sobre a receita</Text>
                            <Text style={styles.descriptionText}>{recipe.description}</Text>
                            <View style={styles.divider} />
                        </>
                    )}

                    <Text style={styles.sectionTitle}>Ingredientes</Text>
                    {recipe.ingredients.map((ingredient, index) => (
                        <View key={index} style={styles.ingredientRow}>
                            <View style={styles.ingredientBullet} />
                            <Text style={styles.ingredientText}>{ingredient}</Text>
                        </View>
                    ))}

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Modo de Preparo</Text>
                    {recipe.preparation.split('\n').filter(s => s.trim()).map((step, index) => (
                        <View key={index} style={styles.stepRow}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>{index + 1}</Text>
                            </View>
                            <Text style={styles.stepText}>{step.trim()}</Text>
                        </View>
                    ))}

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Avaliações</Text>

                    <View style={styles.ratingBox}>
                        <View style={styles.ratingBoxHeader}>
                            <View style={styles.ratingBoxAvatar}>
                                <Ionicons name="person-outline" size={20} color={colors.primary} />
                            </View>
                            <View style={styles.ratingBoxContent}>
                                <Text style={styles.ratingBoxPrompt}>Gostou da receita?</Text>
                                <Text style={styles.ratingBoxSub}>Avalie ou deixe seu comentário.</Text>
                                <View style={styles.starsRow}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Ionicons key={star} name="star-outline" size={16} color="#DDBC9B" />
                                    ))}
                                </View>
                            </View>
                        </View>
                        <View style={styles.commentRow}>
                            <Text style={styles.commentPlaceholder}>Escreva um comentário...</Text>
                            <TouchableOpacity>
                                <Ionicons name="send" size={18} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.ratingAverage}>
                        <Text style={styles.ratingAverageNumber}>4.8</Text>
                        <View style={{ gap: 2 }}>
                            <View style={styles.starsRow}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Ionicons key={star} name="star" size={20} color="#F5C518" />
                                ))}
                            </View>
                            <Text style={styles.ratingAverageCount}>45 avaliações</Text>
                        </View>
                    </View>

                    {MOCK_REVIEWS.map((review, index) => (
                        <View key={index} style={styles.reviewCard}>
                            <View style={styles.reviewHeader}>
                                <View style={styles.reviewAvatar}>
                                    <Ionicons name="person-outline" size={18} color={colors.primary} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={styles.reviewMeta}>
                                        <Text style={styles.reviewName}>{review.name}</Text>
                                        <Text style={styles.reviewTime}>{review.time}</Text>
                                    </View>
                                    <View style={styles.starsRow}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Ionicons key={star} name="star" size={13} color="#F5C518" />
                                        ))}
                                    </View>
                                </View>
                                <View style={styles.reviewLikes}>
                                    <Ionicons name="heart-outline" size={14} color="#aaa" />
                                    <Text style={styles.reviewLikesText}>{review.likes}</Text>
                                </View>
                            </View>
                            <Text style={styles.reviewText}>{review.text}</Text>
                        </View>
                    ))}

                </View>
            </ScrollView>

            <BottomNav />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.primary },
    loadingContainer: {
        flex: 1, backgroundColor: colors.primary,
        alignItems: 'center', justifyContent: 'center',
    },
    header: {
        position: 'absolute',
        top: 0, left: 0, right: 0,
        zIndex: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
    headerBtn: {
        width: 38, height: 38, borderRadius: 19,
        backgroundColor: 'rgba(0,0,0,0.35)',
        alignItems: 'center', justifyContent: 'center',
    },
    scrollContent: { paddingBottom: 24 },
    galleryContainer: { backgroundColor: colors.primary },
    mainPhoto: { width: SCREEN_WIDTH, height: 320 },
    dotsRow: {
        position: 'absolute',
        bottom: 14, left: 0, right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)' },
    dotActive: { backgroundColor: '#DDBC9B', width: 16 },
    photoCounter: {
        position: 'absolute',
        bottom: 14, right: 16,
        backgroundColor: 'rgba(0,0,0,0.45)',
        borderRadius: 50,
        paddingHorizontal: 10, paddingVertical: 4,
    },
    photoCounterText: { color: colors.white, fontSize: 12, fontWeight: 'bold' },
    photoPlaceholder: {
        height: 220, alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.15)', gap: 8,
    },
    photoPlaceholderText: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
    card: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16,
        marginTop: -24,
    },
    titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    title: {
        flex: 1, fontSize: 22, fontWeight: 'bold',
        color: colors.primary, lineHeight: 28,
    },
    favoriteBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: '#faf8f6',
        alignItems: 'center', justifyContent: 'center',
    },
    metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
    metaChip: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: '#faf8f6', borderRadius: 50,
        paddingHorizontal: 12, paddingVertical: 6,
        borderWidth: 1, borderColor: '#ede8e4',
    },
    metaChipText: { fontSize: 12, color: colors.primary },
    authorRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
    authorAvatar: {
        width: 38, height: 38, borderRadius: 19,
        backgroundColor: '#f0ebe8',
        borderWidth: 1.5, borderColor: colors.primary,
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
    },
    authorInitials: { fontSize: 13, fontWeight: 'bold', color: colors.primary },
    authorName: { fontSize: 13, fontWeight: 'bold', color: colors.primary },
    authorDate: { fontSize: 11, color: '#aaa' },

    divider: { height: 1, backgroundColor: '#f0ebe8', marginVertical: 20 },
    descriptionText: { fontSize: 14, color: '#555', lineHeight: 22 },
    sectionTitle: { fontSize: 17, fontWeight: 'bold', color: colors.primary, marginBottom: 14 },

    ingredientRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
    ingredientBullet: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary, marginTop: 6 },
    ingredientText: { flex: 1, fontSize: 14, color: '#444', lineHeight: 20 },

    stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
    stepNumber: {
        width: 26, height: 26, borderRadius: 13,
        backgroundColor: colors.primary,
        alignItems: 'center', justifyContent: 'center', marginTop: 1,
    },
    stepNumberText: { color: '#DDBC9B', fontSize: 12, fontWeight: 'bold' },
    stepText: { flex: 1, fontSize: 14, color: '#444', lineHeight: 22 },

    ratingBox: { gap: 12, backgroundColor: '#faf8f6',  borderRadius: 16, padding: 14, marginBottom: 20 },
    ratingBoxHeader: { flexDirection: 'row', gap: 12 },
    ratingBoxAvatar: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: '#e8e0da',
        alignItems: 'center', justifyContent: 'center',
    },
    ratingBoxContent: { flex: 1, gap: 6 },
    ratingBoxPrompt: {
        fontSize: 13, fontWeight: 'bold', color: colors.primary
    },
    ratingBoxSub: { fontSize: 12, color: '#888' },
    starsRow: { flexDirection: 'row', gap: 2 },
    commentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 50,
        paddingHorizontal: 14,
        paddingVertical: 8,
        gap: 8,
        borderWidth: 1,
        borderColor: '#e8e0da',
    },
    commentPlaceholder: { flex: 1, fontSize: 12, color: '#bbb' },
    ratingAverage: {
        flexDirection: 'row', alignItems: 'center',
        gap: 12, marginBottom: 20,
    },
    ratingAverageNumber: {
        fontSize: 36, fontWeight: 'bold', color: colors.primary
    },
    ratingAverageCount: { fontSize: 12, color: '#aaa' },
    reviewCard: {
        paddingVertical: 14,
        borderTopWidth: 1, borderTopColor: '#f0ebe8', gap: 8,
    },
    reviewHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    reviewAvatar: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: '#e8e0da',
        alignItems: 'center', justifyContent: 'center',
    },
    reviewMeta: {
        flexDirection: 'row', alignItems: 'center',
        gap: 8, marginBottom: 2,
    },
    reviewName: {
        fontSize: 13, fontWeight: 'bold', color: colors.primary
    },
    reviewTime: { fontSize: 11, color: '#aaa' },
    reviewLikes: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    reviewLikesText: { fontSize: 12, color: '#aaa' },
    reviewText: { fontSize: 13, color: '#555', lineHeight: 20 },
})