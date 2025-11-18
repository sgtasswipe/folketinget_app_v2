import { View, Text, Pressable } from 'react-native';
import { use, useState, useEffect } from 'react';

export default function HomeScreen() {
const [apiData, setApiData] = useState([])
const [page, setPage] = useState(0)
const pageSize = 20;
const [searchQuery, setSearchQuery] = useState("")
const fetchApi = async () => {
 const apiUrl = `https://oda.ft.dk/api/Afstemning?$inlinecount=allpages&$orderby=opdateringsdato desc&$skip=${
        page * pageSize
      }&$top=${pageSize}&$expand=Sagstrin,Sagstrin/Sag &$filter=(typeid eq 1 or typeid eq 3)`
      response = await fetch(apiUrl)
      const extractedData = await response.json()
      setApiData(extractedData)
      console.log(extractedData)
    }
        useEffect(() => {
    fetchApi(); 
  }, [page]); 
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Pressable onPress={fetchApi} >
        <Text>Fetch Data: Press! </Text>
      </Pressable>
    </View>
  );
}
