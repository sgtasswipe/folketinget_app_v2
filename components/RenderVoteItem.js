import VoteDetailsScreen from "../screens/VoteDetailsScreen"
import { StyleSheet, View, Text, Pressable } from "react-native";

const PartyCircles = ({ parties }) => {
  if (!parties || parties.length === 0) return null;

  return (
    <View style={styles.partyCircleContainer}>
      {parties.map(party => {
        const { letter, colour } = getPartyLetterAndColour(party);
        const fontSizeStyle = 
            letter.length === 1 ? { fontSize: 14 } :
            letter.length === 2 ? { fontSize: 12 } :
            {fontSize: 10}
        return (
          <View key={party} style={[styles.partyCircle, { backgroundColor: colour }]}>
            <Text style={[styles.partyLetter, fontSizeStyle]}>{letter}</Text>
          </View>
        );
      })}
    </View>
  );
};


const RenderVoteItem = ({ item, navigation }) => {
     //Whole cards are now pressable, will go to details screen
    const handlePress = () => {
        navigation.navigate("VoteDetails", { voteData: item }); 
    };
        const title = item?.Sagstrin?.Sag?.titelkort || "No Title Available";

        return (
            <Pressable onPress={handlePress} style={styles.itemContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.date}>Dato: {item.Sagstrin.dato}</Text>
                <Text style={[item.conclusion ? styles.resultTrue : styles.resultFalse]}>
                    {item.conclusion ? 'Vedtaget' : 'Ikke vedtaget'}
                </Text>
                <Text></Text>
                <Text>For: {item.inFavor}</Text>
                <PartyCircles parties={item.inFavorList}></PartyCircles>
                <Text></Text>

                <Text>Imod: {item.against}</Text>
                <PartyCircles parties={item.againstList}></PartyCircles>
            </Pressable>
        );
    };
     //Whole cards are now pressable, will go to details screen
    const handlePress = () => {
        navigation.navigate("VoteDetails", { voteData: item }); 
    };

// TODO: Create a table in the database with these attributes and the party colours along with the daily fetching of new votings
const partyColours = {
    S: {letter: 'S', colour: '#e53838'},        // Socialdemokratiet
    V: {letter: 'V', colour: '#205da5'},        // Venstre
    M: {letter: 'M', colour: '#b48cd2'},        // Moderaterne
    DD: {letter: 'DD', colour: '#78a0e1'},       // Danmarks Demokraterne
    SF: {letter: 'SF', colour: '#ef75ca'},       // Socialistisk Folkeparti
    LA: {letter: 'LA', colour: '#1db9ce'},       // Liberal Alliance
    KF: {letter: 'KF', colour: '#8b8474'},       // Kristendemokraterne
    EL: {letter: 'EL', colour: '#eb7341'},       // Enhedslisten
    DF: {letter: 'DF', colour: '#f9c153'},       // Dansk Folkeparti
    RV: {letter: 'RV', colour: '#78378c'},       // Radikale Venstre
    ALT: {letter: 'ALT', colour: '#32913c'},      // Alternativet
    NB: {letter: 'NB', colour: '#127b7f'},       // Nye Borgerlige
    UFG: {letter: 'UFG', colour: '#8d95a5'}   // Uden for folketingsgruppen
}

function getPartyLetterAndColour(party) {
  return partyColours[party] ? partyColours[party] : {letter: '?', colour: '#a8a8a8ff'}; // Default if unknown
}

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
    partyCircleContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
    },
    partyCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
        marginBottom: 6,
    },
    partyLetter: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    resultTrue: {
        color: 'green',
    }
    ,
    resultFalse: {
        color: 'red',
    }
});
