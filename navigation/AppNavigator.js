import { NavigationContainer } from '@react-navigation/native';
import MainTabs from './MainTabs';

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}
//Later this will have a conditional based on session from supbase to either show login screens or the maintabs if logged in. 