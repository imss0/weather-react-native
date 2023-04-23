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

const clothes = {
  above_28: "Sleeveless, short-sleeved, shorts",
  below_28: "Short-sleeved, thin long-sleeved, shorts, trousers",
  below_23: "Thin cardigans, long-sleeved, trousers, jeans",
  below_20:
    "Thin jumper, thin cardigans, thin jackets, sweatshirts, windbreakers, trousers, jeans",
  below_17:
    "Jackets, cardigans, field jackets, jumper, sweatshirts, fleece hoodies, jeans, trousers",
  below_12: "Jackets, field jackets, jumpers, trench coats, jeans, trousers",
  below_9:
    "Coats, wool coats, leather jackets, fleeces, thermal underwear, jumper, jeans, thick trousers",
  below_4:
    "Padded jackets, thick coats, quilted jackets, thermal underwear, fleece pants, scarves, gloves",
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
              <View style={styles.temperatureContainer}>
                <Text style={styles.temperature}>
                  {parseInt(day.temp.day)}°C
                </Text>
                <View>
                  <Text style={styles.detail}>
                    MIN {parseInt(day.temp.min)}°C
                  </Text>
                  <Text style={styles.detail}>
                    MAX {parseInt(day.temp.max)}°C
                  </Text>
                </View>
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.detail}>{day.weather[0].description}</Text>
              <Text
                style={{
                  ...styles.clothing,
                  textDecorationLine: "underline",
                  marginTop: 40,
                }}
              >
                What to wear
              </Text>
              {(!day.temp.day && (
                <Text style={styles.clothing}>loading data.... 🥺</Text>
              )) ||
                (day.temp.day < 4 && (
                  <Text style={styles.clothing}>{clothes.below_4}</Text>
                )) ||
                (day.temp.day < 9 && (
                  <Text style={styles.clothing}>{clothes.below_9}</Text>
                )) ||
                (day.temp.day < 12 && (
                  <Text style={styles.clothing}>{clothes.below_12}</Text>
                )) ||
                (day.temp.day < 17 && (
                  <Text style={styles.clothing}>{clothes.below_17}</Text>
                )) ||
                (day.temp.day < 20 && (
                  <Text style={styles.clothing}>{clothes.below_20}</Text>
                )) ||
                (day.temp.day < 23 && (
                  <Text style={styles.clothing}>{clothes.below_23}</Text>
                )) ||
                (day.temp.day < 28 && (
                  <Text style={styles.clothing}>{clothes.below_28}</Text>
                )) ||
                (day.temp.day >= 28 && (
                  <Text style={styles.clothing}>{clothes.above_28}</Text>
                ))}
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
    fontSize: 50,
    fontWeight: "800",
    marginTop: 40,
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temperatureContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  temperature: {
    fontSize: 80,
    fontWeight: "800",
    marginBottom: -20,
    marginRight: 20,
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
    fontSize: 16,
    fontWeight: "300",
  },
  clothing: {
    marginTop: 10,
    marginHorizontal: 30,
    fontSize: 20,
  },
});
