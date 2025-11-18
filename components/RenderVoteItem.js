import { StyleSheet, View, Text } from "react-native";
const RenderVoteItem = ({ item }) => {
        const title = item?.Sagstrin?.Sag?.titelkort || "No Title Available";

        return (
            <View style={styles.itemContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.title}>{item.konklusion}</Text>
                <Text style={styles.date}>Dato: {item.Sagstrin.dato}</Text>
            </View>
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