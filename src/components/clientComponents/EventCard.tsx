import React from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { router } from 'expo-router';
import { formatDate, formatTime } from '@/utils/dateUtils';
import { Event } from '@/types';
import { neoStyles } from '@/app/constants/neoStyles';

interface EventCardProps {
    event: Event;
}

export function EventCard({ event }: EventCardProps): React.JSX.Element {
    const navigateToDetails = (): void => {
        router.push({
            pathname: `/(client)/events/${event.id}`,
            params: {
                title: event.title,
                imageUri: event.imageUri
            }
        });
    };

    return (
        <Pressable
            onPress={navigateToDetails}
            style={({ pressed }) => [
                styles.cardContainer,
                pressed && styles.pressed
            ]}
        >
            <View style={styles.card}>
                <View style={styles.imageContainer}>
                    {event.imageUri ? (
                        <Image source={{ uri: event.imageUri }} style={styles.image} />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Text style={styles.placeholderText}>
                                {event.title.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title} numberOfLines={1}>
                            {event.title.toUpperCase()}
                        </Text>
                        {event.bookedCount >= event.capacity && (
                            <View style={styles.fullBadge}>
                                <Text style={styles.fullBadgeText}>SOLD OUT</Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.description} numberOfLines={2}>
                        {event.description}
                    </Text>

                    <View style={styles.detailsGrid}>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>DATE</Text>
                            <Text style={styles.detailValue}>
                                {formatDate(event.date)}
                            </Text>
                        </View>

                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>TIME</Text>
                            <Text style={styles.detailValue}>
                                {formatTime(event.time)}
                            </Text>
                        </View>

                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>LOCATION</Text>
                            <Text style={styles.detailValue} numberOfLines={1}>
                                {event.location.toUpperCase()}
                            </Text>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        {event.category && (
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryText}>
                                    {event.category.toUpperCase()}
                                </Text>
                            </View>
                        )}

                        <Text style={styles.capacityText}>
                            {event.capacity - event.bookedCount} SPOTS LEFT
                        </Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 8, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    pressed: {
        transform: [{ translateX: 4 }, { translateY: 4 }],
        shadowOffset: { width: 4, height: 4 },
    },
    card: {
        borderWidth: 3,
        borderColor: '#000',
        backgroundColor: neoStyles.background,
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '900',
        flex: 1,
        letterSpacing: -0.5,
    },
    fullBadge: {
        backgroundColor: neoStyles.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 2,
        borderColor: '#000',
        marginLeft: 8,
    },
    fullBadgeText: {
        color: '#FFF',
        fontWeight: '800',
        fontSize: 12,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
        color: '#333',
    },
    detailsGrid: {
        marginBottom: 16,
    },
    detailItem: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    detailLabel: {
        fontWeight: '800',
        width: 80,
        fontSize: 14,
    },
    detailValue: {
        fontWeight: '600',
        flex: 1,
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryBadge: {
        borderWidth: 2,
        borderColor: '#000',
        backgroundColor: neoStyles.secondary,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    categoryText: {
        fontWeight: '800',
        fontSize: 12,
    },
    capacityText: {
        fontWeight: '800',
        color: neoStyles.primary,
        fontSize: 14,
    },
});