import { StyleSheet, View, Text } from "react-native";
import { TouchableOpacity } from 'react-native';
import {generalStyles, partyColours} from '../styles/index'

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

  const title = item?.Sagstrin?.Sag?.titelkort || "No Title Available";

  const handlePress = () => {
    navigation.navigate('VoteDetails', { voteItem: item });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.itemContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={generalStyles.date}>Dato: {item.Sagstrin.dato}</Text>
      <Text></Text>
      <Text style={[item.conclusion ? generalStyles.resultTrue : generalStyles.resultFalse]}>
        {item.conclusion ? 'Vedtaget' : 'Ikke vedtaget'}
      </Text>
      <Text></Text>
      <Text>For: {item.inFavor}</Text>
      <PartyCircles parties={item.inFavorList}></PartyCircles>
      <Text></Text>
      <Text>Imod: {item.against}</Text>
      <PartyCircles parties={item.againstList}></PartyCircles>
    </TouchableOpacity>
  );
};

// TODO: Create a table in the database with these attributes and the party colours along with the daily fetching of new votings

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
    }
});

export {PartyCircles, getPartyLetterAndColour}