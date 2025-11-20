
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabs from './MainTabs';
import VoteDetailsScreen from '../screens/voteDetailsScreen.js';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MainTabs" component={MainTabs} options={{headerShown: false, title: 'Tilbage'}} />
        <Stack.Screen name="VoteDetailsScreen" component={VoteDetailsScreen} options={{title: 'Afstemningsdetajler'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
//Later this will have a conditional based on session from supbase to either show login screens or the maintabs if logged in. 

