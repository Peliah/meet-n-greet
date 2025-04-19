import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { Stack } from 'expo-router';
import { SearchBar } from '@/components/SearchBar';
import { FilterModal } from '@/components/clientComponents/FilterModal';
import { EventsList } from '@/components/clientComponents/Eventlist';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/clientComponents/EmptyState';
import { EventFilters } from '@/types';
import { neoStyles } from '@/app/constants/neoStyles';
import { useEventStore } from '@/store/eventStore';
import { Event } from '@/types';

export default function EventsScreen(): React.JSX.Element {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filters, setFilters] = useState<EventFilters>({
        category: null,
        fromDate: null,
        toDate: null,
        location: null,
    });
    const [filterVisible, setFilterVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { events: allEvents, getEventById, getUserBookings } = useEventStore();

    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

    useEffect(() => {
        const filterEvents = () => {
            try {
                setIsLoading(true);
                let result = [...allEvents];

                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    result = result.filter(event =>
                        event.title.toLowerCase().includes(query) ||
                        event.description.toLowerCase().includes(query) ||
                        event.location.toLowerCase().includes(query)
                    );
                }

                if (filters.category) {
                    result = result.filter(event =>
                        event.category === filters.category
                    );
                }

                if (filters.fromDate) {
                    result = result.filter(event =>
                        new Date(event.date) >= new Date(filters.fromDate)
                    );
                }

                if (filters.toDate) {
                    result = result.filter(event =>
                        new Date(event.date) <= new Date(filters.toDate)
                    );
                }

                if (filters.location) {
                    result = result.filter(event =>
                        event.location === filters.location
                    );
                }

                result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                setFilteredEvents(result);
                setError(null);
            } catch (err) {
                setError('Failed to filter events');
                console.error('Filter error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        filterEvents();
    }, [allEvents, searchQuery, filters]);

    const handleSearch = (query: string): void => {
        setSearchQuery(query);
    };

    const handleFilterApply = (newFilters: EventFilters): void => {
        setFilters(newFilters);
        setFilterVisible(false);
    };

    const handleRefresh = async () => {
        // In a real app, you might fetch fresh data here
        // For now, we'll just reapply filters
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 500);
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'UPCOMING EVENTS',
                    headerTitleStyle: styles.headerTitle,
                    headerStyle: styles.header,
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
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>ERROR LOADING EVENTS</Text>
                    <Text style={styles.errorSubText}>Pull to refresh or try again later</Text>
                </View>
            ) : filteredEvents.length === 0 ? (
                <EmptyState
                    message="NO EVENTS FOUND"
                    subMessage="Try adjusting your search or filters"
                    onAction={handleRefresh}
                />
            ) : (
                <EventsList
                    events={filteredEvents}
                    refreshing={isLoading}
                    onRefresh={handleRefresh}
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
    header: {
        backgroundColor: neoStyles.background,
        borderBottomWidth: 3,
        borderColor: '#000',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#000',
    },
    searchContainer: {
        marginVertical: neoStyles.margin,
        borderWidth: 3,
        borderColor: '#000',
        backgroundColor: '#FFF',
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: neoStyles.padding,
    },
    errorText: {
        color: neoStyles.primary,
        fontWeight: '800',
        fontSize: 18,
        marginBottom: neoStyles.margin,
        textAlign: 'center',
    },
    errorSubText: {
        color: '#000',
        fontWeight: '600',
        textAlign: 'center',
    },
});