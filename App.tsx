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
import moment from "moment";
import getEnvVars from "./environment";
interface Props {
  [key: string]: keyof typeof MaterialCommunityIcons.glyphMap;
}

interface Colors {
  [key: string]: string;
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

const backgrounds: Colors = {
  Atmosphere: "#E1E1E1",
  Clear: "#00CCFF",
  Clouds: "#B7B7B7",
  Drizzle: "#BBD6B8",
  Rain: "#9384D1",
  Snow: "#FDE2F3",
  Thunderstorm: "#7C96AB",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState<any[]>([]);
  const [mainWeather, setMainWeather] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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
      setMainWeather(days.map((day) => day.weather[0].main));
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
    <View
      style={[
        styles.container,
        { backgroundColor: backgrounds[mainWeather[currentIndex]] },
      ]}
    >
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        showsHorizontalScrollIndicator={true}
        horizontal
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x /
              event.nativeEvent.layoutMeasurement.width
          );
          setCurrentIndex(index);
        }}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large" />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.date}>
                {moment.unix(day.dt).format("MMM Do")}
              </Text>
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
  },
  city: {
    flex: 0.7,
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
    alignItems: "center",
  },
  temperature: {
    fontSize: 108,
    fontWeight: "800",
    marginBottom: -20,
  },
  date: {
    fontSize: 36,
    fontWeight: "600",
    margin: 20,
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
