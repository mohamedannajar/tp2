import React from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ForecastList({ forecast, onDaySelect }) {
  return (
    <FlatList
      contentContainerStyle={styles.forecastContainer}
      ListHeaderComponent={() => <Text style={styles.title}>Prévisions à 5 jours</Text>}
      data={Object.keys(forecast)}
      keyExtractor={(day) => day}
      renderItem={({ item: day }) => (
        <View style={styles.forecastItem}>
          <Text style={styles.dayText}>{day}</Text>
          <Text style={styles.temp}>{Math.round(forecast[day][0].main.temp)}°C</Text>
          <Text>{forecast[day][0].weather[0].description}</Text>
          <TouchableOpacity style={styles.detailsButton} onPress={() => onDaySelect(day)}>
            <Text style={styles.detailsButtonText}>Détails</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}


const styles = StyleSheet.create({
  forecastContainer: { marginTop: 20, paddingBottom: 20 },
  forecastItem: { alignItems: 'center', padding: 10, backgroundColor: '#80deea', borderRadius: 10, marginBottom: 10 },
  dayText: { fontSize: 16, fontWeight: 'bold' },
  temp: { fontSize: 18, fontWeight: 'bold' },
  detailsButton: { marginTop: 10, paddingVertical: 5, paddingHorizontal: 15, backgroundColor: '#00796b', borderRadius: 5 },
  detailsButtonText: { color: '#fff', fontWeight: 'bold' },
});
