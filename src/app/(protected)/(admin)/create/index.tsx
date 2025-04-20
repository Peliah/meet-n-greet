import React from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Stack, useRouter } from 'expo-router';
import { useEventStore } from '@/store/eventStore';
import { neoStyles } from '@/app/constants/neoStyles';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import NeoInput from '@/components/NeoInput';

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(50),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:MM format'),
  location: z.string().min(3, 'Location required').max(50),
  capacity: z.coerce.number().min(1, 'Minimum 1').max(1000),
  category: z.string().min(3, 'Category required').max(20),
  imageUri: z.string().url('Valid URL required')
});

type EventFormData = z.infer<typeof eventSchema>;

export default function CreateEventScreen() {
  const router = useRouter();
  const addEvent = useEventStore(state => state.addEvent);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      capacity: 10,
      category: '',
      imageUri: '',
    }
  });

  const onSubmit = (data: EventFormData) => {
    addEvent({
      ...data,
      createdBy: 'admin' // Replace with actual admin ID
    });
    router.back();
  };

  const imageUri = useWatch({
    control,
    name: 'imageUri',
    defaultValue: ''
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'CREATE EVENT',
          headerTitleStyle: styles.headerTitle,
        }}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
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
                label="EVENT TITLE *"
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
                label="DESCRIPTION *"
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
                    label="DATE *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="YYYY-MM-DD"
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
                    label="TIME *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="HH:MM"
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
                label="LOCATION *"
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
                    label="CAPACITY *"
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
                    label="CATEGORY *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.category?.message}
                  />
                )}
              />
            </View>
          </View>

          <Button
            onPress={handleSubmit(onSubmit)}
            style={styles.submitButton}
            labelStyle={styles.submitButtonText}
            disabled={!isValid}
          >
            CREATE EVENT
          </Button>
          <Button
            onPress={() => router.back()}
            style={styles.backButton}
            labelStyle={styles.buttonText}
          >
            CANCEL
          </Button>
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
    color: '#000',
  },
  backButton: {
    borderWidth: 3,
    borderColor: '#000',
    backgroundColor: neoStyles.primary,
    paddingVertical: neoStyles.padding / 2,
    marginTop: neoStyles.margin * 2,
  },
  form: {
    marginTop: neoStyles.margin * 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: neoStyles.margin * 2,
  },
  halfWidth: {
    width: '48%',
  },
  submitButton: {
    borderWidth: 3,
    borderColor: '#000',
    backgroundColor: neoStyles.secondary,
    paddingVertical: neoStyles.padding / 2,
    marginTop: neoStyles.margin * 3,
  },
  submitButtonText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 16,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '800',
  },
  imagePreviewContainer: {
    height: 200,
    borderWidth: 3,
    borderColor: '#000',
    marginBottom: neoStyles.margin * 2,
    backgroundColor: '#FFF',
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