import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'
import i18n, { changeLanguage } from '@/src/lang'

export function useLanguage() {
    const { t } = useTranslation()
    const currentLanguage = i18n.language as 'pt' | 'en'
    const currentLanguageLabel = currentLanguage === 'pt' ? 'Português' : 'English'

    function handleLanguagePress() {
        const next = currentLanguage === 'pt' ? 'en' : 'pt'
        const label = next === 'en' ? 'Inglês' : 'Portuguese'
        Alert.alert(
            t('profileSettings.language'),
            t('languageSwitcher.confirmMessage', { language: label }),
            [
                { text: t('commentCard.cancel'), style: 'cancel' },
                { text: label, onPress: () => changeLanguage(next) },
            ]
        )
    }

    return { currentLanguage, currentLanguageLabel, handleLanguagePress }
}