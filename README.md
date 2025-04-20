# Meet-n-Greet

Meet-n-Greet is a mobile application built with React Native and Expo that enables users to view and book events while providing administrators with event management capabilities.

## Features

### Client Features
- Browse upcoming events
- View event details (time, location, description)
- Book tickets for events
- Manage bookings

### Admin Features
- Create, read, update, and delete events
- View booking information for events
- Manage event details

## Installation

1. Clone the repository:
```
git clone https://github.com/Peliah/meet-n-greet.git
cd meet-n-greet
```

2. Create a Clerk account and set up a project for Expo:
   - Visit [clerk.dev](https://clerk.dev/) and create an account
   - Create a new Clerk project configured for Expo
   - Copy your API keys

3. Create a `.env` file in the root directory and add your Clerk keys:
```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
```

4. Install dependencies and start the development server:
```
npm install
npm start
```

5. Follow the Expo CLI instructions to run the app on your preferred device or emulator.

## Architecture

### Technology Stack
- **Frontend**: React Native with Expo
- **Routing**: Expo Router
- **Authentication**: Clerk
- **State Management**: Zustand
- **Form Validation**: Zod with React Hook Form

### Directory Structure
```
meet-n-greet/
├── app/                   # Main Expo Router directory
│   ├── (auth)/            # Authentication-related screens
│   ├── (protected)/       # Protected routes requiring authentication
│   │   ├── (admin)/       # Admin-only screens
│   │   └── (client)/      # Client-only screens
│   └── constants/         # Application constants
├── components/            # Shared UI components
├── hooks/                 # Custom hooks
├── store/                 # Zustand store definitions
├── utils/                 # Utility functions
└── types/                 # TypeScript type definitions
```

### Data Management
The application uses Zustand for state management, which provides a lightweight and straightforward way to manage application state. All app data, including events and bookings, are stored in the Zustand store, making it easily accessible throughout the application.

### Admin/Client Separation
The separation between admin and client functionalities is implemented using a combination of Clerk's user metadata and Expo Router's route grouping:
- During account creation, users select whether they want to be an admin or client
- This choice is stored in the `publicMetadata` field of the Clerk user object
- The app uses route groups with `(protected)` as the parent group containing nested `(admin)` and `(client)` route groups
- This structure ensures authenticated users only access routes appropriate for their role
- Navigation between screens is handled seamlessly through Expo Router
- This approach ensures clean separation of concerns between admin and client interfaces while using the same codebase

## Libraries & Tools

- **React Native**: Cross-platform mobile framework for building native mobile apps
- **Expo**: Platform for developing and deploying React Native applications with ease
- **Expo Router**: File-based routing solution for Expo applications with support for route grouping
- **Clerk**: Authentication provider with built-in user management
- **Zustand**: Lightweight state management library offering simplicity over Redux complexity
- **Zod**: Schema validation library for TypeScript
- **React Hook Form**: Form handling library for React, used with Zod for form validation

## Development Considerations

### Assumptions & Simplifications
- Data persistence is currently handled in-memory with Zustand rather than using a backend database
- The application assumes a stable internet connection for authentication
- The admin/client role selection is simplified to a choice during account creation
- Event images are stored as URLs rather than being uploaded directly

### Justification for Technical Choices
As a mid-level developer, I chose this tech stack for the following reasons:

- **React Native with Expo**: Provides rapid development and cross-platform compatibility without having to write platform-specific code
- **Clerk**: Offers robust authentication with minimal setup effort compared to custom auth solutions
- **Zustand**: Chosen over Redux for its simplicity and reduced boilerplate while maintaining powerful state management capabilities
- **Zod with React Hook Form**: Provides strong type safety and validation with minimal configuration
- **Expo Router**: File-based routing with route grouping simplifies navigation setup and protection of routes based on authentication status and user roles
