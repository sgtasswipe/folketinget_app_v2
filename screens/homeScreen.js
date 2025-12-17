import {
  View,
  Text,
  Pressable,
  SectionList,
  TextInput,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import RenderVoteItem from "../components/RenderVoteItem";
import SearchOptionsModal from "../components/SearchOptionsModal";
import { processVoteItems } from "../util/dataUtils";
import { categorizeByTerm } from "../util/CategorizeByTerm";
import styles from "../styles/homeScreenStyles";

export default function HomeScreen({ navigation }) {
  const [apiData, setApiData] = useState([]);
  const [sectionedData, setSectionedData] = useState([]);
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const [hasMoreData, SetHasMoreData] = useState(true);

  // Search parameters
  const [matchCount, setMatchCount] = useState();
  const [matchThreshold, setMatchThreshold] = useState(0.8);
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isInSearchMode, setIsInSearchMode] = useState(false);

  const endThreshold = 0.5;

  const getVoteDataFromApi = async () => {
    console.log("Fetching parliament API data");

    const apiUrl = `https://oda.ft.dk/api/Afstemning?$inlinecount=allpages&$orderby=opdateringsdato desc&$skip=${page * pageSize
      }&$top=${pageSize}&$expand=Sagstrin,Sagstrin/Sag &$filter=(typeid eq 1 or typeid eq 3)`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      const augmentedItems = processVoteItems(data.value);
      const newData =
        page === 0 ? augmentedItems : [...apiData, ...augmentedItems];

      setApiData(newData);

      // Categorize in a separate try/catch
      try {
        setSectionedData(categorizeByTerm(newData));
      } catch (catError) {
        console.error("Error categorizing data:", catError);
      }
    } catch (fetchError) {
      console.error("Error fetching data:", fetchError);
      Alert.alert("Error", "Failed to fetch data");
    }
  };

  const performSearch = async () => {
    if (!searchInputValue.trim()) {
      Alert.alert("Empty Search", "Please enter a search query");
      return;
    }

    setIsSearching(true);
    setIsInSearchMode(true);
    setPage(0);

    try {
      const searchPayload = {
        query_text: searchInputValue.trim(),
        match_count: matchCount,
        match_threshold: matchThreshold,
      };

      const response = await fetch("http://20.251.146.203:5001/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchPayload),
      });

      const data = await response.json();
      console.log("performing search...");
      const augmentedItems = processVoteItems(data);
      console.log("Proccessed Search items");
      setApiData(augmentedItems);
      setSectionedData(categorizeByTerm(augmentedItems));
      setShowSearchOptions(false);
    } catch (error) {
      console.error("Error performing search:", error);
      Alert.alert("Search Error", "Failed to perform search");
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchInputValue("");
    setIsInSearchMode(false);
    setPage(0);
    setApiData([]);
  };

  useEffect(() => {
    if (!isInSearchMode) {
      getVoteDataFromApi();
    }
  }, [page]);

  const renderSectionHeader = ({ section }) => {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{section.title}</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return <RenderVoteItem item={item} navigation={navigation} />;
  };

  const loadMoreData = () => {
    if (hasMoreData && !isInSearchMode) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Afstemninger</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Søg efter afstemninger..."
          value={searchInputValue}
          onChangeText={setSearchInputValue}
          editable={!isSearching}
        />
        <Pressable style={styles.settingsButton} onPress={performSearch}>
          <Text style={styles.searchButton}>
            {isSearching ? "Søger" : "Søg"}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setShowSearchOptions(!showSearchOptions)}
          style={styles.settingsButton}
          disabled={isSearching}
        >
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </Pressable>
      </View>

      {/* Search Options Modal */}
      <SearchOptionsModal
        visible={showSearchOptions}
        onClose={() => setShowSearchOptions(false)}
        matchCount={matchCount}
        setMatchCount={setMatchCount}
        matchThreshold={matchThreshold}
        setMatchThreshold={setMatchThreshold}
        isSearching={isSearching}
        onSearch={performSearch}
      />

      {/* Active Search Display */}
      {isInSearchMode && (
        <View style={styles.activeSearchBanner}>
          <Text style={styles.activeSearchText}>
            Søger efter: "{searchInputValue}"
          </Text>
          <Pressable onPress={clearSearch} style={styles.clearSearchButton}>
            <Text style={styles.clearSearchText}>Nulstil</Text>
          </Pressable>
        </View>
      )}

      {/* Results List */}
      <SectionList
        sections={sectionedData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        onEndReached={loadMoreData}
        onEndReachedThreshold={endThreshold}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isSearching ? "Søger..." : "Ingen resultater fundet"}
            </Text>
          </View>
        }
      />
    </View>
  );
}
