import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/homeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VoteDetailsScreen from '../screens/VoteDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
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
      <Tab.Screen name="Home" component={HomeStackScreen} />    
      <Tab.Screen name="Profile" component={ProfileScreen}/>
    </Tab.Navigator>
  ) }
  
