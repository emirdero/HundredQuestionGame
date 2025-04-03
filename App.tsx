// App.js
import 'react-native-gesture-handler'; // Must be at the top
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Import this
import { StatusBar } from 'expo-status-bar';


export default function App() {
  return (
    // Wrap entire app in GestureHandlerRootView
    <GestureHandlerRootView style={{ flex: 1 }}>
        <AppNavigator />
        <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}