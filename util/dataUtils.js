/**
 * Detect which format the data is in
 * Danish Parliament format has: Sagstrin.Sag structure
 * Custom API format has: sag_id, afstemning_id at root level
 */
export function detectDataFormat(item) {
  if (item.Sagstrin && item.Sagstrin.Sag) {
    return "parliament";
  } else if (item.sag_id !== undefined && item.afstemning_id !== undefined) {
    return "custom";
  }
  return "unknown";
}

/**
 * Normalize data from either format to a common structure
 */
export function normalizeVoteData(item) {
  const format = detectDataFormat(item);

  if (format === 'parliament') {
    return normalizeParliamentFormat(item);
  } else if (format === "custom") {
    return normalizeCustomFormat(item);
  }

  throw new Error(`Unknown data format for item: ${JSON.stringify(item)}`);
}

/**
 * Convert Danish Parliament API format to normalized format
 */
function normalizeParliamentFormat(item) {
  const sag = item.Sagstrin.Sag;

  return {
    // Unified IDs
    id: item.id,
    sagId: sag.id,
    afstemningId: item.id,

    // Text content
    titel: sag.titel,
    titelKort: sag.titelKort,
    resume: sag.resume || '',

    // Vote data
    konklusion: item.konklusion,
    vedtaget: item.vedtaget,
    kommentar: item.kommentar || '',

    // Dates
    dato: item.Sagstrin.dato,
    opdateringsdato: item.opdateringsdato,

    // Vote details (will be populated by extractVoteResults)
    inFavor: 0,
    against: 0,
    inFavorList: [],
    againstList: [],
    conclusion: false,

    // Original format reference
    sourceFormat: "Folketingets Åbne Data.",
    originalData: item,
  };
}

/**v
 * Convert custom API format to normalized format
 */
function normalizeCustomFormat(item) {
  return {
    // Unified IDs
    id: item.afstemning_id,
    sagId: item.sag_id,
    afstemningId: item.afstemning_id,

    // Text content
    titel: item.titel,
    titelkort: item.titelKort,
    resume: item.resume || '',

    // Vote data
    konklusion: item.konklusion,
    vedtaget: item.vedtaget,
    kommentar: item.kommentar || '',

    // Dates
    dato: item.afstemning_dato,
    opdateringsdato: item.opdateringsdato,

    // Vote details (will be populated by extractVoteResults)
    inFavor: 0,
    against: 0,
    inFavorList: [],
    againstList: [],
    conclusion: item.vedtaget || false,

    // Original format reference
    sourceFormat: "Hentet fra vores egen database",
    originalData: item,
  };
}

export function extractVoteResults(text) {
  const inFavorMatch = text.match(/For stemte (\d+) \(([^)]+(\)[^)]+)*?)\)/);
  const againstMatch = text.match(/imod stemte (\d+) \(([^)]+(\)[^)]+)*?)\)/);

  function splitList(str) {
    return str
      .split(/,\s*|\s+og\s+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  const inFavor = inFavorMatch ? parseInt(inFavorMatch[1], 10) : 0;
  const against = againstMatch ? parseInt(againstMatch[1], 10) : 0;

  const inFavorList = inFavorMatch ? splitList(inFavorMatch[2]) : [];
  const againstList = againstMatch ? splitList(againstMatch[2]) : [];

  const conclusion = inFavor > against;

  return {
    inFavor,
    against,
    inFavorList,
    againstList,
    conclusion,
  };
}

/**
 * Process items from any format
 */
export function processVoteItems(items) {
  return items.map((item) => {
    const normalized = normalizeVoteData(item);
    const voteResults = extractVoteResults(normalized.konklusion);

    return {
      ...normalized,
      ...voteResults,
    };
  });
}

export function formatDate(dateString) {
  if (!dateString) return "No Date";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}-${year}`;
};
