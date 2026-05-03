import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import React from 'react'
import {
    ActivityIndicator, Dimensions, Image,
    ScrollView, StyleSheet, Text, TouchableOpacity, View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { BottomNav } from '../../components/BottomNav'
import { useRecipeDetail } from '../../hooks/recipe/useRecipeDetail'
import { colors } from '../../theme/color'
import { RatingAverage } from './components/ReviewComponents/RatingAverage'
import { RatingBox } from './components/ReviewComponents/RatingBox'
import { CommentCard } from './components/ReviewComponents/CommentCard'
import { ReportModal } from './components/ReviewComponents/ReportModal'
import { useRecipeRating } from '@/src/hooks/recipe/useRecipeRating'
import { useRecipeComments } from '@/src/hooks/recipe/useRecipeComments'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export default function RecipeDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const insets = useSafeAreaInsets()

    const {
        recipe, loading, activePhoto, setActivePhoto, photos, authorInitials, toggleFavorite, userAvatarUrl, userInitials, isAuthor
    } = useRecipeDetail(id)

    const {
        ratingAverage, ratingCount, userRating, submittingRating, submitRating
    } = useRecipeRating(id)

    const { comments, commentText, setCommentText,
        submitComment, submittingComment,
        editingCommentId, editingText, setEditingText,
        startEditComment, cancelEditComment, saveEditComment,
        confirmDeleteComment,
        reportingCommentId, setReportingCommentId, confirmReport
    } = useRecipeComments(id)

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

            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid
                extraScrollHeight={20}
            >
                {photos.length > 0 ? (
                    <View style={styles.galleryContainer}>
                        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}
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

                    {recipe.dietaryRestrictions && recipe.dietaryRestrictions.length > 0 && (
                        <View style={styles.restrictionsRow}>
                            {recipe.dietaryRestrictions.map(restriction => (
                                <View key={restriction} style={styles.restrictionChip}>
                                    <Ionicons name="leaf-outline" size={11} color="#4CAF50" />
                                    <Text style={styles.restrictionChipText}>{restriction}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    <View style={styles.divider} />

                    {recipe.description && (
                        <>
                            <Text style={styles.sectionTitle}>Sobre a receita</Text>
                            <Text style={styles.descriptionText}>{recipe.description}</Text>
                            <View style={styles.divider} />
                        </>
                    )}

                    {recipe.ingredients.map((ingredient, index) => (
                        <View key={index} style={styles.ingredientRow}>
                            <View style={styles.ingredientBullet} />
                            <Text style={styles.ingredientText}>
                                <Text style={styles.ingredientQty}>
                                    {ingredient.quantity} {ingredient.unit}
                                </Text>
                                {' — '}{ingredient.name}
                            </Text>
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

                    <RatingAverage average={ratingAverage} count={ratingCount} />

                    {!isAuthor && (
                        <RatingBox
                            userRating={userRating}
                            submitting={submittingRating}
                            onRate={submitRating}
                            commentValue={commentText}
                            onCommentChange={setCommentText}
                            onCommentSubmit={submitComment}
                            submittingComment={submittingComment}
                            userAvatarUrl={userAvatarUrl}
                            userInitials={userInitials}
                        />
                    )}

                    {comments.length === 0 ? (
                        <Text style={styles.emptyComments}>Nenhum comentário ainda.</Text>
                    ) : (
                        comments.map(comment => (
                            <CommentCard
                                key={comment.id}
                                comment={comment}
                                editingCommentId={editingCommentId}
                                editingText={editingText}
                                setEditingText={setEditingText}
                                onStartEdit={startEditComment}
                                onSaveEdit={saveEditComment}
                                onCancelEdit={cancelEditComment}
                                onDelete={confirmDeleteComment}
                                onReport={setReportingCommentId}
                            />
                        ))
                    )}

                </View>
            </KeyboardAwareScrollView>

            <BottomNav />

            <ReportModal
                visible={!!reportingCommentId}
                onClose={() => setReportingCommentId(null)}
                onConfirm={confirmReport}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.primary },
    loadingContainer: {
        flex: 1, 
        backgroundColor: colors.primary,
        alignItems: 'center', 
        justifyContent: 'center',
    },

    header: {
        position: 'absolute', 
        top: 0, left: 0, right: 0, zIndex: 20,
        flexDirection: 'row', 
        justifyContent: 'space-between',
        paddingHorizontal: 20, 
        paddingBottom: 8,
    },
    headerBtn: {
        width: 38, height: 38, 
        borderRadius: 19,
        backgroundColor: 'rgba(0,0,0,0.35)',
        alignItems: 'center', 
        justifyContent: 'center',
    },

    scrollContent: { paddingBottom: 24 },
    galleryContainer: { backgroundColor: colors.primary },
    mainPhoto: { width: SCREEN_WIDTH, height: 320 },

    dotsRow: {
        position: 'absolute', 
        bottom: 14, left: 0, right: 0,
        flexDirection: 'row', 
        justifyContent: 'center', gap: 6,
    },
    dot: {
        width: 6, height: 6, 
        borderRadius: 3, 
        backgroundColor: 'rgba(255,255,255,0.4)' 
    },
    dotActive: { backgroundColor: colors.cream, width: 16 },

    photoCounter: {
        position: 'absolute', bottom: 38, right: 16,
        backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 50,
        paddingHorizontal: 10, paddingVertical: 4,
    },
    photoCounterText: { color: colors.white, fontSize: 12, fontWeight: 'bold' },
    photoPlaceholder: {
        height: 220, 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.15)', gap: 8,
    },
    photoPlaceholderText: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },

    card: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 28, 
        borderTopRightRadius: 28,
        paddingHorizontal: 24, 
        paddingTop: 24, 
        paddingBottom: 16,
        marginTop: -24,
    },

    titleRow: { 
        flexDirection: 'row', 
        alignItems: 'flex-start', 
        gap: 12 
    },
    title: { 
        flex: 1, 
        fontSize: 22, 
        fontWeight: 'bold', 
        color: colors.primary, 
        lineHeight: 28 
    },

    favoriteBtn: {
        width: 40, height: 40, 
        borderRadius: 20,
        backgroundColor: colors.surface,
        alignItems: 'center', 
        justifyContent: 'center',
    },

    authorRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 10, 
        marginBottom: 16 
    },
    authorAvatar: {
        width: 38, height: 38, 
        borderRadius: 19,
        backgroundColor: colors.border, 
        borderWidth: 1.5, 
        borderColor: colors.primary,
        alignItems: 'center', 
        justifyContent: 'center', 
        overflow: 'hidden',
    },
    authorInitials: { 
        fontSize: 13, 
        fontWeight: 'bold', 
        color: colors.primary 
    },
    authorName: { 
        fontSize: 13, 
        fontWeight: 'bold', 
        color: colors.primary 
    },
    authorDate: { fontSize: 11, color: '#aaa' },

    metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
    metaChip: {
        flexDirection: 'row', 
        alignItems: 'center', gap: 4,
        backgroundColor: colors.surface, 
        borderRadius: 50,
        paddingHorizontal: 12, 
        paddingVertical: 6,
        borderWidth: 1, 
        borderColor: '#ede8e4',
    },
    metaChipText: { fontSize: 12, color: colors.primary },

    restrictionsRow: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        gap: 6, marginTop: 10 
    },
    restrictionChip: {
        flexDirection: 'row', 
        alignItems: 'center', gap: 4,
        backgroundColor: '#f0faf0', 
        borderRadius: 50,
        paddingHorizontal: 10, paddingVertical: 5,
        borderWidth: 1, borderColor: '#c8e6c9',
    },
    restrictionChipText: { 
        fontSize: 11, 
        color: colors.greenDark, 
        fontWeight: '600' 
    },

    divider: { 
        height: 1, 
        backgroundColor: colors.border, 
        marginVertical: 20 
    },
    descriptionText: { 
        fontSize: 14, 
        color: '#555', 
        lineHeight: 22 
    },
    sectionTitle: { 
        fontSize: 17, 
        fontWeight: 'bold', 
        color: colors.primary, 
        marginBottom: 14 
    },

    ingredientRow: { 
        flexDirection: 'row', 
        alignItems: 'flex-start', 
        gap: 10, marginBottom: 8 
    },
    ingredientBullet: { 
        width: 7, height: 7, 
        borderRadius: 4, 
        backgroundColor: colors.primary, 
        marginTop: 6 
    },
    ingredientText: { 
        flex: 1, 
        fontSize: 14, 
        color: '#444', 
        lineHeight: 20 
    },
    ingredientQty: { 
        fontWeight: 'bold', 
        color: colors.primary 
    },

    stepRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 12, 
        marginBottom: 14 
    },
    stepNumber: {
        width: 26, height: 26, 
        borderRadius: 13, 
        backgroundColor: colors.primary,
        alignItems: 'center', 
        justifyContent: 'center', 
        marginTop: 1,
    },
    stepNumberText: { 
        color: colors.cream, 
        fontSize: 12, 
        fontWeight: 'bold' 
    },
    stepText: { 
        flex: 1, 
        fontSize: 14, 
        color: '#444', 
        lineHeight: 22 
    },

    emptyComments: { fontSize: 13, color: '#aaa', textAlign: 'center', paddingVertical: 16 },
})