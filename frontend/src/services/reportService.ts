import axios from "axios"
import { api } from "./api"

export const reportService = {
  async reportComment(commentId: string, reason: string): Promise<void> {
    try {
      await api.post(`/recipes/comments/${commentId}/report`, { reason })
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? 'Erro ao registrar denúncia')
      }
      throw new Error('Erro inesperado')
    }
  },
}