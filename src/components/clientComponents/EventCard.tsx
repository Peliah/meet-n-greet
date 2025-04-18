import React from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { Text, Surface, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { formatDate, formatTime } from '@/utils/dateUtils';
import { Event } from '@/types';

interface EventCardProps {
    event: Event;
}

export function EventCard({ event }: EventCardProps): React.JSX.Element {
    const navigateToDetails = (): void => {
        router.push(`/client/events/${event.id}`);
    };

    return (
        <Pressable onPress={navigateToDetails}>
            <Surface style={styles.card} elevation={1}>
                {event.imageUri ? (
                    <Image source={{ uri: event.imageUri }} style={styles.image} />
                ) : (
                    <View style={[styles.image, styles.imagePlaceholder]}>
                        <Text style={styles.placeholderText}>{event.title.charAt(0)}</Text>
                    </View>
                )}

                <View style={styles.contentContainer}>
                    <View style={styles.headerRow}>
                        <Text style={styles.title} numberOfLines={1}>
                            {event.title}
                        </Text>
                        {event.bookedCount >= event.capacity ? (
                            <Chip compact mode="flat" style={styles.fullChip}>
                                Full
                            </Chip>
                        ) : null}
                    </View>

                    <Text style={styles.description} numberOfLines={2}>
                        {event.description}
                    </Text>

                    <View style={styles.detailsContainer}>
                        <View style={styles.detailRow}>
                            <Text variant="labelMedium" style={styles.detailLabel}>
                                Date
                            </Text>
                            <Text variant="bodyMedium" style={styles.detailValue}>
                                {formatDate(event.date)}
                            </Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text variant="labelMedium" style={styles.detailLabel}>
                                Time
                            </Text>
                            <Text variant="bodyMedium" style={styles.detailValue}>
                                {formatTime(event.time)}
                            </Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text variant="labelMedium" style={styles.detailLabel}>
                                Location
                            </Text>
                            <Text variant="bodyMedium" style={styles.detailValue} numberOfLines={1}>
                                {event.location}
                            </Text>
                        </View>
                    </View>

                    {event.category ? (
                        <View style={styles.categoryContainer}>
                            <Chip compact mode="outlined" style={styles.categoryChip}>
                                {event.category}
                            </Chip>
                        </View>
                    ) : null}

                    <View style={styles.capacityContainer}>
                        <Text variant="labelSmall" style={styles.capacityText}>
                            {event.capacity - event.bookedCount} spots left
                        </Text>
                    </View>
                </View>
            </Surface>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    image: {
        height: 140,
        width: '100%',
        backgroundColor: '#e0e0e0',
    },
    imagePlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6200ee20',
    },
    placeholderText: {
        fontSize: 48,
        color: '#6200ee',
        fontWeight: 'bold',
    },
    contentContainer: {
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        flex: 1,
    },
    fullChip: {
        backgroundColor: '#f44336',
        marginLeft: 8,
    },
    description: {
        color: '#666',
        marginBottom: 16,
    },
    detailsContainer: {
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    detailLabel: {
        width: 70,
        color: '#888',
    },
    detailValue: {
        flex: 1,
        fontWeight: '500',
    },
    categoryContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    categoryChip: {
        backgroundColor: 'transparent',
        borderColor: '#6200ee',
    },
    capacityContainer: {
        alignItems: 'flex-end',
    },
    capacityText: {
        color: '#6200ee',
    },
});