import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';

export default function ThemeScreen({ route, navigation }) {
  const { selectedSet } = route.params;

  const handleSelectTheme = (theme) => {
    navigation.navigate('Game', { selectedSet, selectedTheme: theme });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Velg Tema</Text>
      {selectedSet.themes.map((theme, idx) => (
        <View key={theme.name} style={styles.buttonContainer}>
          <Button
            title={theme.name}
            onPress={() => handleSelectTheme(theme)}
            color="#1e90ff"
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#fff',
  },
  buttonContainer: {
    marginVertical: 10,
    width: '90%',
  },
});
