import { NavigationContainer } from '@react-navigation/native';
import MainTabs from './MainTabs';
import AuthTabs from './AuthTabs';
import { AuthContext } from '../util/AuthContext';
import {  useContext } from 'react';


export default function AppNavigator() {
const {isLoggedIn} = useContext(AuthContext)

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainTabs/> : <AuthTabs/>}
    </NavigationContainer>
  );
}