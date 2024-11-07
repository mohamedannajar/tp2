import React from 'react';
import { ActivityIndicator, Text, SafeAreaView, StyleSheet } from 'react-native';

export default function Loader() {
  return (
    <SafeAreaView style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Chargement des données météo...</Text>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
