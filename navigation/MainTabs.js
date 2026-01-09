import React, { useContext } from 'react'; // 1. Import useContext
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/homeScreen';
import VoteDetailsScreen from '../screens/voteDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SavedScreen from '../screens/SavedScreen';
import { AuthContext } from '../util/AuthContext'; // 2. Import your AuthContext

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const SavedStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="VotesList" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="VoteDetails" component={VoteDetailsScreen} />
    </HomeStack.Navigator>
  );
}

function SavedStackScreen() {
  return (
    <SavedStack.Navigator>
      <SavedStack.Screen name="SavedList" component={SavedScreen} options={{ headerShown: false }} />
      <SavedStack.Screen name="VoteDetails" component={VoteDetailsScreen} />
    </SavedStack.Navigator>
  );
}

export default function MainTabs() {
  const { session } = useContext(AuthContext);

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeStackScreen} />

      {/* 4. Conditionally render the Saved tab */}
      {session && (
        <Tab.Screen name="Saved" component={SavedStackScreen} />
      )}

      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}