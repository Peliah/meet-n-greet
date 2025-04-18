import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Stack } from 'expo-router';
import { useEvents } from '@/hooks/useEvents';
import { SearchBar } from '@/components/SearchBar';
import { FilterModal } from '@/components/clientComponents/FilterModal';
import { EventsList } from '@/components/clientComponents/Eventlist';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/clientComponents/EmptyState';
import { EventFilters } from '@/types';
import { neoStyles } from '@/app/constants/neoStyles';

export default function EventsScreen(): React.JSX.Element {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filters, setFilters] = useState<EventFilters>({
        category: null,
        fromDate: null,
        toDate: null,
        location: null,
    });
    const [filterVisible, setFilterVisible] = useState<boolean>(false);

    const {
        events,
        isLoading,
        error,
        refreshEvents
    } = useEvents({ searchQuery, filters });

    const handleSearch = (query: string): void => {
        setSearchQuery(query);
    };

    const handleFilterApply = (newFilters: EventFilters): void => {
        setFilters(newFilters);
        setFilterVisible(false);
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Upcoming Events',
                    headerShadowVisible: false,
                }}
            />

            <View style={styles.searchContainer}>
                <SearchBar
                    value={searchQuery}
                    onChangeText={handleSearch}
                    onFilterPress={() => setFilterVisible(true)}
                />
            </View>

            {isLoading ? (
                <LoadingState />
            ) : error ? (
                <Text style={styles.errorText}>Something went wrong. Please try again.</Text>
            ) : events.length === 0 ? (
                <EmptyState
                    message="No events found"
                    subMessage="Try changing your search or filters"
                />
            ) : (
                <EventsList
                    events={events}
                    refreshing={isLoading}
                    onRefresh={refreshEvents}
                />
            )}

            <FilterModal
                visible={filterVisible}
                initialFilters={filters}
                onDismiss={() => setFilterVisible(false)}
                onApply={handleFilterApply}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: neoStyles.background,
        paddingHorizontal: neoStyles.padding,
    },
    searchContainer: {
        marginVertical: neoStyles.margin,
    },
    errorText: {
        color: neoStyles.primary,
        fontWeight: '800',
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
    },
});