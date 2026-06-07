import React from 'react'
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/ThemeContext'

type Props = {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ReportModal({ visible, onClose, onConfirm }: Props) {
  const { theme } = useTheme()
  const { t } = useTranslation()

  const dynStyles = StyleSheet.create({
    box: { backgroundColor: theme.card },
    title: { color: theme.textPrimary },
    cancelBtn: { borderColor: theme.divider },
    cancelText: { color: theme.textMuted },
  })

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.box, dynStyles.box]}>
          <Text style={[styles.title, dynStyles.title]}>{t('reportModal.title')}</Text>
          <Text style={styles.subtitle}>{t('reportModal.subtitle')}</Text>

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={[styles.cancelBtn, dynStyles.cancelBtn]}>
              <Text style={[styles.cancelText, dynStyles.cancelText]}>{t('reportModal.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={styles.confirmBtn}>
              <Text style={styles.confirmText}>{t('reportModal.confirm')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  box: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7A0000',
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 4,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelText: {
    fontSize: 13,
    color: '#888',
  },
  confirmBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#e05c5c',
  },
  confirmText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
})