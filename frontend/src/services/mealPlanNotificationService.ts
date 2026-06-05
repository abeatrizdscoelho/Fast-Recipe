import * as Notifications from 'expo-notifications'
import { MealPlan, MealType } from '../types/mealPlan'

interface NotificationPermissionsResult {
    granted: boolean
    canAskAgain: boolean
    expires: string
    status: string
    ios?: {
        status: number
        allowsSound: boolean
        allowsAlert: boolean
        allowsBadge: boolean
    }
}

const MEAL_TIMES: Record<MealType, { hour: number; minute: number }> = {
    breakfast: { hour: 7, minute: 30 },
    lunch: { hour: 11, minute: 45 },
    dinner: { hour: 18, minute: 30 },
}

const NOTIFICATION_TAG = 'meal-plan-reminder'

async function requestNotificationPermission(): Promise<boolean> {
    const result = await Notifications.requestPermissionsAsync() as unknown as NotificationPermissionsResult
    return result.granted
}

async function getNotificationPermission(): Promise<boolean> {
    const result = await Notifications.getPermissionsAsync() as unknown as NotificationPermissionsResult
    return result.granted
}

export const mealNotificationService = {
    async requestPermission(): Promise<boolean> {
        return requestNotificationPermission()
    },

    async cancelAll(): Promise<void> {
        const scheduled = await Notifications.getAllScheduledNotificationsAsync()
        const mealNotifications = scheduled.filter(n =>
            n.content.data?.tag === NOTIFICATION_TAG
        )
        await Promise.all(
            mealNotifications.map(n => Notifications.cancelScheduledNotificationAsync(n.identifier))
        )
    },

    async scheduleForWeek(mealPlan: MealPlan): Promise<void> {
        await this.cancelAll()

        const granted = await getNotificationPermission()
        if (!granted) return

        const weekStart = new Date(mealPlan.weekStart)

        for (const entry of mealPlan.entries) {
            if (entry.completed) continue

            const mealTime = MEAL_TIMES[entry.mealType]
            if (!mealTime) continue

            const mealDate = new Date(weekStart)
            mealDate.setDate(mealDate.getDate() + entry.dayOfWeek)
            mealDate.setHours(mealTime.hour, mealTime.minute, 0, 0)

            if (mealDate <= new Date()) continue

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: `🍽️ ${getMealLabel(entry.mealType)}`,
                    body: entry.recipe.title,
                    sound: true,
                    data: {
                        tag: NOTIFICATION_TAG,
                        entryId: entry.id,
                        recipeId: entry.recipeId,
                    },
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: mealDate,
                    channelId: 'meal-reminders',
                },
            })
        }
    },
}

function getMealLabel(mealType: MealType): string {
    const labels: Record<MealType, string> = {
        breakfast: 'Hora do café da manhã!',
        lunch: 'Hora do almoço!',
        dinner: 'Hora do jantar!',
    }
    return labels[mealType] ?? 'Hora da refeição!'
}