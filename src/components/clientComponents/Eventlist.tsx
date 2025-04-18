import React from 'react';
import { FlatList, StyleSheet, RefreshControl, ListRenderItemInfo } from 'react-native';
import { EventCard } from './EventCard';
import { Event } from '@/types';
import { neoStyles } from '@/app/constants/neoStyles';

interface EventsListProps {
  events: Event[];
  refreshing: boolean;
  onRefresh: () => void;
}

export function EventsList({ events, refreshing, onRefresh }: EventsListProps): React.JSX.Element {
  const renderItem = ({ item }: ListRenderItemInfo<Event>): React.JSX.Element => (
    <EventCard event={item} />
  );

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: neoStyles.padding * 2,
  },
});