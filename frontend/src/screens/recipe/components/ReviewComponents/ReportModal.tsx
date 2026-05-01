import React from 'react'
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { colors } from '@/src/theme/color'

type Props = {
  visible: boolean
  onClose: () => void
  onConfirm: () => void  
}

export function ReportModal({ visible, onClose, onConfirm }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Denunciar comentário</Text>
          <Text style={styles.subtitle}>
            Deseja denunciar este comentário?
            Comentários com muitas denúncias são ocultados automaticamente.
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={styles.confirmBtn}>
              <Text style={styles.confirmText}>Denunciar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    backgroundColor: colors.white, borderRadius: 20,
    padding: 24, width: '100%', gap: 12,
  },
  title: { fontSize: 16, fontWeight: 'bold', color: colors.primary },
  subtitle: { fontSize: 13, color: '#888', lineHeight: 18 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 4 },
  cancelBtn: {
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 20, borderWidth: 1, borderColor: '#ddd',
  },
  cancelText: { fontSize: 13, color: '#888' },
  confirmBtn: {
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 20, backgroundColor: '#e05c5c',
  },
  confirmText: { fontSize: 13, color: colors.white, fontWeight: 'bold' },
})