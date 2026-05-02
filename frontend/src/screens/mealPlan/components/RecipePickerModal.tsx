import React from 'react'
import { Modal, View, Text, TextInput, FlatList,
    TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { FeedRecipe } from '@/src/types/recipe'
import { colors } from '@/src/theme/color'

interface Props {
    visible: boolean
    recipes: FeedRecipe[]
    search: string
    onSearchChange: (text: string) => void
    onSelect: (recipeId: string) => void
    onClose: () => void
}

export function RecipePickerModal({ visible, recipes, search, onSearchChange, onSelect, onClose }: Props) {
    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Escolher Receita</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={26} color="#333" />
                    </TouchableOpacity>
                </View>

                <View style={styles.searchRow}>
                    <Ionicons name="search" size={18} color="#aaa" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Pesquisar receitas..."
                        placeholderTextColor="#aaa"
                        value={search}
                        onChangeText={onSearchChange}
                        autoFocus
                    />
                </View>

                <FlatList
                    data={recipes}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Ionicons name="restaurant-outline" size={48} color="#ddd" />
                            <Text style={styles.emptyText}>Nenhuma receita encontrada.</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.recipeItem} onPress={() => onSelect(item.id)}>
                            {item.photos?.[0] ? (
                                <Image source={{ uri: item.photos[0] }} style={styles.recipeThumb} />
                            ) : (
                                <View style={[styles.recipeThumb, styles.noPhoto]}>
                                    <Ionicons name="restaurant-outline" size={22} color="#ccc" />
                                </View>
                            )}
                            <View style={styles.recipeInfo}>
                                <Text style={styles.recipeName} numberOfLines={1}>{item.title}</Text>
                                <View style={styles.recipeMeta}>
                                    <Ionicons name="time-outline" size={12} color="#999" />
                                    <Text style={styles.metaText}>{item.time}min</Text>
                                    <Text style={styles.metaDot}>·</Text>
                                    <Text style={styles.metaText}>{item.category}</Text>
                                </View>
                            </View>
                            <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
                        </TouchableOpacity>
                    )}
                />
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f8f8' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    title: { fontSize: 18, fontWeight: 'bold', color: colors.primary },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        paddingHorizontal: 12,
    },
    searchIcon: { marginRight: 8 },
    searchInput: { 
        flex: 1, 
        paddingVertical: 12, 
        fontSize: 14, 
        color: '#333' 
    },
    list: { padding: 16, gap: 10 },
    recipeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 14,
        padding: 12,
        gap: 12,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    recipeThumb: {
        width: 60, 
        height: 60, 
        borderRadius: 10, 
        backgroundColor: '#f0f0f0',
    },
    noPhoto: { 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    recipeInfo: { flex: 1 },
    recipeName: { 
        fontSize: 14, 
        fontWeight: '600', 
        color: colors.primary, 
        marginBottom: 4 
    },
    recipeMeta: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 4 
    },
    metaText: { fontSize: 12, color: '#999' },
    metaDot: { fontSize: 12, color: '#ccc' },
    empty: { 
        alignItems: 'center', 
        paddingTop: 60, 
        gap: 12 
    },
    emptyText: { fontSize: 14, color: '#bbb' },
})