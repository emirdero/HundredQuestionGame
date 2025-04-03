// src/screens/SelectionScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { questionSets } from '../data/questions';

export default function SelectionScreen({ navigation }) {
  const handleSelectSet = (set) => {
    navigation.navigate('Game', { selectedSet: set });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Velg Spørsmålsett</Text>
      {questionSets.map((set) => (
        <View key={set.id} style={styles.buttonContainer}>
          <Button
            title={set.name}
            onPress={() => handleSelectSet(set)}
          />
        </View>
      ))}
      {/* Add more buttons if you have more sets */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  buttonContainer: {
    marginVertical: 10,
    width: '90%',
  },
});