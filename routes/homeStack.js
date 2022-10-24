import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Home from '../screens/home';
import QrScanner from '../screens/qrscanner';

const screens = {
    Home: {
      screen: Home,
      
    },
    QRScreen: {
      screen: QrScanner,
    },
  };

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);