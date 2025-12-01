// LoginScreen.js
import { useState, useContext } from "react";
import { View, Text, TextInput, Button, Alert, Pressable } from "react-native";
import { AuthContext } from "../util/AuthContext";

export default function LoginScreen() {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const performLogin = async () => {
    try {
      const apiUrl = "http://20.251.146.98:5001/auth/login/password";
      console.log("login backend called")

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      
      if (data?.access_token && data?.uid) {
        login(data); // update global state via AuthContext
      } else {
        Alert.alert("Login failed", "Invalid credentials");
      }

    } catch (err) {
      Alert.alert("Login error", err.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text>Login</Text>

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

    <Pressable onPress={performLogin} style={{margin: 5,marginTop: 20, borderRadius: 5, paddingLeft: 150,}}>
      <Text>Login</Text>
    </Pressable>
    
     {/* this should be removed later, just here temp to bypass loginscreen for dev*/}
    <Pressable onpress={login()}></Pressable>
    </View>
  ); 
}
