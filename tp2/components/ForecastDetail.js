import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';

export default function ForecastDetail({ forecast, selectedDay, onBack }) {
  return (
    <View style={styles.forecastContainer}>
      <Button title="Retour" onPress={onBack} />
      <Text style={styles.title}>{selectedDay}</Text>
      <FlatList
        data={forecast[selectedDay]}
        keyExtractor={(item) => item.dt.toString()}
        renderItem={({ item }) => (
          <View style={styles.forecastDetailItem}>
            <Text>{new Date(item.dt * 1000).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}</Text>
            <Text style={styles.temp}>{Math.round(item.main.temp)}°C</Text>
            <Text>{item.weather[0].description}</Text>
          </View>
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  forecastContainer: { marginTop: 20, paddingBottom: 20 },
  forecastDetailItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: '#b2ebf2', borderRadius: 10, marginVertical: 5 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  temp: { fontSize: 18, fontWeight: 'bold' },
});
