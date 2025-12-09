import { processVoteItems } from "./dataUtils";
import { Alert } from "react-native";

export const getVoteDataFromApi = async ({
  page,
  pageSize,
  apiData,
  setApiData,
  SetHasMoreData,
}) => {
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

export const performSearch = async ({
  searchInputValue,
  matchCount,
  matchThreshold,
  setIsSearching,
  setIsInSearchMode,
  setPage,
  setApiData,
  setShowSearchOptions,
}) => {
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
    setShowSearchOptions(false);
  } catch (error) {
    console.error("Error performing search:", error);
    Alert.alert("Search Error", "Failed to perform search");
  } finally {
    setIsSearching(false);
  }
};
