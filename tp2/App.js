import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, Button, Image, SafeAreaView } from 'react-native';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';

const API_KEY = 'a963bb4dd1db05ef573fbfabdba4d02d';

export default function WeatherApp() {
  const [location, setLocation] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour obtenir la localisation du téléphone
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

  // Fonction pour appeler l'API de météo une fois la localisation obtenue
  useEffect(() => {
    if (location) {
      fetchWeather();
    }
  }, [location]);

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
      <SafeAreaView style={styles.safeAreaContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement des données météo...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Affichage de la météo actuelle */}
        {currentWeather && currentWeather.main && currentWeather.weather && (
          <View style={styles.currentWeatherContainer}>
            <Text style={styles.title}>Météo actuelle</Text>
            
            {/* Nom de la ville */}
            <Text style={styles.city}>{currentWeather.name}</Text>
            
            {/* Température */}
            <Text style={styles.temp}>{Math.round(currentWeather.main.temp)}°C</Text>

            {/* Description de la météo */}
            <Text>{currentWeather.weather[0].description}</Text>

            {/* Icône de la météo */}
            <Image
              source={{
                uri: `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`
              }}
              style={styles.weatherIcon}
            />
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
          // Vue des jours regroupés avec bouton "Détails"
          <FlatList
            contentContainerStyle={styles.forecastContainer}
            ListHeaderComponent={() => (
              <Text style={styles.title}>Prévisions à 5 jours</Text>
            )}
            data={Object.keys(forecast)}
            keyExtractor={(day) => day}
            renderItem={({ item: day }) => (
              <View style={styles.forecastItem}>
                <Text style={styles.dayText}>{day}</Text>
                <Text style={styles.temp}>
                  {Math.round(forecast[day][0].main.temp)}°C
                </Text>
                <Text>{forecast[day][0].weather[0].description}</Text>

                {/* Bouton pour voir les détails du jour */}
                <TouchableOpacity 
                  style={styles.detailsButton} 
                  onPress={() => setSelectedDay(day)}
                >
                  <Text style={styles.detailsButtonText}>Détails</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#e0f7fa',
  },
  container: {
    flex: 1,
    padding: 20,
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
  city: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  coords: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  temp: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weatherIcon: {
    width: 50,
    height: 50,
    marginTop: 10,
  },
  forecastContainer: {
    marginTop: 20,
    paddingBottom: 20,  // Padding pour le bas de la liste afin d'avoir de l'espace
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
  detailsButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#00796b',
    borderRadius: 5,
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
