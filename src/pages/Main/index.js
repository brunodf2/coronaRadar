import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput, Keyboard } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location'
import { FontAwesome } from '@expo/vector-icons'

import api from '../../services/api'

import image from '../../assets/corona.png'

export default function Main() {
  const [coronas, setCoronas] = useState([])
  const [currentRegion, setCurrentRegion] = useState(null)
  const [modalAdd, setModalAdd] = useState(false)
  const [nameCorona, setNameCorona] = useState('')
  const [descriptionCorona, setDescriptionCorona] = useState('')

  useEffect(() => {

    async function loadInitialPosition() {
      const { granted } = await requestPermissionsAsync();

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true
        });

        const { latitude, longitude } = coords;

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        })
      }

    }

    loadInitialPosition();
  }, []);

  useEffect(() => {
    
    async function loadCorona() {
      const { latitude, longitude } = currentRegion;

      const response = await api.get('/search', {
        params: {
          latitude,
          longitude
        }
      });

      setCoronas(response.data.coronas);
    }
    loadCorona()

  }, [coronas])

  const handleAddCorona = useCallback(() => {

    async function addCorona() {
      const { latitude, longitude } = currentRegion;

      const response = await api.post('/virus', {
        name: nameCorona,
        description: descriptionCorona,
        latitude,
        longitude
      })
      setNameCorona('')
      setDescriptionCorona('')
      setModalAdd(false)
      setCoronas([...coronas, response.data])
    }
    addCorona()

  }, [nameCorona, descriptionCorona])




  function handleRegionChanged(region) {
    setCurrentRegion(region)
  }

  if (!currentRegion) {
    return null
  }

  return (
    <>
      <MapView onRegionChangeComplete={handleRegionChanged} initialRegion={currentRegion} style={styles.map}>
        {coronas.map(corona => (
          <Marker key={corona._id}
            coordinate={{
              latitude: corona.location.coordinates[1]
              , longitude: corona.location.coordinates[0]
            }}>
            <Image style={styles.avatar} source={image} />
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.name}>{corona.name}</Text>
                <Text style={styles.description}>{corona.description}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <View style={styles.button}>
        <TouchableOpacity onPress={() => setModalAdd(true)} style={styles.addButton} >
          <FontAwesome name="plus" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        visible={modalAdd}
        styles={styles.alingModal}
        transparent={true}
        onRequestClose={() => setModalAdd(false)}
      >
        <View style={{ alignItems: 'center', marginVertical: 200 }}>
          <View style={styles.modal}>
            <FontAwesome onPress={() => setModalAdd(false)} name="arrow-left" color="#07ed" size={20} style={styles.arrow} />
            <TextInput
              placeholder="Dê um nome"
              value={nameCorona}
              onChangeText={nameCorona => setNameCorona(nameCorona)}
              onSubmitEditing={() => Keyboard.dismiss()}
              style={styles.inputName}

            />
            <TextInput
              placeholder="Descrição"
              value={descriptionCorona}
              onChangeText={descriptionCorona => setDescriptionCorona(descriptionCorona)}
              onSubmitEditing={() => Keyboard.dismiss()}
              style={styles.inputDescription}
              textAlignVertical="top"
              multiline
            />
            <View style={styles}>
              <TouchableOpacity onPress={handleAddCorona} style={styles.saveButton} >
                <Text style={styles.textButtom}>Salvar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </>

  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  avatar: {
    width: 40,
    height: 40,
  },
  callout: {
    display: 'flex',
    width: 230,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16
  },
  description: {
    color: '#666',
    marginTop: 5
  },
  button: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    zIndex: 5,
    alignItems: 'flex-end'
  },
  addButton: {
    width: 45,
    height: 45,
    backgroundColor: '#07ed',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15
  },
  modal: {
    width: 300,
    height: 400,
    justifyContent: 'center',
    backgroundColor: '#FFF',
    flexDirection: 'column',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4
    },
    elevation: 2,
  },
  arrow: {
    padding: 10
  },
  inputName: {
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    height: 50,
    width: '90%',
    padding: 10,
    marginLeft: 12,
    marginTop: 10
  },
  inputDescription: {
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    height: 200,
    width: '90%',
    padding: 10,
    marginTop: 10,
    marginLeft: 12,
  },
  saveButton: {
    width: '90%',
    height: 50,
    backgroundColor: '#07ed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    marginTop: 20,
  },
  textButtom: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16
  }

});
