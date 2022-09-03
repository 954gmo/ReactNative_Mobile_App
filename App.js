import React from 'react';
import "react-native-gesture-handler";
import {createAppContainer} from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";

import Scan from "./components/Scan";
import CustomerRegistration from "./components/CustomerRegistration";
import Login from "./components/Login";
import LostFound from "./components/LostFound"

const AppNavigator = createStackNavigator({
  Login: {screen: Login},
  Scan: {screen: Scan},
  "Register New Customer": {screen: CustomerRegistration},
  "Lost and Found": {screen: LostFound},
});

const App = createAppContainer(AppNavigator);
export default App;
