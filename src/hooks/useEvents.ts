import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Event, EventFilters } from '../types';

interface UseEventsParams {
  searchQuery?: string;
  filters?: EventFilters;
}

interface UseEventsResult {
  events: Event[];
  isLoading: boolean;
  error: Error | null;
  refreshEvents: () => Promise<void>;
}

export function useEvents({ searchQuery = '', filters = {
  category: null,
  fromDate: null,
  toDate: null,
  location: null
} }: UseEventsParams): UseEventsResult {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch events from AsyncStorage
      const eventsJson = await AsyncStorage.getItem('@EventApp:events');
      let allEvents: Event[] = eventsJson ? JSON.parse(eventsJson) : [];

      // Apply filters
      let filteredEvents = allEvents;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredEvents = filteredEvents.filter(event =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
        );
      }

      // Category filter
      if (filters.category) {
        filteredEvents = filteredEvents.filter(event =>
          event.category === filters.category
        );
      }

      // Date range filter
      if (filters.fromDate) {
        filteredEvents = filteredEvents.filter(event =>
          new Date(event.date) >= new Date(filters.fromDate)
        );
      }

      if (filters.toDate) {
        filteredEvents = filteredEvents.filter(event =>
          new Date(event.date) <= new Date(filters.toDate)
        );
      }

      // Location filter
      if (filters.location) {
        filteredEvents = filteredEvents.filter(event =>
          event.location === filters.location
        );
      }

      // Sort by date (upcoming first)
      filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setEvents(filteredEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch events when filters or search query changes
  useEffect(() => {
    fetchEvents();
  }, [searchQuery, JSON.stringify(filters)]);

  return {
    events,
    isLoading,
    error,
    refreshEvents: fetchEvents
  };
}