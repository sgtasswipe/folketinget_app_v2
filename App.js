import AppNavigator from "./navigation/AppNavigator";
import { AuthProvider } from "./util/AuthContext";

export default function App() {
  return(
    <AuthProvider>
    <AppNavigator/>;
    </AuthProvider>
  )
}


