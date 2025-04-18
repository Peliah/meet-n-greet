import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { neoStyles } from '@/app/constants/neoStyles';

interface EmptyStateProps {
    message: string;
    subMessage?: string;
    onAction?: () => void;
}

export function EmptyState({
    message,
    subMessage,
    onAction
}: EmptyStateProps): React.JSX.Element {
    return (
        <View style={styles.container}>
            <MaterialCommunityIcons
                name="calendar-remove-outline"
                size={64}
                color="#ccc"
            />
            <Text style={styles.message}>{message}</Text>
            {subMessage && <Text style={styles.subMessage}>{subMessage}</Text>}
            {onAction && (
                <Button
                    mode="contained"
                    onPress={onAction}
                    style={styles.button}
                >
                    Refresh
                </Button>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: neoStyles.padding * 2,
        backgroundColor: neoStyles.background,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderWidth: 3,
        borderColor: '#000',
        backgroundColor: neoStyles.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: neoStyles.margin * 2,
    },
    message: {
        fontSize: neoStyles.heading.fontSize - 4,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: neoStyles.margin,
    },
    subMessage: {
        fontSize: neoStyles.body.fontSize,
        fontWeight: '600',
        textAlign: 'center',
        color: '#666',
        marginBottom: neoStyles.margin * 2,
    },
    button: {
        borderWidth: 3,
        borderColor: '#000',
        backgroundColor: neoStyles.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    buttonText: {
        fontWeight: '800',
        color: '#FFF',
    },
});