// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import StartScreen from '../screens/StartScreen';
import SelectionScreen from '../screens/SelectionScreen';
import GameScreen from '../screens/GameScreen';
import InfoScreen from '../screens/InfoScreen';
import ThemeScreen from '../screens/ThemeScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            {/* ADDED: screenOptions for dark header */}
            <Stack.Navigator
                initialRouteName="Start"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#111111', // Dark header background
                    },
                    headerTintColor: '#FFFFFF', // White title and back button
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                     headerBackTitleVisible: false, // Hide back button text if desired
                }}
            >
                <Stack.Screen
                    name="Start"
                    component={StartScreen}
                    options={{ title: 'Velkommen' }}
                />
                <Stack.Screen
                    name="Selection"
                    component={SelectionScreen}
                    options={{ title: 'Velg Sett' }}
                />
                <Stack.Screen
                    name="Game"
                    component={GameScreen}
                    options={({ route }) => ({
                        title: route.params?.selectedSet?.name || 'Spillet',
                        // headerBackTitle: 'Tilbake', // Back title color handled by headerTintColor now
                    })}
                />
                <Stack.Screen
                    name="Info"
                    component={InfoScreen}
                    options={{ title: 'Informasjon' }}
                />
                <Stack.Screen
                    name="Theme"
                    component={ThemeScreen}
                    options={{ title: 'Velg Tema' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}