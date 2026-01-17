
function tokenize(text) {
  if (!text || typeof text !== 'string') return [];
  return text
    .toLowerCase()
    .split(/\s+/)
    .filter(token => token.length > 0);
}


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

export function jaccard(setA, setB) {
  return jaccardDetailed(setA, setB).score;
}