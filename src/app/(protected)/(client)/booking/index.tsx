import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { Text, Surface, Divider, Button, ActivityIndicator } from 'react-native-paper';
import { Stack, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { useEventStore } from '@/store/eventStore';
import { formatDate } from '@/utils/dateUtils';
import { neoStyles } from '@/app/constants/neoStyles';
import { BookingWithEvent } from '@/types';

export default function BookingHistoryScreen() {
    const router = useRouter();
    const { user, isLoaded } = useUser();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const [bookings, setBookings] = useState<BookingWithEvent[]>([]);

    useEffect(() => {
        if (!isLoaded) return;

        if (!user) {
            const timer = setTimeout(() => {
                router.replace('/sign-in');
            }, 100);
            return () => clearTimeout(timer);
        }

        setIsCheckingAuth(false);

        const userBookings = useEventStore.getState().bookings
            .filter(booking => booking.userId === user.id)
            .map(booking => {
                const event = useEventStore.getState().events.find(e => e.id === booking.eventId);
                return event ? { ...booking, event } : null;
            })
            .filter(Boolean) as BookingWithEvent[];

        setBookings(userBookings);
    }, [isLoaded, user]);

    const handleCancelBooking = (bookingId: string) => {
        useEventStore.getState().cancelBooking(bookingId);
        setBookings(prev => prev.filter(b => b.id !== bookingId));
    };
    const renderBookingItem = ({ item }: { item: BookingWithEvent }) => (
        <Surface style={styles.bookingCard}>
            {item.event.imageUri && (
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.event.imageUri }} style={styles.image} />
                </View>
            )}

            <Text style={styles.eventTitle}>{item.event.title}</Text>
            <Divider style={styles.divider} />

            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>DATE:</Text>
                <Text style={styles.detailValue}>{formatDate(item.event.date)}</Text>
            </View>

            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>LOCATION:</Text>
                <Text style={styles.detailValue}>{item.event.location}</Text>
            </View>

            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>ATTENDEES:</Text>
                <Text style={styles.detailValue}>{item.attendeeCount}</Text>
            </View>

            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>STATUS:</Text>
                <View style={[
                    styles.statusBadge,
                    item.status === 'cancelled' && styles.cancelledBadge,
                    item.status === 'pending' && styles.pendingBadge
                ]}>
                    <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                </View>
            </View>

            {item.status !== 'cancelled' && (
                <Button
                    mode="outlined"
                    onPress={() => handleCancelBooking(item.id)}
                    style={styles.cancelButton}
                    labelStyle={styles.cancelButtonText}
                >
                    CANCEL BOOKING
                </Button>
            )}
        </Surface>
    );

    if (isCheckingAuth) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={neoStyles.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'MY BOOKINGS',
                    headerTitleStyle: styles.headerTitle,
                    headerShadowVisible: false,
                }}
            />

            {bookings.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyTitle}>NO BOOKINGS YET</Text>
                    <Text style={styles.emptySubtitle}>
                        Your upcoming events will appear here once you make a booking
                    </Text>
                    <Button
                        mode="contained"
                        onPress={() => router.push('/(client)/events')}
                        style={styles.browseButton}
                        labelStyle={styles.browseButtonText}
                    >
                        BROWSE EVENTS
                    </Button>
                </View>
            ) : (
                <FlatList
                    data={bookings}
                    renderItem={renderBookingItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            )}
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
        color: '#000',
    },
    listContent: {
        paddingVertical: neoStyles.padding,
    },
    bookingCard: {
        padding: neoStyles.padding,
        borderWidth: 3,
        borderColor: '#000',
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    imageContainer: {
        height: 150,
        marginBottom: neoStyles.margin,
        borderWidth: 2,
        borderColor: '#000',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    eventTitle: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: neoStyles.margin,
    },
    divider: {
        height: 2,
        backgroundColor: '#000',
        marginVertical: neoStyles.margin,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: neoStyles.margin,
    },
    detailLabel: {
        fontWeight: '800',
        width: 100,
        fontSize: 14,
    },
    detailValue: {
        fontWeight: '500',
        flex: 1,
        fontSize: 14,
    },
    statusBadge: {
        backgroundColor: neoStyles.secondary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 2,
        borderColor: '#000',
    },
    cancelledBadge: {
        backgroundColor: neoStyles.primary,
    },
    pendingBadge: {
        backgroundColor: neoStyles.accent,
    },
    statusText: {
        fontWeight: '800',
        fontSize: 12,
        color: '#000',
    },
    cancelButton: {
        borderWidth: 3,
        borderColor: '#000',
        backgroundColor: neoStyles.primary,
        marginTop: neoStyles.margin,
    },
    cancelButtonText: {
        color: '#FFF',
        fontWeight: '800',
    },
    separator: {
        height: neoStyles.margin * 2,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: neoStyles.padding * 2,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: neoStyles.margin,
        color: neoStyles.primary,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: neoStyles.margin * 2,
    },
    browseButton: {
        borderWidth: 3,
        borderColor: '#000',
        backgroundColor: neoStyles.secondary,
        paddingVertical: 6,
    },
    browseButtonText: {
        color: '#000',
        fontWeight: '800',
    },
});