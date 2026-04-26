import React, { useState } from 'react'
import { Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { colors } from '@/src/theme/color'

type Props = {
  visible: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
}

export function ReportModal({ visible, onClose, onConfirm }: Props) {
  const [reason, setReason] = useState('')

  function handleConfirm() {
    if (!reason.trim()) return
    onConfirm(reason.trim())
    setReason('')
  }

  function handleClose() {
    setReason('')
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.box}>
          <Text style={styles.title}>Denunciar comentário</Text>
          <Text style={styles.subtitle}>
            Descreva o motivo da denúncia.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: conteúdo ofensivo, spam..."
            placeholderTextColor="#bbb"
            value={reason}
            onChangeText={setReason}
            multiline
            maxLength={500}
            autoFocus
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={handleClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              style={[styles.confirmBtn, !reason.trim() && styles.confirmBtnDisabled]}
              disabled={!reason.trim()}
            >
              <Text style={styles.confirmText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 32,
  },
  box: {
    backgroundColor: colors.white, borderRadius: 20, padding: 24, width: '100%', gap: 12
  },
  title: { fontSize: 16, fontWeight: 'bold', color: colors.primary },
  subtitle: { fontSize: 13, color: '#888', lineHeight: 18 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 13, color: colors.primary,
    minHeight: 80, textAlignVertical: 'top',
  },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 4 },
  cancelBtn: {
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 20, borderWidth: 1, borderColor: '#ddd',
  },
  cancelText: { fontSize: 13, color: '#888' },
  confirmBtn: {
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 20, backgroundColor: colors.primary,
  },
  confirmBtnDisabled: { opacity: 0.4 },
  confirmText: { fontSize: 13, color: colors.white, fontWeight: 'bold' },
})