import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, IconButton } from 'react-native-paper';

interface SearchBarProps {
    value: string;
    onChangeText: (query: string) => void;
    onFilterPress: () => void;
}

export function SearchBar({ value, onChangeText, onFilterPress }: SearchBarProps): React.JSX.Element {
    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Search events..."
                onChangeText={onChangeText}
                value={value}
                style={styles.searchBar}
                iconColor="#6200ee"
                inputStyle={styles.input}
            />
            <IconButton
                icon="filter-variant"
                size={24}
                onPress={onFilterPress}
                style={styles.filterButton}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    searchBar: {
        flex: 1,
        borderRadius: 12,
        elevation: 2,
        backgroundColor: '#fff',
    },
    input: {
        fontSize: 16,
    },
    filterButton: {
        marginLeft: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 2,
    },
});