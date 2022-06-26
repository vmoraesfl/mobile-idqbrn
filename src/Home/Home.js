import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator, Button,
} from "react-native";

import MapView, {Circle, Heatmap, Marker} from "react-native-maps";
import * as Location from 'expo-location';

import {DiseasesService} from "../services";

export default function Home() {
  const [markers, setMarkers] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [filter, setFilter] = useState("");

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const navigation = useNavigation();
  const data = [
    {
        "id": 3,
        "name": "LEISHMANIOSE TEGUMENTAR",
        "cities": [
            {
                "id": 79,
                "name": "Águia Branca",
                "state": "ES",
                "latitude": -18.9846,
                "longitude": -40.7437,
                "cases": {
                    "id": 78,
                    "total": 1
                }
            }
        ]
    },
    ];
  /* const filteredData = markers.filter((m) => m.category === filter); */

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  useEffect(() => {
      (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
              setErrorMsg('Permission to access location was denied');
              return;
          }

          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
      })();
  }, [])

    const loadDiseases = async () => {
        const response = await DiseasesService.diseasesWithCities()
        setDiseases(response.data)
    }

  useEffect(() => {
    setMarkers(data);

    let text = 'Waiting..';
    if (errorMsg) {
    text = errorMsg;
    } else if (location) {
    text = JSON.stringify(location);
    }

    loadDiseases();
  }, []);

  if (!location || location.length === 0) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>IDQBRN</Text>
        <Text style={styles.subTitle}>
          Veja as doenças mais comuns próximas a você
        </Text>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          //latitude: -15.47,
          //longitude: -47.54,
          latitudeDelta: 0.922,
          longitudeDelta: 0.421,
        }}
      >
        {(filter ? filteredData : diseases).map((disease) => {
            return disease.cities.map(({name, latitude, longitude, cases}) => (
                <Circle
                    key={name + "-" + disease.name}
                    center={{latitude, longitude}}
                    radius={20000}
                    fillColor={"#FF39337D"}
                    strokeColor={"#FF39337D"}/>
            ))
        })}
      </MapView>
    
      <View style={styles.headerContainer}>
        <Text style={styles.subTitle}>
          Saiba como se proteger
        </Text>
      </View>
      <View style={styles.categoryContainer}>
          <FlatList
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          contentContainerStyle={{
            alignItems: "center",
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                //setFilter(filter === item.key ? "" : item.key);
              }}
              style={[
                styles.categoryItem,
                //filter === item.key ? styles.selectedCategory : null,
              ]}
              key={item.name}
            >
              {/* <Image style={styles.categoryImage} source={item.image} />
              <Text style={styles.categoryText}>{item.label}</Text> */}
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    padding: 20,
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  title: {
    fontSize: 24,
    fontWeight: "400",
    color: "#322153",
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6c6c80",
  },
  map: {
    flex: 1,
  },
  categoryContainer: {
    padding: 10,
  },
  categoryItem: {
    height: 110,
    backgroundColor: "#f0f0f5",
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  categoryImage: {
    width: 50,
    height: 50,
  },
  categoryText: {
    textAlign: "center",
    color: "#6c6c80",
  },
  selectedCategory: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#322153",
  },
});