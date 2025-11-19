import { View, Text, Pressable, FlatList, StyleSheet, StatusBar } from 'react-native';
import { useState, useEffect } from 'react';
import RenderVoteItem from '../components/RenderVoteItem';

export default function HomeScreen({navigation}) {
const [apiData, setApiData] = useState([])
const [page, setPage] = useState(0)
const pageSize = 20;
const [searchQuery, setSearchQuery] = useState("")
const [hasMoreData, SetHasMoreData] = useState(true)
const [pressed, setPressed] = useState()

const endThreshold = 0.5 //Used for flatlist to tell it when to fetch more data - halfway through the list.  

const getVoteDataFromApi = async () => {
    console.log("func called")
    const apiUrl = `https://oda.ft.dk/api/Afstemning?$inlinecount=allpages&$orderby=opdateringsdato desc&$skip=${
        page * pageSize
      }&$top=${pageSize}&$expand=Sagstrin,Sagstrin/Sag &$filter=(typeid eq 1 or typeid eq 3)`

      const response = await fetch(apiUrl)
      const extractedData = await response.json()

      const augmentedItems = extractedData.value.map(item => {
        const {
          inFavor,
          against,
          inFavorList,
          againstList,
          conclusion
        } = extractVoteResults(item.konklusion);
        return {
          ...item,
          inFavor,
          against,
          inFavorList,
          againstList,
          conclusion
        }; 
      });

      // if page = 0 it is the first fetch, therefor we just take the extracteddata. 
      // If any data is already present in apidata
      // we use the spread operator to create a "copy"(new obj, not a actual copy) of the old data, and prepend the new data
      const newData = page === 0 ? augmentedItems : [...apiData, ...augmentedItems];
      setApiData(newData)
      // }
    }

        useEffect(() => {
    getVoteDataFromApi(); 
  }, [page]); 

//Use RenderVoteItem component
 const renderItem = ({ item }) => {
   return(
    <RenderVoteItem item={item} navigation={navigation}/>
   )
 }
 
 const loadMoreData = () => {
    if (hasMoreData) {
      setPage((prevPage) => prevPage + 1);
    }
  };
 
  return (
    <View style={styles.container}>
      <Text>Afstemninger</Text>
        <FlatList
        data={apiData}
        renderItem={renderItem}
        keyExtractor={item => item.Sagstrin.Sag.id.toString()}
        onEndReached={loadMoreData}
        onEndReachedThreshold={endThreshold}
        />
    </View>
    
  );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 10,
        backgroundColor: '#f9f9f9',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
})

// TODO: Display UFG even when name of member is shown e.g. Theresa Scavenius (UFG) should display UFG
function extractVoteResults(text) {
    const inFavorMatch = text.match(/For stemte (\d+) \(([^)]+(\)[^)]+)*?)\)/);
    const againstMatch = text.match(/imod stemte (\d+) \(([^)]+(\)[^)]+)*?)\)/);

    function splitList(str) {
        return str
            .split(/,\s*|\s+og\s+/)
            .map(item => item.trim())
            .filter(Boolean);
    }

    const inFavor = inFavorMatch ? parseInt(inFavorMatch[1], 10) : 0;
    const against = againstMatch ? parseInt(againstMatch[1], 10) : 0;

    const inFavorList = inFavorMatch ? splitList(inFavorMatch[2]) : [];
    const againstList = againstMatch ? splitList(againstMatch[2]) : [];

    const conclusion = inFavor > against;

    return {inFavor: inFavor, against, inFavorList: inFavorList, againstList: againstList, conclusion: conclusion};
}