import {Text, View, Pressable, StyleSheet} from "react-native"  

export default function VoteDetailsScreen({route}) {
    console.log(route)
    console.log(route.params)
    
    const {voteData} = route.params 
    const title = voteData.Sagstrin.Sag.titelkort
    const konklusion = voteData.Sagstrin.Sag.konklusion 
    return(
        <View>
            <Text>This is vote details</Text>
            <Text>{title}</Text>
        </View>
    )

}