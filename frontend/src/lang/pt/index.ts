import auth from './auth';
import mealPlan from './mealPlan';
import pantry from './pantry';
import profile from './profile';
import social from './social';
import recipe from './recipe';
import shoppingList from './shoppingList';
import common from './common';
import services from './services';
import onboarding from '@/app/onboarding';

export default {
    ...auth,
    ...onboarding,
    ...mealPlan,
    ...pantry,
    ...profile,
    ...social,
    ...recipe,
    ...shoppingList,
    ...common,
    ...services,
};