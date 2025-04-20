import React from 'react';
import { View, StyleSheet, FlatList, Image, Pressable } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { Stack, useRouter } from 'expo-router';
import { useEventStore } from '@/store/eventStore';
import { neoStyles } from '@/app/constants/neoStyles';
import { MaterialIcons } from '@expo/vector-icons';

export default function AdminEventsScreen() {
    const router = useRouter();
    const events = useEventStore(state => state.events);

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'MANAGE EVENTS',
                    headerTitleStyle: styles.headerTitle,
                }}
            />

            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <Surface style={styles.eventCard}>
                        <View style={styles.imageContainer}>
                            {item.imageUri ? (
                                <Image
                                    source={{ uri: item.imageUri }}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                            ) : (
                                <View style={styles.imagePlaceholder}>
                                    <Text style={styles.placeholderText}>
                                        {item.title.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.content}>
                            <Text style={styles.eventTitle}>{item.title}</Text>
                            <View style={styles.eventDetails}>
                                <Text style={styles.detailText}>{item.location}</Text>
                                <Text style={styles.detailText}>{item.date}</Text>
                            </View>
                            <Pressable
                                onPress={() => router.push(`/(admin)/events/${item.id}`)}
                                style={styles.manageButton}
                            >
                                <Text style={styles.manageButtonText}>MANAGE</Text>
                            </Pressable>
                        </View>
                    </Surface>
                )}
            />

            <Pressable
                onPress={() => router.push('/(admin)/create')}
                style={({ pressed }) => [
                    styles.fab,
                    pressed && styles.fabPressed
                ]}
            >
                <MaterialIcons name="add" size={32} color="#000" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: neoStyles.background,
        paddingHorizontal: neoStyles.padding,
    },
    headerTitle: {
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    listContent: {
        paddingVertical: neoStyles.padding,
        paddingBottom: neoStyles.padding * 4, // Extra space for FAB
    },
    eventCard: {
        borderWidth: 3,
        borderColor: '#000',
        marginBottom: neoStyles.margin * 2,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    imageContainer: {
        height: 160,
        borderBottomWidth: 3,
        borderColor: '#000',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        flex: 1,
        backgroundColor: neoStyles.accent,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 48,
        fontWeight: '900',
        color: '#000',
    },
    content: {
        padding: neoStyles.padding,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 8,
    },
    eventDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    detailText: {
        fontWeight: '600',
    },
    manageButton: {
        alignSelf: 'flex-end',
        borderWidth: 3,
        borderColor: '#000',
        backgroundColor: neoStyles.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    manageButtonText: {
        color: '#FFF',
        fontWeight: '800',
    },
    fab: {
        position: 'absolute',
        right: neoStyles.padding,
        bottom: neoStyles.padding * 2,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: neoStyles.secondary,
        borderWidth: 3,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 5,
    },
    fabPressed: {
        transform: [{ translateX: 2 }, { translateY: 2 }],
        shadowOffset: { width: 2, height: 2 },
    },
});