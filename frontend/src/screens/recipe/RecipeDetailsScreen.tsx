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
import { RatingAverage } from './components/ReviewComponents/RatingAverage'
import { RatingBox } from './components/ReviewComponents/RatingBox'
import { CommentCard } from './components/ReviewComponents/CommentCard'
import { ReportModal } from './components/ReviewComponents/ReportModal'
import { useRecipeRating } from '@/src/hooks/recipe/useRecipeRating'
import { useRecipeComments } from '@/src/hooks/recipe/useRecipeComments'
import { pluralizeUnit } from '@/src/utils/pluralizeUnitUtil'
import { NutritionCard } from './components/RecipeNutritionCard'
import { usePortionScale } from '@/src/hooks/recipe/useRecipePortionScale'
import { PortionSelector } from './components/RecipePortionSelector'
import { scaleIngredient } from '@/src/utils/scaleIngredientUtil'
import { RecipeTimer } from './components/RecipeTimer'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/ThemeContext'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export default function RecipeDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const { t } = useTranslation()
    const { theme, isDark } = useTheme()
    const insets = useSafeAreaInsets()

    const {
        recipe, loading, activePhoto, setActivePhoto, photos, authorInitials, toggleFavorite, userAvatarUrl, userInitials, isAuthor, originalPortions, onTimerFinished, isSaved, isOffline, toggleSaveOffline, shareRecipe,
    } = useRecipeDetail(id)

    const {
        ratingAverage, ratingCount, userRating, submittingRating, submitRating
    } = useRecipeRating(id, isOffline)

    const { comments, commentText, setCommentText,
        submitComment, submittingComment,
        editingCommentId, editingText, setEditingText,
        startEditComment, cancelEditComment, saveEditComment,
        confirmDeleteComment,
        reportingCommentId, setReportingCommentId, confirmReport
    } = useRecipeComments(id, isOffline)

    const { portions, scale, increment, decrement } = usePortionScale(originalPortions)

    const dynStyles = StyleSheet.create({
        container: { backgroundColor: theme.background },
        loadingContainer: { backgroundColor: theme.background },
        galleryContainer: { backgroundColor: theme.background },
        card: { backgroundColor: theme.card },
        title: { color: theme.textPrimary },
        favoriteBtn: { backgroundColor: theme.surface },
        authorAvatar: { backgroundColor: theme.border, borderColor: theme.primary },
        authorInitials: { color: theme.textPrimary },
        authorName: { color: theme.textPrimary },
        metaChip: { backgroundColor: theme.surface, borderColor: theme.border },
        metaChipText: { color: theme.textPrimary },
        descriptionText: { color: isDark ? '#E0E0E0' : '#555' },
        ingredientText: { color: isDark ? '#E0E0E0' : '#444' },
        stepText: { color: isDark ? '#E0E0E0' : '#444' },
        divider: { backgroundColor: theme.border },
        sectionTitle: { color: theme.textPrimary },
        ingredientBullet: { backgroundColor: theme.primary },
        ingredientQty: { color: theme.textPrimary },
        stepNumber: { backgroundColor: theme.primary },
        dotActive: { backgroundColor: theme.cream },
        restrictionChip: {
            backgroundColor: isDark ? 'rgba(76,175,80,0.12)' : '#f0faf0',
            borderColor: isDark ? 'rgba(76,175,80,0.3)' : '#c8e6c9',
        },
        restrictionChipText: {
            color: isDark ? '#81C784' : '#388E3C',
        },
    })

    if (loading) {
        return (
            <View style={[styles.loadingContainer, dynStyles.loadingContainer]}>
                <ActivityIndicator size="large" color={theme.white} />
            </View>
        )
    }

    if (!recipe) return null

    return (
        <View style={[styles.container, dynStyles.container]}>
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
                    <Ionicons name="arrow-back-outline" size={24} color={theme.white} />
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', gap: 8 }}>
                    {!isOffline && (
                        <TouchableOpacity onPress={toggleSaveOffline} style={styles.headerBtn}>
                            <Ionicons
                                name={isSaved ? 'download' : 'download-outline'}
                                size={22}
                                color={isSaved ? theme.cream : theme.white}
                            />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={shareRecipe} style={styles.headerBtn}>
                        <Ionicons name="share-outline" size={22} color={theme.white} />
                    </TouchableOpacity>
                </View>
            </View>

            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid
                extraScrollHeight={20}
            >
                {photos.length > 0 ? (
                    <View style={[styles.galleryContainer, dynStyles.galleryContainer]}>
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
                                    <View key={index} style={[styles.dot, activePhoto === index && styles.dotActive, activePhoto === index && dynStyles.dotActive]} />
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
                        <Text style={styles.photoPlaceholderText}>{t('recipeDetail.noPhoto')}</Text>
                    </View>
                )}

                <View style={[styles.card, dynStyles.card]}>

                    <View style={styles.titleRow}>
                        <Text style={[styles.title, dynStyles.title]}>{recipe.title}</Text>
                        <TouchableOpacity
                            onPress={isOffline ? undefined : toggleFavorite}
                            style={[styles.favoriteBtn, dynStyles.favoriteBtn, isOffline && { opacity: 0.4 }]}
                        >
                            <Ionicons
                                name={recipe.favorite ? 'heart' : 'heart-outline'}
                                size={22}
                                color={recipe.favorite ? '#e05c5c' : theme.primary}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.authorRow}>
                        {recipe.author?.avatarUrl ? (
                            <Image source={{ uri: recipe.author.avatarUrl }} style={[styles.authorAvatar, dynStyles.authorAvatar]} />
                        ) : (
                            <View style={[styles.authorAvatar, dynStyles.authorAvatar]}>
                                <Text style={[styles.authorInitials, dynStyles.authorInitials]}>{authorInitials}</Text>
                            </View>
                        )}
                        <View>
                            <Text style={[styles.authorName, dynStyles.authorName]}>
                                {recipe.author?.name ?? t('recipeDetail.unknownAuthor')}
                            </Text>
                            <Text style={styles.authorDate}>
                                {new Date(recipe.createdAt).toLocaleDateString('pt-BR', {
                                    day: '2-digit', month: 'long', year: 'numeric',
                                })}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.metaRow}>
                        <View style={[styles.metaChip, dynStyles.metaChip]}>
                            <Ionicons name="time-outline" size={13} color={theme.primary} />
                            <Text style={[styles.metaChipText, dynStyles.metaChipText]}>
                                {t('recipeDetail.timeUnit', { count: Number(recipe.time) })}
                            </Text>
                        </View>
                        {recipe.difficulty && (
                            <View style={[styles.metaChip, dynStyles.metaChip]}>
                                <Ionicons name="flame-outline" size={13} color={theme.primary} />
                                <Text style={[styles.metaChipText, dynStyles.metaChipText]}>
                                    {t(`difficulties.${recipe.difficulty}`, recipe.difficulty)}
                                </Text>
                            </View>
                        )}
                        <View style={[styles.metaChip, dynStyles.metaChip]}>
                            <Ionicons name="pricetag-outline" size={13} color={theme.primary} />
                            <Text style={[styles.metaChipText, dynStyles.metaChipText]}>
                                {t(`categories.${recipe.category}`, recipe.category)}
                            </Text>
                        </View>
                        <View style={[styles.metaChip, dynStyles.metaChip]}>
                            <Ionicons name="people-outline" size={13} color={theme.primary} />
                            <Text style={[styles.metaChipText, dynStyles.metaChipText]}>
                                {recipe.portions} {t('recipeDetail.portion', { count: Number(recipe.portions) })}
                            </Text>
                        </View>
                    </View>

                    {recipe.dietaryRestrictions && recipe.dietaryRestrictions.length > 0 && (
                        <View style={styles.restrictionsRow}>
                            {recipe.dietaryRestrictions.map(restriction => (
                                <View key={restriction} style={[styles.restrictionChip, dynStyles.restrictionChip]}>
                                    <Ionicons name="leaf-outline" size={11} color={isDark ? '#81C784' : '#4CAF50'} />
                                    <Text style={[styles.restrictionChipText, dynStyles.restrictionChipText]}>
                                        {t(`dietaryRestrictions.${restriction}`, restriction)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}

                    <View style={[styles.divider, dynStyles.divider]} />

                    {recipe.description && (
                        <>
                            <Text style={[styles.sectionTitle, dynStyles.sectionTitle]}>{t('recipeDetail.aboutTitle')}</Text>
                            <Text style={[styles.descriptionText, dynStyles.descriptionText]}>{recipe.description}</Text>
                            <View style={[styles.divider, dynStyles.divider]} />
                        </>
                    )}

                    <PortionSelector
                        portions={portions}
                        originalPortions={originalPortions}
                        onIncrement={increment}
                        onDecrement={decrement}
                    />

                    <View style={[styles.divider, dynStyles.divider]} />

                    <Text style={[styles.sectionTitle, dynStyles.sectionTitle]}>{t('recipeDetail.ingredientsTitle')}</Text>
                    {recipe.ingredients.map((ingredient, index) => {
                        const scaledQty = scaleIngredient(Number(ingredient.quantity), scale, ingredient.unit)
                        return (
                            <View key={index} style={styles.ingredientRow}>
                                <View style={[styles.ingredientBullet, dynStyles.ingredientBullet]} />
                                <Text style={[styles.ingredientText, dynStyles.ingredientText]}>
                                    <Text style={[styles.ingredientQty, dynStyles.ingredientQty]}>
                                        {scaledQty} {pluralizeUnit(scaledQty, ingredient.unit)}
                                    </Text>
                                    {' - '}{ingredient.name}
                                </Text>
                            </View>
                        )
                    })}

                    <View style={[styles.divider, dynStyles.divider]} />

                    <Text style={[styles.sectionTitle, dynStyles.sectionTitle]}>{t('recipeDetail.preparationTitle')}</Text>
                    {recipe.preparation.split('\n').filter(s => s.trim()).map((step, index) => (
                        <View key={index} style={styles.stepRow}>
                            <View style={[styles.stepNumber, dynStyles.stepNumber]}>
                                <Text style={styles.stepNumberText}>{index + 1}</Text>
                            </View>
                            <Text style={[styles.stepText, dynStyles.stepText]}>{step.trim()}</Text>
                        </View>
                    ))}

                    <RecipeTimer time={recipe.time} recipeTitle={recipe.title} onFinished={onTimerFinished} />

                    <View style={[styles.divider, dynStyles.divider]} />

                    {!isOffline && recipe.nutrition && (
                        <>
                            <NutritionCard nutrition={recipe.nutrition} portions={String(portions)} />
                            <View style={[styles.divider, dynStyles.divider]} />
                        </>
                    )}

                    {!isOffline && (
                        <>
                            <Text style={[styles.sectionTitle, dynStyles.sectionTitle]}>{t('recipeDetail.reviewsTitle')}</Text>
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
                                <Text style={styles.emptyComments}>{t('recipeDetail.emptyComments')}</Text>
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
                        </>
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
    container: {
        flex: 1,
        backgroundColor: '#7A0000'
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#7A0000',
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
    scrollContent: {
        paddingBottom: 24
    },
    galleryContainer: {
        backgroundColor: '#7A0000'
    },
    mainPhoto: {
        width: SCREEN_WIDTH,
        height: 320
    },
    dotsRow: {
        position: 'absolute',
        bottom: 14, left: 0, right: 0,
        flexDirection: 'row',
        justifyContent: 'center', gap: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.4)'
    },
    dotActive: {
        backgroundColor: '#DDBC9B',
        width: 16
    },
    photoCounter: {
        position: 'absolute',
        bottom: 38,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.45)',
        borderRadius: 50,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    photoCounterText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold'
    },
    photoPlaceholder: {
        height: 220,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.15)', gap: 8,
    },
    photoPlaceholderText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 13
    },
    card: {
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
        lineHeight: 28
    },
    favoriteBtn: {
        width: 40, height: 40,
        borderRadius: 20,
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
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    authorInitials: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    authorName: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    authorDate: {
        fontSize: 11,
        color: '#aaa'
    },
    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4
    },
    metaChip: {
        flexDirection: 'row',
        alignItems: 'center', gap: 4,
        borderRadius: 50,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
    },
    metaChipText: { fontSize: 12 },
    restrictionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6, marginTop: 10
    },
    restrictionChip: {
        flexDirection: 'row',
        alignItems: 'center', gap: 4,
        borderRadius: 50,
        paddingHorizontal: 10, paddingVertical: 5,
        borderWidth: 1,
    },
    restrictionChipText: {
        fontSize: 11,
        fontWeight: '600'
    },
    divider: {
        height: 1,
        marginVertical: 20
    },
    descriptionText: {
        fontSize: 14,
        lineHeight: 22
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: 'bold',
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
        marginTop: 6
    },
    ingredientText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20
    },
    ingredientQty: {
        fontWeight: 'bold',
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
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 1,
    },
    stepNumberText: {
        color: '#DDBC9B',
        fontSize: 12,
        fontWeight: 'bold'
    },
    stepText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 22
    },
    emptyComments: {
        fontSize: 13,
        color: '#aaa',
        textAlign: 'center',
        paddingVertical: 16
    },
})