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
  ActivityIndicator,
  Modal,
  Pressable
} from "react-native";

import MapView, { Marker } from "react-native-maps";
import * as Location from 'expo-location';



export default function Home() {
  const [markers, setMarkers] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedDisease, setSelectedDisease] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const navigation = useNavigation();
  const diseasesList = [
    {
        "id": 1,
        "nome": "BOTULISMO",
        "prevencao": "n sei",
        "tratamento": "torce",
        "createdAt": "2022-06-25T03:19:41.000Z",
        "updatedAt": "2022-06-25T03:19:41.000Z"
    },
    {
        "id": 2,
        "nome": "LEISHMANIOSE VISCERAL",
        "prevencao": "mata rato",
        "tratamento": "fée",
        "createdAt": "2022-06-25T03:19:41.000Z",
        "updatedAt": "2022-06-25T03:19:41.000Z"
    },
    {
        "id": 3,
        "nome": "LEISHMANIOSE TEGUMENTAR",
        "prevencao": "mata rato tbm",
        "tratamento": "fé",
        "createdAt": "2022-06-25T03:19:41.000Z",
        "updatedAt": "2022-06-25T03:19:41.000Z"
    },
    {
        "id": 4,
        "nome": "FEBRE AMARELA",
        "prevencao": "mata mosquito",
        "tratamento": "banho gelado",
        "createdAt": "2022-06-25T03:19:41.000Z",
        "updatedAt": "2022-06-25T03:19:41.000Z"
    },
    {
        "id": 5,
        "nome": "DENGUE",
        "prevencao": "mata mosquito tbm",
        "tratamento": "",
        "createdAt": "2022-06-25T03:19:41.000Z",
        "updatedAt": "2022-06-25T03:19:41.000Z"
    },
    {
        "id": 6,
        "nome": "HEPATITE VIRAL",
        "prevencao": "",
        "tratamento": "",
        "createdAt": "2022-06-25T03:19:41.000Z",
        "updatedAt": "2022-06-25T03:19:41.000Z"
    },
    {
        "id": 7,
        "nome": "FEBRE MACULOSA",
        "prevencao": "",
        "tratamento": "",
        "createdAt": "2022-06-25T03:19:41.000Z",
        "updatedAt": "2022-06-25T03:19:41.000Z"
    },
    {
        "id": 8,
        "nome": "LEPTOSPIROSE",
        "prevencao": "",
        "tratamento": "",
        "createdAt": "2022-06-25T03:19:41.000Z",
        "updatedAt": "2022-06-25T03:19:41.000Z"
    },
    {
        "id": 9,
        "nome": "DOENÇA DE CHAGAS",
        "prevencao": "",
        "tratamento": "",
        "createdAt": "2022-06-25T03:19:41.000Z",
        "updatedAt": "2022-06-25T03:19:41.000Z"
    },
    {
        "id": 10,
        "nome": "PICADAS DE COBRAS",
        "prevencao": "",
        "tratamento": "",
        "createdAt": "2022-06-25T03:19:41.000Z",
        "updatedAt": "2022-06-25T03:19:41.000Z"
    },
    {
        "id": 11,
        "nome": "ZIKA VÍRUS",
        "prevencao": "",
        "tratamento": "",
        "createdAt": "2022-06-25T03:19:41.000Z",
        "updatedAt": "2022-06-25T03:19:41.000Z"
    },
    {
        "id": 12,
        "nome": "FEBRE TIFÓIDE",
        "prevencao": "",
        "tratamento": "",
        "createdAt": "2022-06-25T03:19:41.000Z",
        "updatedAt": "2022-06-25T03:19:41.000Z"
    },
    {
        "id": 13,
        "nome": "HANTAVIROSE",
        "prevencao": "",
        "tratamento": "",
        "createdAt": "2022-06-25T03:19:41.000Z",
        "updatedAt": "2022-06-25T03:19:41.000Z"
    },
    {
        "id": 14,
        "nome": "MENINGITE",
        "prevencao": "",
        "tratamento": "",
        "createdAt": "2022-06-25T03:19:41.000Z",
        "updatedAt": "2022-06-25T03:19:41.000Z"
    },
    {
        "id": 15,
        "nome": "RAIVA",
        "prevencao": "",
        "tratamento": "",
        "createdAt": "2022-06-25T03:19:41.000Z",
        "updatedAt": "2022-06-25T03:19:41.000Z"
    }
];
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
    setMarkers(data);
    setDiseases(data.map(item => {
    }));
    (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      })();

    let text = 'Waiting..';
    if (errorMsg) {
    text = errorMsg;
    } else if (location) {
    text = JSON.stringify(location);
    }

    /* fetch("http://localhost:3000/api/diseases/cities").then(async (request) => {
      const data = await request.json();
      
      
    }); */
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
        {(filter ? markers : markers).map((item) => { //lógica do filtro?
          return (
            <Marker
              key={item.id}
              coordinate={{
                latitude: item.cities[0].latitude,
                longitude: item.cities[0].longitude,
              }}
              onPress={() => {
                //navigation.navigate("Detail", item);
              }}
            />
          );
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
          data={diseasesList}
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
              {/* <Image style={styles.categoryImage} source={item.image} />*/}
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
});