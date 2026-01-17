/**
 * Tokenizes a string into an array of lowercase words
 * @param {string} text - The text to tokenize
 * @returns {string[]} Array of tokens
 */
function tokenize(text) {
  if (!text || typeof text !== 'string') return [];
  return text
    .toLowerCase()
    .split(/\s+/)
    .filter(token => token.length > 0);
}

/**
 * Calculates Jaccard similarity with detailed information
 * @param {string|string[]} setA - First set (keywords array or text string)
 * @param {string|string[]} setB - Second set (keywords array or text string)
 * @returns {Object} Object containing score, intersection, and union
 */
export function jaccardDetailed(setA, setB) {
  // Convert to arrays if strings are provided
  const tokensA = Array.isArray(setA) ? setA : tokenize(setA);
  const tokensB = Array.isArray(setB) ? setB : tokenize(setB);

  // Create sets for unique values
  const uniqueA = new Set(tokensA.map(t => String(t).toLowerCase()));
  const uniqueB = new Set(tokensB.map(t => String(t).toLowerCase()));

  // Calculate intersection (common elements)
  const intersection = [...uniqueA].filter(item => uniqueB.has(item));

  // Calculate union (all unique elements)
  const union = new Set([...uniqueA, ...uniqueB]);

  // Calculate Jaccard score: |A ∩ B| / |A ∪ B|
  const score = union.size === 0 ? 0 : intersection.length / union.size;

  return {
    score,
    intersection,
    union: [...union],
  };
}

/**
 * Simple Jaccard similarity (returns only the score)
 * @param {string|string[]} setA - First set
 * @param {string|string[]} setB - Second set
 * @returns {number} Jaccard similarity score (0 to 1)
 */
export function jaccard(setA, setB) {
  return jaccardDetailed(setA, setB).score;
}