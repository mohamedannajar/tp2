import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, ImageBackground } from 'react-native';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import WeatherHeader from './components/WeatherHeader';
import ForecastList from './components/ForecastList';
import ForecastDetail from './components/ForecastDetail';
import Loader from './components/Loader';

const API_KEY = 'a963bb4dd1db05ef573fbfabdba4d02d';

export default function WeatherApp() {
  const [location, setLocation] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
    })();
  }, []);

  useEffect(() => {
    if (location) fetchWeather();
  }, [location]);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=metric&lang=fr`);
      const weatherData = await weatherResponse.json();
      setCurrentWeather(weatherData);

      const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=metric&lang=fr`);
      const forecastData = await forecastResponse.json();
      groupForecastByDay(forecastData.list);

      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des données météo :", error);
      setLoading(false);
    }
  };

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

  // Déterminer l'image en fonction du temps actuel
  const getBackgroundImage = () => {
    if (!currentWeather) return;

    const weatherCondition = currentWeather.weather[0].main.toLowerCase();

    switch (weatherCondition) {
      case 'clear':
        return require('./assets/Sunny.jpg'); // Image ensoleillée
      case 'rain':
        return require('./assets/rain.jpg'); // Image de pluie
      case 'clouds':
        return require('./assets/cloudy.jpg'); // Image nuageuse
      case 'snow':
        return require('./assets/snow.jpg'); // Image de neige
      default:
        return require('./assets/default.jpg'); // Image par défaut
    }
  };

  if (loading) return <Loader />;

  return (
    <ImageBackground
      source={getBackgroundImage()} // Récupère l'image en fonction de la météo
      style={styles.background}
    >
      <SafeAreaView style={styles.safeAreaContainer}>
        <StatusBar style="dark" />
        <View style={styles.container}>
          {currentWeather && <WeatherHeader currentWeather={currentWeather} />}
          {selectedDay ? (
            <ForecastDetail forecast={forecast} selectedDay={selectedDay} onBack={() => setSelectedDay(null)} />
          ) : (
            <ForecastList forecast={forecast} onDaySelect={setSelectedDay} />
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: { flex: 1, backgroundColor: 'transparent' },
  container: { flex: 1, padding: 20 },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
});
