import { View, ScrollView, Dimensions, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [location, setLocation] = useState();
  const [ok, setOk] = useState(true);
  const ask = async () => {
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
    }
  };
  useEffect(() => {
    ask();
  }, []);

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
        <View style={styles.day}>
          <Text style={styles.temperature}>12</Text>
          <Text style={styles.description}>Cloudy</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temperature}>12</Text>
          <Text style={styles.description}>Cloudy</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temperature}>12</Text>
          <Text style={styles.description}>Cloudy</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temperature}>12</Text>
          <Text style={styles.description}>Cloudy</Text>
        </View>
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
});
