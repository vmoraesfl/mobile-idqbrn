import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    Pressable,
} from "react-native";

import MapView, {Circle, Marker} from "react-native-maps";
import * as Location from 'expo-location';

import {DiseasesService} from "../services";
import {MaterialIcons} from "@expo/vector-icons";

export default function Home() {
  const [markers, setMarkers] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [diseasesWithCities, setDiseasesWithCities] = useState([]);
  const [filteredDiseasesWithCities, setFilteredDiseasesWithCities] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedDisease, setSelectedDisease] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

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

  const loadDiseasesWithCities = async () => {
        const response = await DiseasesService.diseasesWithCities()
        setDiseasesWithCities(response.data)
    }

  const loadDiseases = async () => {
        const response = await DiseasesService.diseases()
        setDiseases(response.data)
    }

  useEffect(() => {
    loadDiseases();

    loadDiseasesWithCities();
  }, []);

  useEffect(() => {
      setFilteredDiseasesWithCities(diseasesWithCities)
  }, [diseasesWithCities])

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

        <FlatList
            data={diseasesWithCities}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
            contentContainerStyle={{alignItems: "center"}}
            style={{marginTop: 20}}
            ListHeaderComponent={() => (
                <TouchableOpacity
                    onPress={() => setFilteredDiseasesWithCities(diseasesWithCities)}
                    style={[
                        styles.filterButton,
                        {marginRight: 10},
                        filteredDiseasesWithCities.length === diseasesWithCities.length ? styles.selectedFilter : {}]}
                >
                    { filteredDiseasesWithCities.length === diseasesWithCities.length &&
                        <MaterialIcons name={"check"} size={12} style color={"#fff"}/>
                    }
                    <Text style={filteredDiseasesWithCities.length === diseasesWithCities.length
                        ? styles.selectedFilter
                        : {}}
                    >Todas</Text>
                </TouchableOpacity>
            )}
            renderItem={({item}) => (
                <TouchableOpacity
                    onPress={() => {
                        let newFilter = filteredDiseasesWithCities.length === diseasesWithCities.length
                            ? []
                            : [...filteredDiseasesWithCities]

                        if (newFilter.includes(item)) {
                          newFilter = newFilter.filter(disease => disease.id !== item.id)
                        } else {
                          newFilter.push(item)
                        }

                        setFilteredDiseasesWithCities(newFilter)
                    }}
                    style={[
                        styles.filterButton,
                        filteredDiseasesWithCities.includes(item) && filteredDiseasesWithCities.length !== diseasesWithCities.length
                            ? styles.selectedFilter
                            : {}
                    ]}
                    key={item.id}
                >
                    { filteredDiseasesWithCities.includes(item) && filteredDiseasesWithCities.length !== diseasesWithCities.length &&
                        <MaterialIcons name={"check"} size={12} style color={"#fff"}/>
                    }
                    <Text style={filteredDiseasesWithCities.includes(item) && filteredDiseasesWithCities.length !== diseasesWithCities.length
                        ? styles.selectedFilter
                        : {}}
                    >{item.name}</Text>
                </TouchableOpacity>
            )}
        />
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 9.22,
          longitudeDelta: 4.21,
        }}
      >
          {location &&
              <Marker
                  coordinate={location.coords}
                  icon={require("../../assets/man2.png")}
              ></Marker>
          }

        {filteredDiseasesWithCities.map((disease) => {
            return disease.cities.map(({name, state, latitude, longitude}) => (
                <Circle
                    key={name + "-" + state + "-" + disease.name}
                    center={{latitude, longitude}}
                    radius={20000}
                    fillColor={"#FF39337D"}
                    strokeColor={"#FF39337D"}
                />
            ))
        })}
      </MapView>

      {modalVisible &&
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{selectedDisease.nome}</Text>
                <Text style={styles.subTitle}>
                  PREVENÇÃO
                </Text>
                <Text>{selectedDisease.prevencao}</Text>
                <Text style={styles.subTitle}>
                  TRATAMENTO
                </Text>
                <Text>{selectedDisease.tratamento}</Text>
              </View>
              <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.categoryText}>Voltar</Text>
              </Pressable>
            </View>
            </View>
          </Modal>

      }
    
      <View style={styles.bottomContainer}>
        <Text style={styles.subTitle}>
          Saiba como se proteger
        </Text>
      </View>
      <View style={styles.categoryContainer}>
        <FlatList
          data={diseases}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          contentContainerStyle={{
            alignItems: "center",
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setFilter(filter === item.id ? "" : item.id);
                setModalVisible(!modalVisible);
                setSelectedDisease(item);
              }}
              style={[
                styles.categoryItem,
                filter === item.id ? styles.selectedCategory : null,
              ]}
              key={item.id}
            >
              <Text style={styles.categoryText}>{item.nome}</Text>
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
    padding: 15,
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  bottomContainer: {
    padding: 5,
    paddingTop: 15,
  },
  textContainer: {
    alignSelf: 'stretch',
    padding: 15,
    margin:5,

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
  centeredView: {
    flex:1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "#f0f0f5",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 15,
    margin:10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "#f0f0f5",
  },
  filterButton: {
    alignItems: 'center',
    backgroundColor: "#f0f0f5",
    borderRadius: 20,
    display: 'flex',
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  selectedFilter: {
    backgroundColor: "#999",
    color: "#fff"
  }
});