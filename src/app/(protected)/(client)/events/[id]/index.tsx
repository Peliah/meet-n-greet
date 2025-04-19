// app/(app)/client/events/[id]/index.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Button, Divider, Chip, TextInput } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { useEventStore } from '@/store/eventStore';
import { formatDate, formatTime } from '../../../../../utils/dateUtils';
import BookingConfirmationModal from '@/components/clientComponents/BookConfirmationModal';
import { neoStyles } from '@/app/constants/neoStyles';
import { useUser } from '@clerk/clerk-expo';
export default function EventDetailScreen() {
    const { user } = useUser();
    const { id } = useLocalSearchParams();
    const event = useEventStore((state) => state.getEventById(id as string));
    const bookEvent = useEventStore((state) => state.bookEvent);
    const [attendeeCount, setAttendeeCount] = useState('1');
    const [isBooking, setIsBooking] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [bookingError, setBookingError] = useState('');

    const cancelBooking = useEventStore((state) => state.cancelBooking);

    if (!event) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>EVENT NOT FOUND</Text>
            </View>
        );
    }

    const handleBookEvent = async () => {
        if (!attendeeCount || isNaN(parseInt(attendeeCount))) {
            setBookingError('Please enter a valid number');
            return;
        }

        const count = parseInt(attendeeCount);
        if (count < 1) {
            setBookingError('Must book at least 1 spot');
            return;
        }

        setIsBooking(true);
        setBookingError('');

        try {
            const userId = user?.id;
            await bookEvent(event.id, userId, count);
            setShowConfirmation(true);
        } catch (error) {
            setBookingError(error instanceof Error ? error.message : 'Booking failed');
        } finally {
            setIsBooking(false);
        }
    };

    const spotsLeft = event.capacity - event.bookedCount;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: event.imageUri }} style={styles.image} />
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{event.title}</Text>
                    {spotsLeft <= 0 && (
                        <Chip style={styles.fullChip} textStyle={styles.fullChipText}>
                            SOLD OUT
                        </Chip>
                    )}
                </View>

                {event.category && (
                    <Chip mode="outlined" style={styles.categoryChip}>
                        {event.category}
                    </Chip>
                )}

                <Text style={styles.description}>{event.description}</Text>

                <Divider style={styles.divider} />

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>DATE:</Text>
                    <Text style={styles.detailValue}>{formatDate(event.date)}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>TIME:</Text>
                    <Text style={styles.detailValue}>{formatTime(event.time)}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>LOCATION:</Text>
                    <Text style={styles.detailValue}>{event.location}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>CAPACITY:</Text>
                    <Text style={styles.detailValue}>
                        {spotsLeft > 0 ? `${spotsLeft} SPOTS LEFT` : 'FULLY BOOKED'}
                    </Text>
                </View>

                <Divider style={styles.divider} />

                {spotsLeft > 0 && (
                    <View style={styles.bookingSection}>
                        <Text style={styles.bookingLabel}>NUMBER OF ATTENDEES:</Text>
                        <TextInput
                            mode="outlined"
                            keyboardType="numeric"
                            value={attendeeCount}
                            onChangeText={setAttendeeCount}
                            style={styles.attendeeInput}
                            outlineStyle={styles.inputOutline}
                            maxLength={2}
                        />
                        {bookingError && (
                            <Text style={styles.errorText}>{bookingError}</Text>
                        )}
                        <Button
                            mode="contained"
                            onPress={handleBookEvent}
                            loading={isBooking}
                            disabled={isBooking || spotsLeft <= 0}
                            style={styles.bookButton}
                            labelStyle={styles.bookButtonText}
                        >
                            {isBooking ? 'BOOKING...' : 'BOOK NOW'}
                        </Button>
                    </View>
                )}
            </View>

            <BookingConfirmationModal
                visible={showConfirmation}
                onDismiss={() => {
                    setShowConfirmation(false);
                    router.back();
                }}
                onViewBookings={() => {
                    setShowConfirmation(false);
                    router.push('/(client)/booking');
                }}
                event={event}
                attendeeCount={parseInt(attendeeCount) || 1}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: neoStyles.background,
    },
    imageContainer: {
        height: 250,
        borderBottomWidth: 3,
        borderColor: '#000',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        padding: neoStyles.padding,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: neoStyles.margin,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        flex: 1,
    },
    fullChip: {
        backgroundColor: neoStyles.primary,
        borderWidth: 2,
        borderColor: '#000',
        marginLeft: neoStyles.margin,
    },
    fullChipText: {
        color: '#FFF',
        fontWeight: '800',
        fontSize: 12,
    },
    categoryChip: {
        alignSelf: 'flex-start',
        borderWidth: 2,
        borderColor: '#000',
        backgroundColor: neoStyles.secondary,
        marginBottom: neoStyles.margin,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: neoStyles.margin * 2,
    },
    divider: {
        height: 3,
        backgroundColor: '#000',
        marginVertical: neoStyles.margin * 2,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: neoStyles.margin,
    },
    detailLabel: {
        fontWeight: '800',
        width: 100,
    },
    detailValue: {
        fontWeight: '500',
        flex: 1,
    },
    bookingSection: {
        marginTop: neoStyles.margin * 2,
    },
    bookingLabel: {
        fontWeight: '800',
        marginBottom: neoStyles.margin,
    },
    attendeeInput: {
        backgroundColor: '#FFF',
        marginBottom: neoStyles.margin,
    },
    inputOutline: {
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 0,
    },
    bookButton: {
        borderWidth: 3,
        borderColor: '#000',
        backgroundColor: neoStyles.primary,
        paddingVertical: neoStyles.padding / 2,
        marginTop: neoStyles.margin,
    },
    bookButtonText: {
        color: '#FFF',
        fontWeight: '800',
    },
    errorText: {
        color: neoStyles.primary,
        fontWeight: '800',
        marginBottom: neoStyles.margin,
    },
});