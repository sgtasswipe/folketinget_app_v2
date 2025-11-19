// src/components/RenderVoteItem.js

import { StyleSheet, View, Text, Pressable } from "react-native";
import VoteDetailsScreen from "../screens/VoteDetailsScreen"

// Receive both 'item' and 'navigation' as props
const RenderVoteItem = ({ item, navigation }) => {
    // Navigate to the 'VoteDetails' stack screen and pass the full 'item' data
    const handlePress = () => {
        navigation.navigate("VoteDetails", { voteData: item }); 
    };

    const title = item?.Sagstrin?.Sag?.titelkort || "No Title Available";

    return (
        <Pressable onPress={handlePress} style={({ pressed }) => [
            styles.itemContainer,
            { backgroundColor: pressed ? '#f0f0f0' : 'white' } 
        ]}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.title}>{item.konklusion}</Text>
            <Text style={styles.date}>Dato: {item.Sagstrin.dato}</Text>
            
           
           
        </Pressable>
    );
};
export default RenderVoteItem;

const styles = StyleSheet.create({
    itemContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: 'white', 
        marginBottom: 5,
        borderRadius: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    date: {
        fontSize: 12,
        color: '#666',
    },
});