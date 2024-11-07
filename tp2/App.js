import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import * as Location from 'expo-location';

const API_KEY = 'a963bb4dd1db05ef573fbfabdba4d02d';

export default function WeatherApp() {
  const [location, setLocation] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer la localisation de l'utilisateur
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission de localisation refusée');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
    })();
  }, []);

  // Fonction pour appeler l'API de météo une fois la localisation récupérée
  useEffect(() => {
    if (location) {
      fetchWeather();
    }
  }, [location]);

  // Fonction pour obtenir la météo actuelle et les prévisions
  const fetchWeather = async () => {
    try {
      setLoading(true);
      // Appel pour la météo actuelle
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=metric&lang=fr`
      );
      const weatherData = await weatherResponse.json();
      setCurrentWeather(weatherData);

      // Appel pour les prévisions à 5 jours
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=metric&lang=fr`
      );
      const forecastData = await forecastResponse.json();
      groupForecastByDay(forecastData.list);

      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des données météo :", error);
      setLoading(false);
    }
  };

  // Fonction pour regrouper les prévisions par jour
  const groupForecastByDay = (data) => {
    const groupedData = data.reduce((acc, item) => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' });
      
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      
      return acc;
    }, {});

    setForecast(groupedData);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement des données météo...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Affichage de la météo actuelle */}
      {currentWeather && currentWeather.main && currentWeather.weather && (
        <View style={styles.currentWeatherContainer}>
          <Text style={styles.title}>Météo actuelle</Text>
          <Text style={styles.temp}>{Math.round(currentWeather.main.temp)}°C</Text>
          <Text>{currentWeather.weather[0].description}</Text>
        </View>
      )}

      {/* Vue détaillée pour un jour */}
      {selectedDay ? (
        <View style={styles.forecastContainer}>
          <Button title="Retour" onPress={() => setSelectedDay(null)} />
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
      ) : (
        // Vue des jours regroupés
        <View style={styles.forecastContainer}>
          <Text style={styles.title}>Prévisions à 5 jours</Text>
          <FlatList
            data={Object.keys(forecast)}
            keyExtractor={(day) => day}
            renderItem={({ item: day }) => (
              <TouchableOpacity onPress={() => setSelectedDay(day)}>
                <View style={styles.forecastItem}>
                  <Text style={styles.dayText}>{day}</Text>
                  <Text style={styles.temp}>
                    {Math.round(forecast[day][0].main.temp)}°C
                  </Text>
                  <Text>{forecast[day][0].weather[0].description}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e0f7fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentWeatherContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#b2ebf2',
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  temp: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  forecastContainer: {
    marginTop: 20,
  },
  forecastItem: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#80deea',
    borderRadius: 10,
    marginBottom: 10,
  },
  forecastDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#b2ebf2',
    borderRadius: 10,
    marginVertical: 5,
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
