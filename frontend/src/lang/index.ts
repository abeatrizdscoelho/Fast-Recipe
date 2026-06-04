import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pt from './pt';
import en from './en';

const LANGUAGE_KEY = '@app_language';

export async function initI18n() {
  const saved = await AsyncStorage.getItem(LANGUAGE_KEY)
  const device = Localization.getLocales()[0].languageCode ?? 'pt'
  const lng = saved ?? (['pt', 'en'].includes(device) ? device : 'pt')

  await i18n.use(initReactI18next).init({
    resources: {
      pt: { translation: pt },
      en: { translation: en },
    },
    lng,
    fallbackLng: 'pt',
    interpolation: { escapeValue: false },
  })
}

export async function changeLanguage(lang: 'pt' | 'en') {
  await i18n.changeLanguage(lang)
  await AsyncStorage.setItem(LANGUAGE_KEY, lang)
}

export default i18n;