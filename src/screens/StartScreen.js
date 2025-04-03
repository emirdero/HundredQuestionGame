// src/screens/StartScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function StartScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>100 Spørsmål</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Start Spill"
          onPress={() => navigation.navigate('Selection')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Informasjon"
          onPress={() => navigation.navigate('Info')}
          color="#841584" // Optional: different color
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
  },
});