import React from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEventStore } from '@/store/eventStore';
import { neoStyles } from '@/app/constants/neoStyles';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import NeoInput from '@/components/NeoInput';

const eventSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
    location: z.string().min(3),
    capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
    category: z.string().min(3),
    imageUri: z.string().url('Valid URL required'),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function EventManagementScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { events, updateEvent, deleteEvent } = useEventStore();

    const event = events.find(e => e.id === id);

    const { control, handleSubmit, formState: { errors, isDirty } } = useForm<EventFormData>({
        resolver: zodResolver(eventSchema),
        defaultValues: event || {
            title: '',
            description: '',
            date: '',
            time: '',
            location: '',
            capacity: 0,
            category: '',
            imageUri: '',
        }
    });


    const imageUri = useWatch({
        control,
        name: 'imageUri',
        defaultValue: event?.imageUri || ''
    });


    const onSubmit = (data: EventFormData) => {
        if (id) {
            updateEvent(id as string, data);
            router.back();
        }
    };

    const handleDelete = () => {
        if (id) {
            deleteEvent(id as string);
            router.back();
        }
    };

    if (!event) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>EVENT NOT FOUND</Text>
                <Button
                    onPress={() => router.back()}
                    style={styles.backButton}
                    labelStyle={styles.buttonText}
                >
                    GO BACK
                </Button>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'MANAGE EVENT',
                    headerTitleStyle: styles.headerTitle,
                }}
            />
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.form}>

                    {/* Image Preview */}
                    {imageUri ? (
                        <View style={styles.imagePreviewContainer}>
                            <Image
                                source={{ uri: imageUri }}
                                style={styles.imagePreview}
                                resizeMode="cover"
                            />
                        </View>
                    ) : (
                        <View style={[styles.imagePreviewContainer, styles.imagePlaceholder]}>
                            <Text style={styles.placeholderText}>IMAGE PREVIEW</Text>
                        </View>
                    )}

                    <Controller
                        control={control}
                        name="imageUri"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <NeoInput
                                label="IMAGE URL"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder="https://example.com/image.jpg"
                                error={errors.imageUri?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="title"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <NeoInput
                                label="TITLE"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                error={errors.title?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <NeoInput
                                label="DESCRIPTION"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                multiline
                                numberOfLines={4}
                                error={errors.description?.message}
                            />
                        )}
                    />

                    <View style={styles.row}>
                        <View style={styles.halfWidth}>
                            <Controller
                                control={control}
                                name="date"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <NeoInput
                                        label="DATE (YYYY-MM-DD)"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        error={errors.date?.message}
                                    />
                                )}
                            />
                        </View>
                        <View style={styles.halfWidth}>
                            <Controller
                                control={control}
                                name="time"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <NeoInput
                                        label="TIME (HH:MM)"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        error={errors.time?.message}
                                    />
                                )}
                            />
                        </View>
                    </View>

                    <Controller
                        control={control}
                        name="location"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <NeoInput
                                label="LOCATION"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                error={errors.location?.message}
                            />
                        )}
                    />

                    <View style={styles.row}>
                        <View style={styles.halfWidth}>
                            <Controller
                                control={control}
                                name="capacity"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <NeoInput
                                        label="CAPACITY"
                                        value={value.toString()}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        keyboardType="numeric"
                                        error={errors.capacity?.message}
                                    />
                                )}
                            />
                        </View>
                        <View style={styles.halfWidth}>
                            <Controller
                                control={control}
                                name="category"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <NeoInput
                                        label="CATEGORY"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        error={errors.category?.message}
                                    />
                                )}
                            />
                        </View>
                    </View>

                    <View style={styles.buttonRow}>
                        <Button
                            onPress={handleSubmit(onSubmit)}
                            style={styles.saveButton}
                            labelStyle={styles.buttonText}
                            disabled={!isDirty}
                        >
                            SAVE CHANGES
                        </Button>
                        <Button
                            onPress={handleDelete}
                            style={styles.deleteButton}
                            labelStyle={styles.buttonText}
                        >
                            DELETE EVENT
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: neoStyles.background,
        padding: neoStyles.padding,
    },
    scrollContainer: {
        // padding: neoStyles.padding,
        paddingBottom: neoStyles.padding * 2,
    },
    headerTitle: {
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    form: {
        marginTop: neoStyles.margin * 2,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfWidth: {
        width: '48%',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: neoStyles.margin * 2,
    },
    saveButton: {
        flex: 1,
        marginRight: neoStyles.margin,
        borderWidth: 3,
        borderColor: '#000',
        backgroundColor: neoStyles.secondary,
    },
    deleteButton: {
        flex: 1,
        borderWidth: 3,
        borderColor: '#000',
        backgroundColor: neoStyles.primary,
    },
    backButton: {
        marginTop: neoStyles.margin * 2,
        borderWidth: 3,
        borderColor: '#000',
        backgroundColor: neoStyles.accent,
    },
    buttonText: {
        fontWeight: '800',
    },
    errorText: {
        fontSize: 18,
        fontWeight: '800',
        color: neoStyles.primary,
        textAlign: 'center',
    },
    imagePreviewContainer: {
        height: 200,
        borderWidth: 3,
        borderColor: '#000',
        marginBottom: neoStyles.margin * 2,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: neoStyles.accent,
    },
    placeholderText: {
        fontWeight: '800',
        fontSize: 16,
        color: '#000',
    },
});