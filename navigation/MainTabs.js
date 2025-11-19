// src/navigation/MainTabs.js

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/homeScreen';
import LoginScreen from '../screens/loginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VoteDetailsScreen from '../screens/VoteDetailsScreen';
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

function HomeStackScreen (){
 return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="VotesList" component={HomeScreen} options={{ headerShown: false }} /> 
      <HomeStack.Screen name="VoteDetails" component={VoteDetailsScreen} />
    </HomeStack.Navigator>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Login" component={LoginScreen} />
      <Tab.Screen name="Home" component={HomeStackScreen} />
    </Tab.Navigator>
  );
}
