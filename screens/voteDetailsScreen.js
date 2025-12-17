import React, { useState, useContext, useLayoutEffect, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../util/AuthContext";

// Date formatter helper
export const formatDate = (isoString) => {
  if (!isoString) return "Ikke tilgængelig";
  const date = new Date(isoString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("da-DK", options);
};

export default function VoteDetailsScreen({ route, navigation }) {
  const { voteData } = route.params;
  const { session, isLoggedIn } = useContext(AuthContext);

  // State for the star status
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const {
    id,
    afstemningId,
    titel,
    titelkort,
    resume,
    kommentar,
    dato,
    opdateringsdato,
    konklusion,
    vedtaget,
    inFavor,
    against,
    inFavorList,
    againstList,
    sourceFormat,
  } = voteData;

  const targetId = afstemningId || id;

  // Check if already saved when the screen loads
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!isLoggedIn || !session?.uid) {
        setCheckingStatus(false);
        return;
      }

      try {
        const response = await fetch(`http://20.251.146.203:5001/saved-votings`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.uid}`,
          },
        });

        if (response.ok) {
          const savedVotes = await response.json();
          // Look through list for the current voting ID
          const isAlreadySaved = savedVotes.some(
            (item) => (item.afstemning_id || item.id) === targetId
          );
          setIsSaved(isAlreadySaved);
        }
      } catch (error) {
        console.error("Error checking saved status:", error);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkSavedStatus();
  }, [isLoggedIn, session, targetId]);

  const handleSaveToggle = async () => {
    if (!isLoggedIn || !session?.uid) {
      Alert.alert("Log ind", "Du skal være logget ind for at gemme afstemninger.");
      return;
    }

    setIsSaving(true);

    const endpoint = isSaved ? '/delete-voting' : '/save-voting';
    const method = isSaved ? 'DELETE' : 'POST';

    try {
      const response = await fetch(`http://20.251.146.203:5001${endpoint}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.uid}`,
        },
        body: JSON.stringify({
          voting_id: targetId,
        }),
      });

      if (response.ok) {
        // Toggle the star state
        setIsSaved(!isSaved);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Kunne ikke opdatere");
      }
    } catch (error) {
      console.error("Toggle error:", error);
      Alert.alert("Fejl", `Der skete en databasefejl: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Update star icon
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSaveToggle}
          style={styles.headerButton}
          disabled={isSaving || checkingStatus}
        >
          {isSaving || checkingStatus ? (
            <ActivityIndicator size="small" color="#FFD700" />
          ) : (
            <Ionicons
              name={isSaved ? "star" : "star-outline"}
              size={26}
              color={isSaved ? "#FFD700" : "rgba(0,0,0,0.3)"}
            />
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, isSaved, isSaving, checkingStatus]);

  const resultText = vedtaget ? "VEDTAGET" : "IKKE VEDTAGET";
  const resultStyle = vedtaget ? styles.resultPassed : styles.resultFailed;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.badgeContainer}>
        <Text style={[styles.resultBadge, resultStyle]}>{resultText}</Text>
      </View>

      <Text style={styles.title}>{titel || "Ingen titel"}</Text>
      {titelkort ? <Text style={styles.shortTitle}>{titelkort}</Text> : null}

      {resume ? (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>📄 Resume</Text>
          <Text style={styles.bodyText}>{resume}</Text>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Konklusion</Text>
        <Text style={styles.bodyText}>{konklusion || "Ingen konklusion tilgængelig"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Stemmefordeling</Text>
        <View style={styles.statsRow}>
          <Text style={styles.breakdownLine}>✅ For: <Text style={styles.boldText}>{inFavor}</Text></Text>
          <Text style={styles.breakdownLine}>❌ Imod: <Text style={styles.boldText}>{against}</Text></Text>
        </View>

        <Text style={[styles.sectionSubHeader, { marginTop: 15 }]}>For – Partier</Text>
        <View style={styles.partyList}>
          {inFavorList?.length > 0 ? (
            inFavorList.map((p, i) => <Text key={`for-${i}`} style={styles.metaText}>• {p}</Text>)
          ) : <Text style={styles.metaText}>Ingen data</Text>}
        </View>

        <Text style={[styles.sectionSubHeader, { marginTop: 15 }]}>Imod – Partier</Text>
        <View style={styles.partyList}>
          {againstList?.length > 0 ? (
            againstList.map((p, i) => <Text key={`against-${i}`} style={styles.metaText}>• {p}</Text>)
          ) : <Text style={styles.metaText}>Ingen data</Text>}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>📅 Detaljer & Datoer</Text>
        <Text style={styles.metaText}><Text style={styles.metaLabel}>Afstemnings ID:</Text> {targetId}</Text>
        <Text style={styles.metaText}><Text style={styles.metaLabel}>Dato:</Text> {formatDate(dato)}</Text>
        <Text style={styles.metaText}><Text style={styles.metaLabel}>Sidst opdateret:</Text> {formatDate(opdateringsdato)}</Text>
        <Text style={styles.metaText}><Text style={styles.metaLabel}>Format:</Text> {sourceFormat}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  contentContainer: {
    padding: 15,
    paddingBottom: 40,
  },
  headerButton: {
    marginRight: 15,
    padding: 5,
  },
  badgeContainer: {
    marginBottom: 10,
  },
  resultBadge: {
    fontSize: 13,
    fontWeight: "bold",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 15,
    alignSelf: "flex-start",
    overflow: "hidden",
  },
  resultPassed: { backgroundColor: "#e6ffe6", color: "#006600" },
  resultFailed: { backgroundColor: "#ffe6e6", color: "#cc0000" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  shortTitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 6,
  },
  sectionSubHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 5,
  },
  breakdownLine: {
    fontSize: 15,
    color: "#333",
  },
  boldText: {
    fontWeight: "bold",
  },
  partyList: {
    paddingLeft: 5,
  },
  metaText: {
    fontSize: 13,
    color: "#777",
    marginBottom: 4,
  },
  metaLabel: {
    fontWeight: "600",
    color: "#444",
  },
});