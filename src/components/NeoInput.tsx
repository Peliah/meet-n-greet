import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Text } from 'react-native-paper';
import { neoStyles } from '@/app/constants/neoStyles';

interface NeoInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    onBlur?: () => void;
    error?: string;
    multiline?: boolean;
    numberOfLines?: number;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
    placeholder?: string; // Add this line
}

export default function NeoInput({
    label,
    value,
    onChangeText,
    onBlur,
    error,
    multiline = false,
    numberOfLines = 1,
    keyboardType = 'default',
    placeholder = '',
}: NeoInputProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[
                    styles.input,
                    multiline && styles.multilineInput,
                    error && styles.errorInput
                ]}
                value={value}
                onChangeText={onChangeText}
                onBlur={onBlur}
                multiline={multiline}
                numberOfLines={numberOfLines}
                keyboardType={keyboardType}
                placeholder={placeholder}
                placeholderTextColor="#888"
            />
            {error && (
                <Text style={styles.errorText}>
                    {error}
                </Text>
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        marginBottom: neoStyles.margin * 2,
    },
    label: {
        fontWeight: '800',
        marginBottom: 8,
        fontSize: 14,
        letterSpacing: -0.5,
    },
    input: {
        borderWidth: 3,
        borderColor: '#000',
        backgroundColor: '#FFF',
        padding: 12,
        fontSize: 16,
        fontWeight: '600',
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    multilineInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    errorInput: {
        borderColor: neoStyles.primary,
    },
    errorText: {
        color: neoStyles.primary,
        fontWeight: '800',
        fontSize: 12,
        marginTop: 4,
    },
});