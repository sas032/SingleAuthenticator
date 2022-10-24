import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button,TextInput,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity, 
  Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BarCodeScanner } from 'expo-barcode-scanner';
const COLORS = {primary: '#1f145c', white: '#fff'};


export default function QrScanner({ navigation }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [text, setText] = useState('Not yet scanned')

    const askForCameraPermission = () => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })()
    }

    // Request Camera Permission
    useEffect(() => {
        askForCameraPermission();
    }, []);

    // What happens when we scan the bar code
    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        // setText(data);
        //send the text to home screen
        // console.log(data)
        // navigation.navigate('Home', {secData: data})
        let cb = navigation.getParam('addAvailableAuth')
        cb(data)
        navigation.goBack();
    };

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

    return (
        <SafeAreaView style={{flex: 1,backgroundColor: 'white', }}>
            <View style={styles.container}>
                <View style={styles.barcodebox}>
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={{ height: 400, width: 400 }} />
                </View>
                {scanned && <Button title={'Scan again?'} onPress={() => setScanned(false)} color='blue' />}
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