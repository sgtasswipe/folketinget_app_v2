import { useState, useContext } from "react";
import { View, Text, TextInput, Alert, Pressable, StyleSheet } from "react-native";
import { AuthContext } from "../util/AuthContext";


export default function LoginScreen({navigation}) {
  const { login } = useContext(AuthContext);
  const [passwordError, setPasswordError] = useState('');

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const performLogin = async () => {
    try {
      const apiUrl = "http://20.251.146.98:5001/auth/login/password";
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data?.access_token && data?.uid) {
        login(data); //update global auth state via AuthContext
      } else {
        const errorMessage = data?.detail || "Invalid credentials";
        Alert.alert("Login failed", errorMessage);
      }

    } catch (err) {
      Alert.alert("Login error", "Could not connect to the server.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#CCCCCC"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#CCCCCC"
        secureTextEntry
        value={password}
        onChangeText= {(text) => {
          setPassword(text);
          if (text.length < 6 && text.length > 0)
            setPasswordError("Password skal være længere end 6 tegn.")
          else 
            setPasswordError("")
        } }
        style={[styles.input, passwordError && styles.inputError]} 
      />

      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <Pressable onPress={performLogin} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Login</Text>
      </Pressable>
       <Pressable onPress={() => navigation.navigate("Signup")} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>
          Opret Bruger
        </Text>
      </Pressable>
      <Pressable onPress={() => login()} style={styles.guestButton}>
        <Text style={styles.guestButtonText}>
          Gæste login
        </Text>
      </Pressable>
      
    </View>
  ); 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: '#333333',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
    color: '#333333',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  guestButton: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  guestButtonText: {
    color: '#007AFF',
    fontSize: 14,
    textDecorationLine: 'underline',

  },
errorText: {
    fontSize: 12,
    color: '#FF3B30', 
    marginTop: -8,  
    marginBottom: 10,
    paddingLeft: 5,
},
inputError: {
    borderColor: '#FF3B30', 
},
requirementList: {
    marginTop: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
},
passed: {
    color: 'green',
    fontSize: 14,
},
failed: {
    color: '#888888',
    fontSize: 14,
}
});