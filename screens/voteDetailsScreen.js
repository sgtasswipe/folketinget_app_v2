import { ScrollView, Text, StyleSheet } from 'react-native';
import {generalStyles} from '../styles/index'
import {PartyCircles} from '../components/RenderVoteItem';

const VoteDetailsScreen = ({ route }) => {
  const { voteItem: item } = route.params;

  return (
    <ScrollView style={styles.detailsContainer}>
      <Text style={styles.title}>{item?.titelkort}</Text>
      <Text style={generalStyles.date}>Dato: {item?.dato}</Text>
      <Text></Text>
      <Text style={[item.konklusion ? generalStyles.resultTrue : generalStyles.resultFalse]}>
        {item.konklusion ? 'Vedtaget' : 'Ikke vedtaget'}
      </Text>
      <Text></Text>
      <Text style={styles.paragraph}>
        {item?.resume ? item?.resume : item?.titel}
      </Text>      
      <Text></Text>
      <Text>Stemmer for: {item.inFavor}</Text>
      <PartyCircles parties={item.inFavorList}></PartyCircles>
      <Text></Text>
      <Text>Stemmer imod: {item.against}</Text>
      <PartyCircles parties={item.againstList}></PartyCircles>
      <Text></Text>
      <Text></Text>
      <Text></Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 16,
    backgroundColor: 'white',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
    paragraph: {
    fontSize: 12,
    marginBottom: 10,
  }
});

export default VoteDetailsScreen;