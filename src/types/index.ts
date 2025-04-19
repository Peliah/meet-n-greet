
export interface User {
    id: string;
    username: string;
    role: 'admin' | 'client';
    email?: string;
    name?: string;
    createdAt: number;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    capacity: number;
    bookedCount: number;
    imageUri?: string;
    category?: string;
    createdBy: string;
    createdAt: number;
    updatedAt: number;
}

export interface Booking {
    id: string;
    eventId: string;
    userId?: string;
    status: 'confirmed' | 'cancelled' | 'pending';
    bookingDate: number;
    attendeeCount?: number;
    notes?: string;
}

export interface EventFilters {
    category: string | null;
    fromDate: string | null;
    toDate: string | null;
    location: string | null;
}

export interface BookingWithEvent extends Booking {
    event: {
        title: string;
        date: string;
        location: string;
        imageUri?: string;
    };
}