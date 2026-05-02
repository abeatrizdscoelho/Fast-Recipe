import prisma from '../database/prisma'

const recipeSelect = {
    id: true,
    title: true,
    photos: true,
    category: true,
    time: true,
}

export const mealPlanRepository = {
    async findOrCreateByWeek(userId: string, weekStart: Date) {
        return prisma.mealPlan.upsert({
            where: { userId_weekStart: { userId, weekStart } },
            update: {},
            create: { userId, weekStart },
            include: {
                entries: {
                    include: { recipe: { select: recipeSelect } },
                    orderBy: [{ dayOfWeek: 'asc' }, { createdAt: 'asc' }],
                },
            },
        })
    },

    async findByWeek(userId: string, weekStart: Date) {
        return prisma.mealPlan.findUnique({
            where: { userId_weekStart: { userId, weekStart } },
            include: {
                entries: {
                    include: { recipe: { select: recipeSelect } },
                    orderBy: [{ dayOfWeek: 'asc' }, { createdAt: 'asc' }],
                },
            },
        })
    },

    async findEntryById(entryId: string) {
        return prisma.mealPlanEntry.findUnique({
            where: { id: entryId },
            include: { mealPlan: true },
        })
    },

    async addEntry(mealPlanId: string, data: {
        recipeId: string
        dayOfWeek: number
        mealType: string
    }) {
        return prisma.mealPlanEntry.create({
            data: { mealPlanId, ...data },
            include: { recipe: { select: recipeSelect } },
        })
    },

    async replaceEntry(entryId: string, recipeId: string) {
        return prisma.mealPlanEntry.update({
            where: { id: entryId },
            data: { recipeId },
            include: { recipe: { select: recipeSelect } },
        })
    },

    async removeEntry(entryId: string) {
        return prisma.mealPlanEntry.delete({ where: { id: entryId } })
    },

    async entryExists(mealPlanId: string, recipeId: string, dayOfWeek: number, mealType: string) {
        const entry = await prisma.mealPlanEntry.findUnique({
            where: {
                mealPlanId_recipeId_dayOfWeek_mealType: {
                    mealPlanId, recipeId, dayOfWeek, mealType,
                },
            },
        })
        return !!entry
    },
}