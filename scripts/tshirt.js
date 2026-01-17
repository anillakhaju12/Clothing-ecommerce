// jaccard.js

// ----------------------------------------
// Jaccard Similarity Function
// ----------------------------------------
function jaccardSimilarity(str1, str2) {
  const set1 = new Set(str1.toLowerCase().split(/\s+/));
  const set2 = new Set(str2.toLowerCase().split(/\s+/));

  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
}

// ----------------------------------------
// Dataset: 10 T-shirt Names
// ----------------------------------------
const tshirts = [
  "Black Cotton Round Neck T shirt",
  "White Oversized Graphic Tee",
  "Blue Sports Dry-fit T shirt",
  "Vintage Washed Brown Tee",
  "Anime Printed White T shirt",
  "Plain Red Comfortable Tee",
  "Streetwear Urban Black Tee",
  "Minimalist Logo Grey T shirt",
  "Classic Fit Blue Polo",
  "Dark Green black t shirt Long Sleeve Tee"
];

// ----------------------------------------
// Search Query (You Can Change This)
// ----------------------------------------
const searchQuery = "black t shirt";

// ----------------------------------------
// Calculate Jaccard Score for Each T-shirt
// ----------------------------------------
const results = tshirts.map(name => ({
  name,
  score: jaccardSimilarity(searchQuery, name)
}));

// ----------------------------------------
// Sort by Score (Highest First)
// ----------------------------------------
results.sort((a, b) => b.score - a.score);

// ----------------------------------------
// Display Results
// ----------------------------------------
console.log("\n🔍 Jaccard Similarity Results:\n");

results.forEach(item => {
  console.log(`${item.name}  →  Score: ${item.score.toFixed(3)}`);
});

console.log("\nDone.\n");
