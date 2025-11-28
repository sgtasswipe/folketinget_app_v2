import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/homeScreen';
import LoginScreen from '../screens/loginScreen';
import SignupScreen from '../screens/SignupScreen';
const Tab = createBottomTabNavigator();
export default function AuthTabs() {
  
  return (
    <Tab.Navigator>
      <Tab.Screen name="Login" component={LoginScreen} />    
      <Tab.Screen name="Signup" component={SignupScreen} />    
    </Tab.Navigator>
  ) }
  
