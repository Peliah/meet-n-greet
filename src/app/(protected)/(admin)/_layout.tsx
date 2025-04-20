import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '@/app/constants/neoStyles'

function TabLabel({ focused, children }) {
    return (
        <View
            style={[
                styles.tabLabel,
                focused ? styles.tabLabelActive : null,
                focused ? SHADOWS.neoBrutalism : null
            ]}
        >
            <Text
                style={[
                    styles.tabLabelText,
                    focused ? styles.tabLabelTextActive : null
                ]}
            >
                {children}
            </Text>
        </View>
    );
}

export default function AdminTabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.inactive,
                tabBarStyle: styles.tabBar,
                headerStyle: styles.header,
                headerTitleStyle: styles.headerTitle,
                headerShadowVisible: false,
                //   unmountOnBlur: true
            }}
        // initialRouteName="events"
        >
            <Tabs.Screen
                name="index"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="events"
                options={{
                    title: 'Events',
                    headerTitle: 'MANAGE EVENTS',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={[styles.iconContainer, focused ? styles.iconContainerActive : null, focused ? SHADOWS.neoBrutalism : null]}>
                            <MaterialIcons name="event" size={size} color={focused ? COLORS.black : color} />
                        </View>
                    ),
                    tabBarLabel: ({ focused }) => <TabLabel focused={focused}>Events</TabLabel>,
                }}
            />

            <Tabs.Screen
                name="create"
                options={{
                    title: 'Create',
                    headerTitle: 'CREATE EVENT',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={[styles.iconContainer, focused ? styles.iconContainerActive : null, focused ? SHADOWS.neoBrutalism : null]}>
                            <MaterialIcons name="add-circle" size={size} color={focused ? COLORS.black : color} />
                        </View>
                    ),
                    tabBarLabel: ({ focused }) => <TabLabel focused={focused}>Create</TabLabel>,
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    headerTitle: 'ADMIN PROFILE',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={[styles.iconContainer, focused ? styles.iconContainerActive : null, focused ? SHADOWS.neoBrutalism : null]}>
                            <MaterialIcons name="person" size={size} color={focused ? COLORS.black : color} />
                        </View>
                    ),
                    tabBarLabel: ({ focused }) => <TabLabel focused={focused}>Profile</TabLabel>,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        height: 80,
        backgroundColor: COLORS.background,
        borderTopWidth: 3,
        borderTopColor: COLORS.black,
        paddingTop: 8,
    },
    iconContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    iconContainerActive: {
        backgroundColor: COLORS.primary,
        borderWidth: 3,
        borderColor: COLORS.black,
    },
    tabLabel: {
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    tabLabelActive: {
        backgroundColor: COLORS.primary,
        borderWidth: 3,
        borderColor: COLORS.black,
    },
    tabLabelText: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.inactive,
    },
    tabLabelTextActive: {
        color: COLORS.black,
        fontWeight: '900',
    },
    header: {
        backgroundColor: COLORS.primary,
        borderBottomWidth: 3,
        borderBottomColor: COLORS.black,
        height: 100,
    },
    headerTitle: {
        fontWeight: '900',
        fontSize: 24,
        letterSpacing: -0.5,
        color: COLORS.black,
    },
});