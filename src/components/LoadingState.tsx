import { neoStyles } from '@/app/constants/neoStyles';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

export function LoadingState(): React.JSX.Element {
    return (
        <View style={styles.container}>
            <View style={{
                width: 60,
                height: 60,
                borderWidth: 3,
                borderColor: '#000',
                borderTopColor: neoStyles.primary,
                borderRadius: 30,
                marginBottom: neoStyles.margin,
            }} />
            <Text style={styles.text}>LOADING EVENTS...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: neoStyles.background,
    },
    text: {
        marginTop: neoStyles.margin * 2,
        fontSize: neoStyles.body.fontSize,
        fontWeight: '800',
        color: neoStyles.text,
    },
});