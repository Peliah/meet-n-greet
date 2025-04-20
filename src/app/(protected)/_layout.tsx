import { Slot, Redirect, useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { ActivityIndicator, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { useUserRole } from '@/utils/auth';
import { useEffect, useState } from 'react';

export default function ProtectedLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const role = useUserRole();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace('/sign-in');
      return;
    }

    if (role) {
      router.replace(role === 'admin' ? '/(admin)/events' : '/(client)/events');
    }
  }, [isLoaded, isSignedIn, role]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PaperProvider>
      <Slot />
    </PaperProvider>
  );
}