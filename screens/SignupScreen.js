
import { useState, useContext, createContext } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { AuthContext } from "../util/AuthContext";

export default function SignupScreen() {
  const {login} = useContext(AuthContext)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const performSignup = async () => {
    try {
      const apiUrl = "http://192.168.0.111:5001/auth/signup/email";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      
      if (data?.access_token && data?.uid) {
        Alert.alert(data.message)
        login(data); // update global state via AuthContext
        
      } else if (data?.uid && !data?.access_token){
        Alert.alert(data.message)
      } else {
        Alert.alert("Oprettelse fejlede", "Enten er denne mail allerede i brug, ellers opfylder dit kodeord ikke vores krav");
      }

    } catch (error) {
      Alert.alert("Login error", error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text>Signup</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginVertical: 10 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginVertical: 10 }}
      />

      <Button title="Signup" onPress={performSignup} />
    </View>
  );
}
