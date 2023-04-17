import { View, Text, StyleSheet } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>London</Text>
      </View>
      <View style={styles.weather}>
        <View style={styles.day}>
          <Text style={styles.temperature}>12</Text>
          <Text style={styles.description}>Cloudy</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  city: {
    flex: 1.2,
    backgroundColor: "#FCEDDA",
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 60,
    fontWeight: "800",
    marginTop: 40,
  },
  weather: {
    flex: 3,
    backgroundColor: "#EE4E34",
  },
  day: {
    flex: 1,
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
