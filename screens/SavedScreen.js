import React, { useState, useCallback, useContext } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import RenderVoteItem from "../components/RenderVoteItem";
import { processVoteItems } from "../util/dataUtils";
import { AuthContext } from "../util/AuthContext";

const BACKEND_API_URL = 'http://20.251.146.203/saved-votings';

export default function SavedScreen({ navigation }) {
    const [savedData, setSavedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { session, isLoggedIn } = useContext(AuthContext);

    const fetchSavedVotes = async () => {
        if (!isLoggedIn || !session?.uid) {
            setSavedData([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(BACKEND_API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.uid}`,
                },
            });

            if (!response.ok) throw new Error("Kunne ikke hente data");

            const rawDbData = await response.json();

            const processedItems = processVoteItems(rawDbData);
            setSavedData(processedItems);
        } catch (error) {
            console.error("Fetch error:", error);
            Alert.alert("Fejl", "Kunne ikke hente gemte afstemninger.");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchSavedVotes();
        }, [isLoggedIn, session])
    );

    const renderItem = ({ item }) => {
        return <RenderVoteItem item={item} navigation={navigation} />;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Gemte Afstemninger</Text>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : (
                <FlatList
                    data={savedData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.centered}>
                            <Text style={styles.emptyText}>Ingen gemte afstemninger fundet.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 50, backgroundColor: "#f9f9f9" },
    header: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#333" },
    centered: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 },
    listContent: { paddingHorizontal: 15, paddingBottom: 30 },
    emptyText: { fontSize: 16, color: "#999", textAlign: "center" },
});