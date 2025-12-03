import { Text, View, StyleSheet, ScrollView } from "react-native";

// Date formatter
const formatDate = (isoString) => {
  if (!isoString) return "Ikke tilgængelig";

  const date = new Date(isoString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("da-DK", options);
};

export default function VoteDetailsScreen({ route }) {
  const { voteData } = route.params;

  const {
    id,
    sagId,
    afstemningId,
    titel,
    titelkort,
    resume,
    kommentar,
    dato,
    opdateringsdato,
    konklusion,
    vedtaget,
    inFavor,
    against,
    inFavorList,
    againstList,
    sourceFormat,
  } = voteData;

  const resultText = vedtaget ? "VEDTAGET" : "IKKE VEDTAGET";
  const resultStyle = vedtaget ? styles.resultPassed : styles.resultFailed;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Badge */}
      <Text style={[styles.resultBadge, resultStyle]}>{resultText}</Text>

      {/* Title */}
      <Text style={styles.title}>{titel}</Text>
      {titelkort ? <Text style={styles.shortTitle}>{titelkort}</Text> : null}

      {/* SUMMARY */}
      {resume ? (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>📄 Resume</Text>
          <Text style={styles.bodyText}>{resume}</Text>
        </View>
      ) : null}

      {/* CONCLUSION */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Konklusion</Text>
        <Text style={styles.bodyText}>{konklusion || "Ingen konklusion"}</Text>
      </View>

      {/* COMMENT */}
      {kommentar ? (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Bemærkning</Text>
          <Text style={styles.commentText}>{kommentar}</Text>
        </View>
      ) : null}

      {/* VOTE BREAKDOWN */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Stemmefordeling</Text>
        <Text style={styles.breakdownLine}>For: {inFavor}</Text>
        <Text style={styles.breakdownLine}>Imod: {against}</Text>

        <Text style={[styles.sectionSubHeader, { marginTop: 10 }]}>
          For – Partier
        </Text>
        {inFavorList?.length > 0 ? (
          inFavorList.map((p, i) => (
            <Text key={i} style={styles.metaText}>
              • {p}
            </Text>
          ))
        ) : (
          <Text style={styles.metaText}>Ingen data</Text>
        )}

        <Text style={[styles.sectionSubHeader, { marginTop: 10 }]}>
          Imod – Partier
        </Text>
        {againstList?.length > 0 ? (
          againstList.map((p, i) => (
            <Text key={i} style={styles.metaText}>
              • {p}
            </Text>
          ))
        ) : (
          <Text style={styles.metaText}>Ingen data</Text>
        )}
      </View>

      {/* ID SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>🔢 Identifikatorer</Text>
        <Text style={styles.metaText}>
          <Text style={styles.metaLabel}>ID:</Text> {id}
        </Text>
        <Text style={styles.metaText}>
          <Text style={styles.metaLabel}>Sag ID:</Text> {sagId}
        </Text>
      </View>

      {/* DATE SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>📅 Datoer</Text>
        <Text style={styles.metaText}>
          <Text style={styles.metaLabel}>Afstemningsdato:</Text>{" "}
          {formatDate(dato)}
        </Text>
        <Text style={styles.metaText}>
          <Text style={styles.metaLabel}>Opdateret:</Text>{" "}
          {formatDate(opdateringsdato)}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>🔧 Data Format </Text>
        <Text style={styles.metaText}>Format: {sourceFormat} </Text>
        <Text style={styles.metaText}>
          Bruges til debugging og sammenligning.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  contentContainer: {
    padding: 15,
    paddingBottom: 40,
  },

  /* BADGE */
  resultBadge: {
    fontSize: 14,
    fontWeight: "bold",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginBottom: 15,
    overflow: "hidden",
  },
  resultPassed: {
    backgroundColor: "#e6ffe6",
    color: "#006600",
  },
  resultFailed: {
    backgroundColor: "#ffe6e6",
    color: "#cc0000",
  },

  /* TITLES */
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 10,
  },
  shortTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    marginBottom: 20,
  },

  /* SECTIONS */
  section: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  sectionSubHeader: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },

  /* TEXT STYLES */
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
  },
  commentText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
    lineHeight: 20,
  },
  breakdownLine: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },

  metaText: {
    fontSize: 13,
    color: "#555",
    marginBottom: 3,
  },
  metaLabel: {
    fontWeight: "600",
    color: "#111",
  },
});
