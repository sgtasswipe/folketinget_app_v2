import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../util/AuthContext";

export default function ProfileScreen({ navigation }) {
  const { session, logout } = useContext(AuthContext);

  if (!session || !session.access_token) {
    return (
    <View style={styles.container}>
      <View style={styles.guestCard}>
        <Text style={styles.guestTitle}>Ingen profil fundet</Text>
        <Text style={styles.guestText}>
          Du bruger appen som gæst. For at oprette en profil skal du logge ud af gæstebrukeren.
        </Text>

        <Pressable style={styles.primaryButton} onPress={() => logout()}>
          <Text style={styles.primaryButtonText}>Log ud for at oprette profil</Text>
        </Pressable>
      </View>
    </View>)
  }

  const access_token = session.access_token;

  console.log(session);
  console.log(access_token);

  const handleDeleteUser = async () => {
    const confirmed = await new Promise((resolve) => {
      Alert.alert(
        "Slet bruger",
        "Er du sikker på, at du vil slette din konto? Dette kan ikke fortrydes.",
        [
          { text: "Annuller", style: "cancel", onPress: () => resolve(false) },
          { text: "Slet", style: "destructive", onPress: () => resolve(true) },
        ]
      );
    });

    if (!confirmed) return;

    try {
      const response = await fetch(
        "http://20.251.146.98:5001/auth/delete_user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: access_token }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Succes", "Din konto er slettet.");

        //Call logout() to clear the session
        logout();
        navigation.replace("Login");
      } else {
        Alert.alert("Fejl", data.detail || "Kunne ikke slette kontoen.");
      }
    } catch (err) {
      console.error("Delete user network error:", err);
      Alert.alert("Fejl", "Kunne ikke forbinde til Serveren");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Min Profil</Text>
      <Text style={styles.label}>Profile ID:</Text>
      <Text>{session.uid}</Text>
      <Pressable style={styles.deleteButton} onPress={handleDeleteUser}>
        <Text style={styles.deleteButtonText}>Slet bruger</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    marginBottom: 30,
  },
  deleteButton: {
    backgroundColor: "#e53935",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
   guestCard: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 12,
    elevation: 3, // adds shadow on Android
    shadowColor: "#000", // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  guestTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    color: "white",
    textAlign: "center",
  },
  guestText: {
    fontSize: 15,
    color: "#444",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: "rgba(24, 102, 227, 0.69)",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
