import {
  View,
  ScrollView,
  Dimensions,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import getEnvVars from "./environment";
interface Props {
  [key: string]: keyof typeof MaterialCommunityIcons.glyphMap;
}

const { API_KEY } = getEnvVars();
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const icons: Props = {
  Atmosphere: "weather-fog",
  Clear: "white-balance-sunny",
  Clouds: "weather-cloudy",
  Drizzle: "weather-rainy",
  Rain: "weather-pouring",
  Snow: "weather-snowy-heavy",
  Thunderstorm: "weather-lightning",
};

// const clothing = {
//   "-5": "",
//   "0": "",
//   "4": "",
// };

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState<any[]>([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    if (location) {
      setCity(location[0].city as string);
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&appid=${API_KEY}&units=metric`
      );
      const json = await response.json();
      setDays(json.daily);
    }
  };
  useEffect(() => {
    getWeather();
  }, []);

  if (!ok) {
    return (
      <View style={styles.day}>
        <Text style={styles.description}>
          Sorry, This app needs a permission to get your location 🥺
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        horizontal
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large" />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <MaterialCommunityIcons
                name={icons[day.weather[0].main]}
                size={48}
                color="black"
              />
              <Text style={styles.temperature}>{parseInt(day.temp.day)}°C</Text>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.detail}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#43B0F1",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 60,
    fontWeight: "800",
    marginTop: 40,
  },
  day: {
    width: SCREEN_WIDTH,
    marginTop: 50,
    alignItems: "center",
  },
  temperature: {
    fontSize: 108,
    fontWeight: "800",
    marginBottom: -20,
  },
  description: {
    fontSize: 48,
    fontWeight: "300",
  },
  detail: {
    fontSize: 20,
    fontWeight: "300",
  },
});
