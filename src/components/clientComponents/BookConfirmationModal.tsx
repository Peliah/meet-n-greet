// components/BookingConfirmationModal.tsx
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Modal, Portal, Text, Button } from 'react-native-paper';
import { neoStyles } from '@/app/constants/neoStyles';
import { Event } from '@/types';

interface BookingConfirmationModalProps {
    visible: boolean;
    onDismiss: () => void;
    onViewBookings?: () => void;
    event: Event;
    attendeeCount: number;
}

export default function BookingConfirmationModal({
    visible,
    onDismiss,
    onViewBookings,
    event,
    attendeeCount,
}: BookingConfirmationModalProps) {
    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={styles.modalContainer}
            >
                <View style={styles.modalContent}>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: event.imageUri }} style={styles.image} />
                    </View>

                    <Text style={styles.title}>BOOKING CONFIRMED!</Text>

                    <Text style={styles.confirmationText}>
                        You've successfully booked {attendeeCount} spot{attendeeCount > 1 ? 's' : ''} for:
                    </Text>

                    <Text style={styles.eventTitle}>{event.title}</Text>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>DATE:</Text>
                        <Text style={styles.detailValue}>{event.date}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>TIME:</Text>
                        <Text style={styles.detailValue}>{event.time}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>LOCATION:</Text>
                        <Text style={styles.detailValue}>{event.location}</Text>
                    </View>

                    <Button
                        mode="contained"
                        onPress={onDismiss}
                        style={styles.closeButton}
                        labelStyle={styles.closeButtonText}
                    >
                        CLOSE
                    </Button>
                    <View style={styles.buttonContainer}>
                        <Button
                            mode="outlined"
                            onPress={onDismiss}
                            style={styles.secondaryButton}
                            labelStyle={styles.secondaryButtonText}
                        >
                            CONTINUE BROWSING
                        </Button>
                        {onViewBookings && (
                            <Button
                                mode="contained"
                                onPress={onViewBookings}
                                style={styles.primaryButton}
                                labelStyle={styles.primaryButtonText}
                            >
                                VIEW MY BOOKINGS
                            </Button>
                        )}
                    </View>
                </View>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        padding: neoStyles.padding,
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: neoStyles.background,
        borderWidth: 3,
        borderColor: '#000',
        padding: neoStyles.padding,
        shadowColor: '#000',
        shadowOffset: { width: 8, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    imageContainer: {
        height: 150,
        borderWidth: 3,
        borderColor: '#000',
        marginBottom: neoStyles.margin * 2,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: neoStyles.margin * 2,
        color: neoStyles.primary,
    },
    confirmationText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: neoStyles.margin,
    },
    eventTitle: {
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: neoStyles.margin * 2,
        color: neoStyles.secondary,
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
    closeButton: {
        borderWidth: 3,
        borderColor: '#000',
        backgroundColor: neoStyles.primary,
        marginTop: neoStyles.margin * 2,
        paddingVertical: neoStyles.padding / 2,
    },
    closeButtonText: {
        color: '#FFF',
        fontWeight: '800',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: neoStyles.margin * 2,
        gap: neoStyles.margin,
    },
    primaryButton: {
        flex: 1,
        borderWidth: 3,
        borderColor: '#000',
        backgroundColor: neoStyles.primary,
    },
    secondaryButton: {
        flex: 1,
        borderWidth: 3,
        borderColor: '#000',
        backgroundColor: neoStyles.background,
    },
    primaryButtonText: {
        color: '#FFF',
        fontWeight: '800',
    },
    secondaryButtonText: {
        color: '#000',
        fontWeight: '800',
    },
});