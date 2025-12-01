import { Text, View, StyleSheet, ScrollView } from "react-native";

// Helper function to format the date string (e.g., 2025-10-23T00:00:00)
const formatDate = (isoString) => {
    if (!isoString) return 'Ikke tilgængelig';

    const date = new Date(isoString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    const isDateOnly = isoString.endsWith('T00:00:00');

    if (!isDateOnly) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }

    
    return date.toLocaleDateString('da-DK', options);
};

export default function VoteDetailsScreen({ route }) {
    const { voteData } = route.params;

    const mainConclusionText = voteData.konklusion || "Konklusion mangler";

    const title = voteData.titel
    const titleshort = voteData.titelkort;
    const resume = voteData.resume;
    const createdDate = voteData.dato; 
    const updatedDate = voteData.opdateringsdato; 
    const comment = voteData.kommentar;
    
    

    const isPassed = voteData.vedtaget;
    const resultText = isPassed ? 'VEDTAGET' : 'IKKE VEDTAGET';
    const resultStyle = isPassed ? styles.resultPassed : styles.resultFailed;
    

   
    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer}>
            
            
            <Text style={[styles.resultBadge, resultStyle]}>
                {resultText}
            </Text>

            <Text style={styles.title}>
                {title}
            </Text>
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Konklusion</Text>
                <Text style={styles.commentText}>{mainConclusionText}</Text>
            </View>

           
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Bemærkning:</Text>
                {comment ? <Text style={styles.commentText}> {comment}</Text> : null}
            </View>

         
            {resume ? (
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>📄 Resume</Text>
                    <Text style={styles.bodyText}>{resume}</Text>
                </View>
            ) : null}

           
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>ℹ️ Sagsdetaljer</Text>
                <Text style={styles.metaText}><Text style={styles.metaLabel}>Afstemningsdato:</Text> {formatDate(createdDate)}</Text> 
                <Text style={styles.metaText}><Text style={styles.metaLabel}>Opdateret:</Text> {formatDate(updatedDate)}</Text> 
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    contentContainer: {
        padding: 15,
        paddingBottom: 30,
    },
    
    resultBadge: {
        fontSize: 14,
        fontWeight: 'bold',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        alignSelf: 'flex-start',
        marginBottom: 15,
        overflow: 'hidden',
    },
    resultPassed: {
        backgroundColor: '#e6ffe6',
        color: '#006600',
    },
    resultFailed: {
        backgroundColor: '#ffe6e6',
        color: '#cc0000',
    },
   
    shortTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#444',
        marginBottom: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 20,
    },
    
    section: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 5,
    },
    
    breakdownContainer: {
        paddingLeft: 5,
    },
    breakdownLine: {
        fontSize: 14,
        color: '#333',
        marginBottom: 3,
        lineHeight: 20,
    },
    commentText: {
        fontSize: 14,
        fontStyle: 'italic',
        marginTop: 10,
        color: '#666',
    },
    
    bodyText: {
        fontSize: 15,
        lineHeight: 22,
        color: '#333',
    },
    metaText: {
        fontSize: 13,
        color: '#555',
        marginBottom: 3,
    },
    metaLabel: {
        fontWeight: '600',
        color: '#111',
    }
});