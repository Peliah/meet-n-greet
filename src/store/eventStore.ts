import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Event, Booking } from '../types';

type EventState = {
    events: Event[];
    bookings: Booking[];
    addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'bookedCount'>) => void;
    updateEvent: (id: string, updates: Partial<Event>) => void;
    deleteEvent: (id: string) => void;
    bookEvent: (eventId: string, userId?: string, attendeeCount?: number) => void;
    cancelBooking: (bookingId: string) => void;
    getEventById: (id: string) => Event | undefined;
    getUserBookings: (userId?: string) => Booking[];
};

export const useEventStore = create<EventState>()(
    persist(
        (set, get) => ({
            events: [],
            bookings: [],

            // Initialize with dummy data
            ...generateDummyData(),

            addEvent: (event) =>
                set((state) => ({
                    events: [
                        ...state.events,
                        {
                            ...event,
                            id: Date.now().toString(),
                            bookedCount: 0,
                            createdAt: Date.now(),
                            updatedAt: Date.now()
                        }
                    ]
                })),

            updateEvent: (id, updates) =>
                set((state) => ({
                    events: state.events.map((event) =>
                        event.id === id
                            ? { ...event, ...updates, updatedAt: Date.now() }
                            : event
                    ),
                })),

            deleteEvent: (id) =>
                set((state) => ({
                    events: state.events.filter((event) => event.id !== id),
                    bookings: state.bookings.filter((booking) => booking.eventId !== id),
                })),

            bookEvent: (eventId, userId, attendeeCount = 1) => {
                const event = get().events.find(e => e.id === eventId);
                if (!event) return;

                if (event.bookedCount + attendeeCount > event.capacity) {
                    throw new Error('Not enough capacity');
                }

                set((state) => ({
                    events: state.events.map((e) =>
                        e.id === eventId
                            ? { ...e, bookedCount: e.bookedCount + attendeeCount }
                            : e
                    ),
                    bookings: [
                        ...state.bookings,
                        {
                            id: Date.now().toString(),
                            eventId,
                            userId,
                            status: 'confirmed',
                            bookingDate: Date.now(),
                            attendeeCount,
                        },
                    ],
                }));
            },

            cancelBooking: (bookingId) => {
                const booking = get().bookings.find(b => b.id === bookingId);
                if (!booking) return;

                set((state) => ({
                    bookings: state.bookings.filter((b) => b.id !== bookingId),
                    events: state.events.map((e) =>
                        e.id === booking.eventId
                            ? { ...e, bookedCount: e.bookedCount - (booking.attendeeCount || 1) }
                            : e
                    ),
                }));
            },

            getEventById: (id) => get().events.find((event) => event.id === id),

            getUserBookings: (userId) =>
                get().bookings.filter((booking) => booking.userId === userId),
        }),
        {
            name: 'event-storage',
        }
    )
);

// Dummy data generator
function generateDummyData() {
    const locations = ['DOUALA', 'YAOUNDÉ', 'BAMENDA', 'BUEA', 'LIMBE'];
    const categories = ['CONFERENCE', 'WORKSHOP', 'CONCERT', 'SPORTS'];

    const events: Event[] = Array.from({ length: 10 }, (_, i) => {
        const daysToAdd = i * 3;
        const eventDate = new Date();
        eventDate.setDate(eventDate.getDate() + daysToAdd);

        return {
            id: `event-${i}`,
            title: `EVENT ${String.fromCharCode(65 + i)}`,
            description: `This is a sample description for Event ${String.fromCharCode(65 + i)}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
            date: eventDate.toISOString().split('T')[0],
            time: `${17 + (i % 4)}:00`,
            location: locations[i % locations.length],
            capacity: 50 + (i * 10),
            bookedCount: Math.min(20 + (i * 5), 50 + (i * 10)),
            category: categories[i % categories.length],
            createdBy: 'admin-1',
            createdAt: Date.now() - (10 - i) * 86400000,
            updatedAt: Date.now() - (10 - i) * 86400000,
            imageUri: `https://picsum.photos/300/200?random=${i}`,
        };
    });



    return { events };
}