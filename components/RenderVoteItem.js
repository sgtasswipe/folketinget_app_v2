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
          { fontSize: 10 };
        
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
  const handlePress = () => {
    navigation.navigate("VoteDetails", { voteItem: item });
  };

  const title = item?.titel || "No Title Available";

  return (
    <Pressable onPress={handlePress} style={styles.itemContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.date}>Dato: {item.dato}</Text>
      <Text style={[item.konklusion ? styles.resultTrue : styles.resultFalse]}>
        {item.konklusion ? 'Vedtaget' : 'Ikke vedtaget'}
      </Text>
      <Text></Text>
      <Text>For: {item.inFavor}</Text>
      <PartyCircles parties={item.inFavorList} />
      <Text></Text>
      <Text>Imod: {item.against}</Text>
      <PartyCircles parties={item.againstList} />
    </Pressable>
  );
};

const partyColours = {
  S: { letter: 'S', colour: '#e53838' },
  V: { letter: 'V', colour: '#205da5' },
  M: { letter: 'M', colour: '#b48cd2' },
  DD: { letter: 'DD', colour: '#78a0e1' },
  SF: { letter: 'SF', colour: '#ef75ca' },
  LA: { letter: 'LA', colour: '#1db9ce' },
  KF: { letter: 'KF', colour: '#8b8474' },
  EL: { letter: 'EL', colour: '#eb7341' },
  DF: { letter: 'DF', colour: '#f9c153' },
  RV: { letter: 'RV', colour: '#78378c' },
  ALT: { letter: 'ALT', colour: '#32913c' },
  NB: { letter: 'NB', colour: '#127b7f' },
  UFG: { letter: 'UFG', colour: '#8d95a5' }
};

function getPartyLetterAndColour(party) {
  return partyColours[party] ? partyColours[party] : { letter: '?', colour: '#a8a8a8ff' };
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
