import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button,TextInput,
  SafeAreaView,
  StatusBar,
  FlatList,
  Alert,
  TouchableOpacity, 
  Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MaterialIcons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
const totp = require("totp-generator");
const COLORS = {primary: '#1f145c', white: '#fff'};


function generateToken(secretKey){
  secretKey = secretKey.replace(" ","");
  const token = totp(secretKey, {
    digits: 6,
    algorithm: "SHA-512",
    period: 60,
  });
  return token;
}

async function fetchData() {
    var URL_REGISTER = 'https://www.google.com';
    let ntDate = '';
    await fetch(URL_REGISTER, {method: 'GET'})
        .then(
            function(response) {
                ntDate = (response.headers.get('Date'));
                return ntDate;
            }
        )
        .catch(function(err) {
            console.log('Fetch Error', err);
        });
        
  }

export default function Home({ navigation }) {
    console.log("line")
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not yet scanned')
  const [secretKey, setSecretKey] = useState('')
  const [availableAuths, setAvailableAuths] = useState([]);
  let ntDate = fetchData()
  console.log(ntDate)
  ntDate = new Date(ntDate)
  let ntDat = ntDate.getSeconds()
  const [timerCount, setTimer] = useState(ntDat - (new Date().getSeconds()))

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }

  // Request Camera Permission + Save added auths to devise
  useEffect(() => {
    askForCameraPermission();

    getAvailableAuthsFromUserDevise();

    let interval = setInterval(() => {
        setTimer(lastTimerCount => {
          if(lastTimerCount == 0){
              return 60
          }
          return lastTimerCount - 1
        })
      }, 1000) 
      
      return () => clearInterval(interval)
  }, []);
  //Set availableAuths from user devise by searching the devise storage
//   useEffect(() => {
//     getAvailableAuthsFromUserDevise();
//   }, []);
  //Used so that the method is called everytime availableAuths gets changed
//   useEffect(() => {
//     saveAvailableAuthsToUserDevice(availableAuths);
//   }, [availableAuths]);
//   useEffect(() => {
//     let interval = setInterval(() => {
//       setTimer(lastTimerCount => {
//         if(lastTimerCount == 0){
//             return 60
//         }
//         return lastTimerCount - 1
//       })
//     }, 1000) 
    
//     return () => clearInterval(interval)
//   }, []);
  
  const addAvailableAuth = (data) => {
    let secretToken = ''
    let secretServcie = ''
    secretToken = data.substring(data.indexOf('secret=') + 7);
    secretServcie = data.substring(data.indexOf("p/") + 2, data.lastIndexOf("?"));
    secretServcie = secretServcie.replace("%20"," ");
    const newAvailableAuth = {
      id: Math.random(),
      service: secretServcie,
      key: secretToken
    };
    setAvailableAuths([...availableAuths, newAvailableAuth]);
  }

  //Save the availableAuths to user device storage so that they does not gets removed
  const saveAvailableAuthsToUserDevice = async availableAuths => {
    try {
      const stringyAvailableAuths = JSON.stringify(availableAuths);
      await AsyncStorage.setItem('availableAuths',stringyAvailableAuths)
    } catch (error) {
      console.log(error);
    }
  }

  //To clear all avaialble auths
  const clearAllAvailableAuths = () => {
    Alert.alert('Confirm', 'Clear All Added Auths?', [
      {
        text: 'Yes',
        onPress: () => setAvailableAuths([]),
      },
      {
        text: 'No',
      },
    ]);
  };

  //Get the availableAuths from a user devise when app loads up
  const getAvailableAuthsFromUserDevise = async () =>{
    try {
      const availableAuths = await AsyncStorage.getItem('availableAuths')
      if(availableAuths != null){
        setAvailableAuths(JSON.parse(availableAuths))
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Check permissions and return the screens
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Please allow access to camera to run the app</Text>
      </View>)
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>Please allow access to camera to run the app</Text>
        <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
      </View>)
  }

  //Method to open QR Code scanner when add button is pressed
  const goToQr = async () => {
    navigation.navigate('QRScreen', {addAvailableAuth: addAvailableAuth})

  }


  const ListItem = ({avlAuth}) => {
    
    let tokenToShow = generateToken(avlAuth?.key);
    return (
      <View style={styles.listItem}>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 30,
              color: '#0c387d',
            }}>{tokenToShow}
          </Text>
          <Text
          style={{
            fontWeight: 'italics',
            fontSize: 25,
            color: COLORS.primary,
            marginTop:10
          }}>{avlAuth?.service}  
        </Text> 
        </View>
        <Text
          style={{
            fontWeight: 'italics',
            fontSize: 20,
            color: COLORS.primary,
            marginTop:10
          }}>{timerCount}
        </Text> 
      </View> 
    );
  };


  // Return the main View
  return (
    <SafeAreaView style={{flex: 1,backgroundColor: 'white', }}>
      <View style={styles.header}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 30,
            color: COLORS.primary
          }}>
          Single Authenticator
        </Text>
        <MaterialIcons name="delete" size={30} style={{padding: 15}} color="darkblue" onPress={clearAllAvailableAuths}/>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 20, paddingBottom: 100}}
        data={availableAuths}
        renderItem={({item}) => <ListItem avlAuth={item} />}
      />

      <View style={styles.footer}>      
        <TouchableOpacity onPress={goToQr}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="add" color="white" size={30} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  header: {
    padding: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
  },
  iconContainer: {
    height: 70,
    width: 70,
    backgroundColor: COLORS.primary,
    elevation: 40,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },

  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    marginLeft: 5,
    borderRadius: 3,
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'tomato'
  }
});

