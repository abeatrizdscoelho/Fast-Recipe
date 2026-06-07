import { Ionicons } from "@expo/vector-icons"
import React, { useState } from "react"
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useTheme } from "@/src/context/ThemeContext"

interface MenuOption {
    label: string
    icon: keyof typeof Ionicons.glyphMap
    onPress: () => void
    destructive?: boolean
}

interface Props {
    options: MenuOption[]
}

export function DotsMenu({ options }: Props) {
    const { theme } = useTheme()
    const [visible, setVisible] = useState(false)

    const dynStyles = StyleSheet.create({
        menu: { backgroundColor: theme.card },
        menuDivider: { backgroundColor: theme.divider },
        menuText: { color: theme.textMuted },
    })

    return (
        <>
            <TouchableOpacity
                onPress={() => setVisible(true)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons name="ellipsis-vertical" size={16} color={theme.textMuted} />
            </TouchableOpacity>

            <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
                <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
                    <View style={[styles.menu, dynStyles.menu]}>
                        {options.map((opt, index) => (
                            <React.Fragment key={opt.label}>
                                {index > 0 && <View style={[styles.menuDivider, dynStyles.menuDivider]} />}
                                <TouchableOpacity
                                    style={styles.menuItem}
                                    onPress={() => { setVisible(false); opt.onPress() }}
                                >
                                    <Ionicons name={opt.icon} size={16} color={opt.destructive ? '#e74c3c' : theme.textMuted} />
                                    <Text style={[styles.menuText, dynStyles.menuText, opt.destructive && { color: '#e74c3c' }]}>
                                        {opt.label}
                                    </Text>
                                </TouchableOpacity>
                            </React.Fragment>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menu: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        width: 180,
        paddingVertical: 4,
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 16,
        paddingVertical: 13,
    },
    menuDivider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginHorizontal: 12,
    },
    menuText: {
        fontSize: 14,
        color: '#555',
        fontWeight: '500',
    },
})