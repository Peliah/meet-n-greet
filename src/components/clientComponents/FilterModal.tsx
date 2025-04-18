import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import { Modal, Portal, Button, Divider, Chip, Surface } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { categories, locations } from '@/app/constants/eventFilters';
import { EventFilters } from '@/types';
import { neoStyles } from '@/app/constants/neoStyles';

interface FilterModalProps {
    visible: boolean;
    initialFilters: EventFilters;
    onDismiss: () => void;
    onApply: (filters: EventFilters) => void;
}

type DatePickerMode = 'from' | 'to';

export function FilterModal({
    visible,
    initialFilters,
    onDismiss,
    onApply
}: FilterModalProps): React.JSX.Element {
    const [filters, setFilters] = useState<EventFilters>(initialFilters);
    const [datePickerVisible, setDatePickerVisible] = useState<boolean>(false);
    const [datePickerMode, setDatePickerMode] = useState<DatePickerMode>('from');

    const handleCategorySelect = (category: string): void => {
        setFilters(prev => ({
            ...prev,
            category: prev.category === category ? null : category
        }));
    };

    const handleLocationSelect = (location: string): void => {
        setFilters(prev => ({
            ...prev,
            location: prev.location === location ? null : location
        }));
    };

    const handleDateConfirm = (date: Date): void => {
        setDatePickerVisible(false);
        setFilters(prev => ({
            ...prev,
            [datePickerMode === 'from' ? 'fromDate' : 'toDate']: date.toISOString().split('T')[0]
        }));
    };

    const handleReset = (): void => {
        setFilters({
            category: null,
            fromDate: null,
            toDate: null,
            location: null,
        });
    };

    const openDatePicker = (mode: DatePickerMode): void => {
        setDatePickerMode(mode);
        setDatePickerVisible(true);
    };

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
                <Surface style={styles.surface}>
                    <Text style={styles.modalTitle}>FILTER EVENTS</Text>
                    <Divider style={styles.divider} />

                    <ScrollView>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>CATEGORIES</Text>
                            <View style={styles.chipContainer}>
                                {categories.map((category) => (
                                    <Pressable
                                        key={category}
                                        style={[
                                            styles.chip,
                                            filters.category === category && styles.selectedChip
                                        ]}
                                        onPress={() => handleCategorySelect(category)}
                                    >
                                        <Text style={[
                                            styles.chipText,
                                            filters.category === category && styles.selectedChipText
                                        ]}>
                                            {category.toUpperCase()}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        <Divider style={styles.divider} />

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>DATE RANGE</Text>
                            <View style={styles.dateButtons}>
                                <Pressable
                                    style={styles.dateButton}
                                    onPress={() => openDatePicker('from')}
                                >
                                    <Text style={styles.dateButtonText}>
                                        {filters.fromDate?.toUpperCase() || 'FROM DATE'}
                                    </Text>
                                </Pressable>
                                <Pressable
                                    style={styles.dateButton}
                                    onPress={() => openDatePicker('to')}
                                >
                                    <Text style={styles.dateButtonText}>
                                        {filters.toDate?.toUpperCase() || 'TO DATE'}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>

                        <Divider style={styles.divider} />

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>LOCATIONS</Text>
                            <View style={styles.chipContainer}>
                                {locations.map((location) => (
                                    <Pressable
                                        key={location}
                                        style={[
                                            styles.chip,
                                            filters.location === location && styles.selectedChip
                                        ]}
                                        onPress={() => handleLocationSelect(location)}
                                    >
                                        <Text style={[
                                            styles.chipText,
                                            filters.location === location && styles.selectedChipText
                                        ]}>
                                            {location.toUpperCase()}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    <Divider style={styles.divider} />

                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.resetButton} onPress={handleReset}>
                            <Text style={styles.buttonText}>RESET</Text>
                        </Pressable>
                        <Pressable style={styles.applyButton} onPress={() => onApply(filters)}>
                            <Text style={styles.buttonText}>APPLY</Text>
                        </Pressable>
                    </View>
                </Surface>

                <DateTimePickerModal
                    isVisible={datePickerVisible}
                    mode="date"
                    onConfirm={handleDateConfirm}
                    onCancel={() => setDatePickerVisible(false)}
                />
            </Modal>
        </Portal>

    );
}

const styles = StyleSheet.create({
    modalContainer: {
        padding: neoStyles.padding,
        justifyContent: 'center',
    },
    surface: {
        padding: neoStyles.padding,
        borderWidth: 3,
        borderColor: '#000',
        backgroundColor: neoStyles.background,
        shadowColor: '#000',
        shadowOffset: { width: 8, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 0,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: neoStyles.heading.fontSize,
        fontWeight: neoStyles.heading.fontWeight,
        marginBottom: neoStyles.margin,
        letterSpacing: -0.5,
    },
    divider: {
        height: 3,
        backgroundColor: '#000',
        marginVertical: neoStyles.margin,
    },
    section: {
        marginBottom: neoStyles.margin * 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: neoStyles.margin,
        letterSpacing: -0.5,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        borderWidth: 2,
        borderColor: '#000',
        backgroundColor: '#FFF',
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    selectedChip: {
        backgroundColor: neoStyles.primary,
    },
    chipText: {
        fontWeight: '800',
        fontSize: 14,
    },
    selectedChipText: {
        color: '#FFF',
    },
    dateButtons: {
        flexDirection: 'row',
        gap: neoStyles.margin,
    },
    dateButton: {
        flex: 1,
        borderWidth: 3,
        borderColor: '#000',
        backgroundColor: neoStyles.accent,
        height: 50,
        justifyContent: 'center',
    },
    dateButtonText: {
        fontWeight: '800',
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: neoStyles.margin * 2,
    },
    resetButton: {
        borderWidth: 3,
        borderColor: '#000',
        backgroundColor: '#FFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        flex: 1,
        marginRight: neoStyles.margin,
    },
    applyButton: {
        borderWidth: 3,
        borderColor: '#000',
        backgroundColor: neoStyles.secondary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        flex: 1,
    },
    buttonText: {
        fontWeight: '800',
        textAlign: 'center',
    },
});