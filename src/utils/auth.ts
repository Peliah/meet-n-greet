import { useAuth, useUser } from "@clerk/clerk-expo";
import { useState, useEffect, useCallback } from "react";

type Role = 'admin' | 'client';

export const useUserRole = (): Role | null => {
    const { user } = useUser();
    const { isLoaded } = useAuth();
    const [role, setRole] = useState<Role | null>(null);

    const fetchRole = useCallback(async () => {
        if (!isLoaded || !user) {
            setRole(null);
            return;
        }

        try {
            // Access role directly from user publicMetadata
            const userRole = user.publicMetadata?.role as Role;
            setRole(userRole || 'client');
        } catch (error) {
            console.error('Error fetching role:', error);
            setRole(null);
        }
    }, [user, isLoaded]);

    useEffect(() => {
        fetchRole();
    }, [fetchRole]);

    return role;
};