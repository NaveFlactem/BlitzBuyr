import React, {useEffect, useRef} from 'react';
import { SafeAreaView, View, Image, StyleSheet, Dimensions, FlatList, Text, Button, TouchableOpacity} from 'react-native';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';
import BottomBar from '../components/BottomBar';
import TopBar from '../components/TopBar';

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: -1,
    backgroundColor: '#D6447F',
    height: "100%",
    width: "100%",     
  },
  image: {
    height: "8%",
    width: "8%",
    top: "1.5%",
  },
  card: {
    backgroundColor: '#F7A859',
    width: "90%",
    height: "70%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    top: "9%",
  },
});

const HomeScreen = () => {
  const getListing = (listingId) => {
    fetch(`blitzbuyr.lol/api/listing?id=${listingId}`, {
      method: "GET",
    }).then((response) => {
      if (response.status == 200) {
        // this means we got the listings successfully
        return response.json(); // returns the listings
      } else {
        console.log(response.json()[message]);
      }
    });
  };

  const cardDictionary = {
    0: ["red", "crimson", "tomato"],
    1: ["orange", "darkorange", "orangered"],
    2: ["yellow", "gold", "khaki"],
    3: ["green", "limegreen", "forestgreen"],
    4: ["blue", "dodgerblue", "deepskyblue"],
    5: ["purple", "darkorchid", "blueviolet"],
    6: ["pink", "deeppink", "palevioletred"],
    7: ["brown", "saddlebrown", "chocolate"],
  };
  const Listings = Object.entries(cardDictionary);
  const navigation = useNavigation();

  return (
    
    
    <SafeAreaView style={styles.screenfield}>
      <TopBar />

      <View style={styles.container}>
        <Swiper
          showsButtons={false}
          showsPagination={false}
          vertical={true}
          horizontal={false}
        >
          {Listings.map((listing, page) => (
            <View style={styles.card} key={listing}>
              <Swiper
                horizontal={true}
                showsButtons={false}
                showsPagination={false}
                loop={false}
              >
                {Listings[page].map((color, index) => (
                  <View style={{backgroundColor: color, width: "90%", height: "70%", borderRadius: 20, alignItems: 'center', justifyContent: 'center', margin: 20, top: "9%"}} key={index}>
                    <Text style={{fontSize: 30, fontWeight: 'bold', color: 'white'}}>{listing[0]}</Text>
                  </View>
                ))}
              </Swiper>
            </View>
          ))}
        </Swiper>
      </View>
      <BottomBar />            
    </SafeAreaView>
  );
};

export default HomeScreen;
