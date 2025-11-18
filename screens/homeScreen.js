import { View, Text, Pressable, FlatList, StyleSheet, StatusBar } from 'react-native';
import { useState, useEffect } from 'react';
import RenderVoteItem from '../components/RenderVoteItem';
export default function HomeScreen() {
const [apiData, setApiData] = useState([])
const [page, setPage] = useState(0)
const pageSize = 20;
const [searchQuery, setSearchQuery] = useState("")
const [hasMoreData, SetHasMoreData] = useState(true)
const endThreshold = 0.5 //Used for flatlist to tell it when to fetch more data - halfway through the list.  

const fetchApi = async () => {
    console.log("func called")
 const apiUrl = `https://oda.ft.dk/api/Afstemning?$inlinecount=allpages&$orderby=opdateringsdato desc&$skip=${
        page * pageSize
      }&$top=${pageSize}&$expand=Sagstrin,Sagstrin/Sag &$filter=(typeid eq 1 or typeid eq 3)`

      const response = await fetch(apiUrl)
      const extractedData = await response.json()
      // if page = 0 it is the first fetch, therefor we just take the extracteddata. 
      // If any data is already present in apidata
      // we use the spread operator to create a "copy"(new obj, not a actual copy) of the old data, and prepend the new data
      const newData = page === 0 ? extractedData.value : [...apiData, ...extractedData.value]
      setApiData(newData)
      console.log(extractedData.value[0].Sagstrin.Sag.titel)
      console.log("Hi")
      console.log(extractedData.value.length)
      console.log("RenderVoteItem:", RenderVoteItem);

    }
        useEffect(() => {
    fetchApi(); 
  }, [page]); 

//Use RenderVoteItem component
 const renderItem = ({ item }) => {
   return(
    <RenderVoteItem item={item}/>
   )
 }

 const loadMoreData = () => {
    if (hasMoreData) {
      setPage((prevPage) => prevPage + 1);
    }
  };
 
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Pressable 
                onPress={fetchApi}
                style={{ backgroundColor: '#007AFF', padding: 10, borderRadius: 5 }}
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    Load Votes (Page {page})
                </Text> 
            </Pressable>
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