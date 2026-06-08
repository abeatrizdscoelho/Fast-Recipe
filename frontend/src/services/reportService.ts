import axios from "axios"
import { api } from "./api"
import i18next from "i18next"
import crashlytics from '@react-native-firebase/crashlytics' 

export const reportService = {
  async reportComment(commentId: string): Promise<void> {
    try {
      await api.post(`/recipes/comments/${commentId}/report`)
    } catch (err) {
      crashlytics().log(`Erro ao reportar comentário ID: ${commentId}`)

      if (axios.isAxiosError(err)) {
        crashlytics().recordError(err) 
        throw new Error(err.response?.data?.error ?? i18next.t('reportService.reportError'))
      }
      throw new Error(i18next.t('common.unexpectedError'))
    }
  },
}