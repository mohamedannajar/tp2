import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const ForecastList = ({ forecast, onDaySelect }) => {
  const days = Object.keys(forecast);

  return (
    <View style={styles.forecastContainer}>
      {days.slice(0, 5).map((day) => {
        const dayForecast = forecast[day][0]; // Prendre le premier élément pour chaque jour

        // Icône correspondante à l'état météo
        const iconCode = dayForecast.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        // Déterminer la couleur du fond en fonction du temps
        let iconBackgroundColor;
        let iconBorderColor = 'transparent'; // Définir par défaut la couleur de la bordure comme transparente
        let iconSize = 40;  // Taille par défaut de l'icône

        const weatherMain = dayForecast.weather[0].main;

        if (weatherMain === 'Clear') {
          iconBackgroundColor = '#333'; // Fond plus foncé pour ensoleillé
          iconBorderColor = '#FFD700'; // Bordure jaune pour le soleil
          iconSize = 45;  // Augmenter légèrement la taille pour la journée ensoleillée
        } else if (weatherMain === 'Clouds') {
          iconBackgroundColor = '#B0C4DE'; // Gris clair pour nuageux
        } else if (weatherMain === 'Rain') {
          iconBackgroundColor = '#00BFFF'; // Bleu clair pour la pluie
        } else if (weatherMain === 'Snow') {
          iconBackgroundColor = '#ADD8E6'; // Bleu pâle pour neige
        } else {
          iconBackgroundColor = '#D3D3D3'; // Gris pour d'autres conditions
        }

        return (
          <TouchableOpacity key={day} style={styles.forecastItem} onPress={() => onDaySelect(day)}>
            <Text style={styles.dayText} numberOfLines={1} ellipsizeMode="tail">{day}</Text>
            <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
              {/* Pour le soleil, ajouter un cercle jaune autour de l'icône */}
              {weatherMain === 'Clear' && (
                <View style={[styles.sunIcon, { borderColor: iconBorderColor, width: iconSize, height: iconSize }]}>
                  <Image source={{ uri: iconUrl }} style={styles.weatherIcon} />
                </View>
              )}
              {/* Pour les autres conditions, afficher l'icône sans modification */}
              {weatherMain !== 'Clear' && (
                <Image source={{ uri: iconUrl }} style={styles.weatherIcon} />
              )}
            </View>
            <Text style={styles.tempText}>{Math.round(dayForecast.main.temp)}°C</Text>

            {/* Bouton "Voir les détails" */}
            <TouchableOpacity style={styles.detailsButton} onPress={() => onDaySelect(day)}>
              <Text style={styles.detailsButtonText}>Voir les détails</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  forecastContainer: {
    flexDirection: 'row',  // Affichage en ligne
    flexWrap: 'wrap',      // Permet aux éléments de passer à la ligne suivante si nécessaire
    justifyContent: 'center', // Centrer les éléments sur l'écran
    marginTop: 20,
  },
  forecastItem: {
    width: 140,            // Largeur agrandie pour donner plus d'espace
    height: 160,           // Hauteur ajustée pour maintenir un carré parfait
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Fond gris clair
    borderRadius: 10,      // Coins arrondis
    marginBottom: 10,      // Espacement entre les éléments
    marginHorizontal: 10,  // Espacement horizontal entre les éléments
    padding: 10,           // Ajouter du padding pour espacer le contenu
  },
  dayText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,          // Taille du texte pour le jour
    color: '#333',         // Couleur du texte
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,    // Espacement entre l'icône et le texte
    shadowColor: '#000',  // Ombre pour un effet de profondeur
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  sunIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50, // Cercle autour de l'icône du soleil
    padding: 5,       // Ajouter de l'espace autour de l'icône
    borderWidth: 3,   // Bordure jaune pour l'icône du soleil
  },
  weatherIcon: {
    width: 40,         // Taille de l'icône (ajustée pour une meilleure visibilité)
    height: 40,        // Taille de l'icône
    borderRadius: 50,  // Rendre l'icône ronde
  },
  tempText: {
    fontSize: 14,
    textAlign: 'center',
  },
  detailsButton: {
    marginTop: 10,      // Espacement entre la température et le bouton
    paddingVertical: 5, // Padding vertical
    paddingHorizontal: 15, // Padding horizontal pour un bouton plus large
    backgroundColor: '#005f73', // Bleu foncé pour le bouton
    borderRadius: 5,    // Coins arrondis
  },
  detailsButtonText: {
    color: '#fff',      // Texte en blanc
    fontWeight: 'bold', // Texte en gras
  },
});

export default ForecastList;
