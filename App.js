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
import Home from './screens/home';
import { AppLoading } from 'expo';
import Navigator from './routes/homeStack';
const COLORS = {primary: '#1f145c', white: '#fff'};

export default function App() {
 
  // Return the main View
  return (
    <Navigator />
  );
}



