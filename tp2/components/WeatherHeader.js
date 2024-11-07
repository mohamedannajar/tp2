import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function WeatherHeader({ currentWeather }) {
  return (
    <View style={styles.currentWeatherContainer}>
      <Text style={styles.title}>Météo actuelle</Text>
      <Text style={styles.city}>{currentWeather.name}</Text>
      <Text style={styles.temp}>{Math.round(currentWeather.main.temp)}°C</Text>
      <Text>{currentWeather.weather[0].description}</Text>
      <Image
        source={{ uri: `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png` }}
        style={styles.weatherIcon}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  currentWeatherContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#b2ebf2',
    borderRadius: 10,
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  city: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  temp: { fontSize: 18, fontWeight: 'bold' },
  weatherIcon: { width: 50, height: 50, marginTop: 10 },
});
