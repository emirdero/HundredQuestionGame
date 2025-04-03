// src/screens/InfoScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function InfoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Informasjon</Text>
      <Text style={styles.text}>
        Dette er et drikkespill med 100 spørsmål fordelt på 10 temaer.
      </Text>
      <Text style={styles.text}>
        Sveip til venstre for neste spørsmål, høyre for forrige.
      </Text>
      <Text style={styles.text}>
        Trykk på skjermen for å starte et nytt tema etter drikkepausen.
      </Text>
      <Text style={styles.text}>
        Spørsmålene er av humoristisk natur, og var laget i utgangspunktet for internt bruk!
      </Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
  },
   text: {
     fontSize: 16,
     textAlign: 'center',
     marginBottom: 10,
     color: '#FFFFFF',
   }
});