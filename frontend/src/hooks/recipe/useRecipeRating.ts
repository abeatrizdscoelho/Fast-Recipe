import { useState, useEffect, useCallback } from 'react'
import { Alert } from 'react-native'
import { reviewService } from '@/src/services/reviewService'
import { useTranslation } from 'react-i18next'

export function useRecipeRating(id: string, isOffline: boolean | null) {
  const { t } = useTranslation()
  const [ratingAverage, setRatingAverage] = useState(0)
  const [ratingCount, setRatingCount] = useState(0)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [submittingRating, setSubmittingRating] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id || isOffline !== false) return
    async function load() {
      try {
        const ratingData = await reviewService.getRating(id)
        setRatingAverage(ratingData.average)
        setRatingCount(ratingData.count)
        setUserRating(ratingData.userRating)
      } catch {
        Alert.alert(t('common.errorTitle'), t('recipeRating.loadError'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, isOffline])

  const submitRating = useCallback(async (rating: number) => {
    if (submittingRating) return
    setSubmittingRating(true)
    const previous = userRating
    setUserRating(rating)
    try {
      const result = await reviewService.upsertReview(id, rating)
      setRatingAverage(result.average)
      setRatingCount(result.count)
    } catch (err) {
      setUserRating(previous)
      Alert.alert(t('common.errorTitle'), err instanceof Error ? err.message : t('recipeRating.submitError'))
    } finally {
      setSubmittingRating(false)
    }
  }, [id, submittingRating, userRating])

  return {
    ratingAverage, ratingCount, userRating, submittingRating, loading, submitRating,
  }
}