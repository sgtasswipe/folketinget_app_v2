import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  StatusBar,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useState, useEffect } from "react";
import RenderVoteItem from "../components/RenderVoteItem";
import { processVoteItems } from "../util/dataUtils";

export default function HomeScreen({ navigation }) {
  const [apiData, setApiData] = useState([]);
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const [hasMoreData, SetHasMoreData] = useState(true);

  // Search parameters
  const [matchCount, setMatchCount] = useState(10);
  const [matchThreshold, setMatchThreshold] = useState(0.8);
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isInSearchMode, setIsInSearchMode] = useState(false);

  const endThreshold = 0.5;

  const getVoteDataFromApi = async () => {
    console.log("Fetching parliament API data");

    const apiUrl = `https://oda.ft.dk/api/Afstemning?$inlinecount=allpages&$orderby=opdateringsdato desc&$skip=${
      page * pageSize
    }&$top=${pageSize}&$expand=Sagstrin,Sagstrin/Sag &$filter=(typeid eq 1 or typeid eq 3)`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Process items from parliament API
      const augmentedItems = processVoteItems(data.value);

      const newData =
        page === 0 ? augmentedItems : [...apiData, ...augmentedItems];
      setApiData(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
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

      const response = await fetch("http://20.251.146.98:5001/search", {
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSearchOptions}
        onRequestClose={() => setShowSearchOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Søgeindstillinger</Text>
              <Pressable onPress={() => setShowSearchOptions(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </Pressable>
            </View>

            {/* Match Count Input */}
            <View style={styles.optionGroup}>
              <Text style={styles.optionLabel}>
                Antal resultater: {matchCount}
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={50}
                step={1}
                value={matchCount}
                onValueChange={setMatchCount}
                minimumTrackTintColor="#007AFF"
                maximumTrackTintColor="#e0e0e0"
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>1</Text>
                <Text style={styles.sliderLabel}>50</Text>
              </View>
            </View>

            {/* Match Threshold Slider */}
            <View style={styles.optionGroup}>
              <Text style={styles.optionLabel}>
                Matchgrænse (relevans): {matchThreshold.toFixed(2)}
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                step={0.05}
                value={matchThreshold}
                onValueChange={setMatchThreshold}
                minimumTrackTintColor="#007AFF"
                maximumTrackTintColor="#e0e0e0"
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>0 (lavt)</Text>
                <Text style={styles.sliderLabel}>1 (højt)</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalButtons}>
              <Pressable
                onPress={performSearch}
                style={[styles.button, styles.searchButton]}
                disabled={isSearching}
              >
                <Text style={styles.buttonText}>
                  {isSearching ? "Søger..." : "Søg"}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setShowSearchOptions(false)}
                style={[styles.button, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Annuller</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

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
      <FlatList
        data={apiData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "white",
    fontSize: 14,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  settingsButtonText: {
    fontSize: 18,
  },
  activeSearchBanner: {
    backgroundColor: "#E3F2FD",
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
    padding: 12,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activeSearchText: {
    flex: 1,
    color: "#1976D2",
    fontWeight: "500",
    fontSize: 12,
  },
  clearSearchButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#1976D2",
    borderRadius: 4,
  },
  clearSearchText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    fontSize: 24,
    color: "#666",
  },
  optionGroup: {
    marginBottom: 25,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  sliderLabel: {
    fontSize: 12,
    color: "#666",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButton: {
    backgroundColor: "#007AFF",
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    fontWeight: "500",
  },
});
