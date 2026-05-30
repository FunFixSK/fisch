export type Rarity =
  | "Trash"
  | "Common"
  | "Uncommon"
  | "Unusual"
  | "Rare"
  | "Legendary"
  | "Mythical"
  | "Exotic"
  | "Secret";

export type Fish = {
  name: string;
  rarity: Rarity;
  minKg: number;
  maxKg: number;
  pricePerKg: number;
  shape: "small" | "carp" | "shark" | "eel" | "ray" | "monster";
};

export type CatchResult = {
  fish: Fish;
  weightKg: number;
  price: number;
  signal: string;
};

export type RadarMode = "normal" | "lucky" | "storm";

export type RadarModeConfig = {
  label: string;
  hint: string;
  weights: Record<Rarity, number>;
};

export const radarModes: Record<RadarMode, RadarModeConfig> = {
  normal: {
    label: "Normal",
    hint: "For regular fishing.",
    weights: {
      Trash: 14,
      Common: 34,
      Uncommon: 24,
      Unusual: 14,
      Rare: 8,
      Legendary: 3.5,
      Mythical: 1.6,
      Exotic: 0.7,
      Secret: 0.2,
    },
  },
  lucky: {
    label: "Lucky Spot",
    hint: "Use when the crew finds a magical place.",
    weights: {
      Trash: 8,
      Common: 24,
      Uncommon: 22,
      Unusual: 18,
      Rare: 14,
      Legendary: 7,
      Mythical: 3,
      Exotic: 1.2,
      Secret: 0.4,
    },
  },
  storm: {
    label: "Storm Hunt",
    hint: "Use when the captain starts a boss hunt.",
    weights: {
      Trash: 4,
      Common: 14,
      Uncommon: 16,
      Unusual: 18,
      Rare: 20,
      Legendary: 12,
      Mythical: 6,
      Exotic: 2.5,
      Secret: 1,
    },
  },
};

export const rarityCount = Object.keys(radarModes.normal.weights).length;

export const fishCatalog: Fish[] = [
  { name: "Seaweed Bundle", rarity: "Trash", minKg: 0.2, maxKg: 1.4, pricePerKg: 1, shape: "small" },
  { name: "Driftwood Snapper", rarity: "Trash", minKg: 0.4, maxKg: 2.2, pricePerKg: 2, shape: "carp" },
  { name: "Bootfish", rarity: "Trash", minKg: 0.8, maxKg: 3.5, pricePerKg: 1, shape: "small" },
  { name: "Pebble Minnow", rarity: "Common", minKg: 0.3, maxKg: 1.6, pricePerKg: 8, shape: "small" },
  { name: "Garden Carp", rarity: "Common", minKg: 1.2, maxKg: 6.5, pricePerKg: 10, shape: "carp" },
  { name: "Bluefin Sprat", rarity: "Common", minKg: 0.5, maxKg: 2.8, pricePerKg: 12, shape: "small" },
  { name: "Blanket Bass", rarity: "Common", minKg: 2.2, maxKg: 8.5, pricePerKg: 9, shape: "carp" },
  { name: "Lantern Guppy", rarity: "Uncommon", minKg: 0.4, maxKg: 2.1, pricePerKg: 22, shape: "small" },
  { name: "Silver Pike", rarity: "Uncommon", minKg: 3.5, maxKg: 12, pricePerKg: 18, shape: "carp" },
  { name: "Copper Eel", rarity: "Uncommon", minKg: 1.4, maxKg: 7.4, pricePerKg: 26, shape: "eel" },
  { name: "Moon Ray", rarity: "Unusual", minKg: 8, maxKg: 24, pricePerKg: 34, shape: "ray" },
  { name: "Fogfin", rarity: "Unusual", minKg: 2.5, maxKg: 9.8, pricePerKg: 31, shape: "small" },
  { name: "Rustjaw Pike", rarity: "Unusual", minKg: 5.5, maxKg: 18, pricePerKg: 29, shape: "carp" },
  { name: "Crystal Koi", rarity: "Rare", minKg: 4, maxKg: 16, pricePerKg: 74, shape: "carp" },
  { name: "Stormfin Tuna", rarity: "Rare", minKg: 18, maxKg: 55, pricePerKg: 64, shape: "shark" },
  { name: "Amber Fangfish", rarity: "Rare", minKg: 6, maxKg: 28, pricePerKg: 83, shape: "shark" },
  { name: "Gilded Shark", rarity: "Legendary", minKg: 80, maxKg: 380, pricePerKg: 150, shape: "shark" },
  { name: "Crownscale Leviathan", rarity: "Legendary", minKg: 220, maxKg: 850, pricePerKg: 190, shape: "monster" },
  { name: "Thunder Serpent", rarity: "Mythical", minKg: 60, maxKg: 420, pricePerKg: 320, shape: "eel" },
  { name: "Aurora Manta", rarity: "Mythical", minKg: 160, maxKg: 700, pricePerKg: 360, shape: "ray" },
  { name: "Starfall Marlin", rarity: "Exotic", minKg: 90, maxKg: 560, pricePerKg: 620, shape: "shark" },
  { name: "Void Whale", rarity: "Secret", minKg: 900, maxKg: 4200, pricePerKg: 1200, shape: "monster" },
];

const signals = [
  "Radar pulse stabilized",
  "Sonar echo locked",
  "Captain confirms contact",
  "Net signal detected",
  "Deep ripple identified",
  "Deck crew reports movement",
];

export function identifyCatch(mode: RadarMode): CatchResult {
  const rarity = pickRarity(radarModes[mode].weights);
  const candidates = fishCatalog.filter((fish) => fish.rarity === rarity);
  const fish = candidates[Math.floor(Math.random() * candidates.length)] ?? fishCatalog[0];
  const weightKg = randomWeight(fish.minKg, fish.maxKg);
  const price = Math.max(1, Math.round(weightKg * fish.pricePerKg));
  const signal = signals[Math.floor(Math.random() * signals.length)];

  return { fish, weightKg, price, signal };
}

export function rarityChance(mode: RadarMode, rarity: Rarity): string {
  const weights = radarModes[mode].weights;
  const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  const chance = (weights[rarity] / total) * 100;

  return chance >= 1 ? `${roundToOne(chance)}%` : `${roundToOne(chance)}%`;
}

function pickRarity(weights: Record<Rarity, number>): Rarity {
  const entries = Object.entries(weights) as Array<[Rarity, number]>;
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = Math.random() * total;

  for (const [rarity, weight] of entries) {
    roll -= weight;
    if (roll <= 0) {
      return rarity;
    }
  }

  return "Common";
}

function roundToOne(value: number): string {
  return value.toFixed(1).replace(/\.0$/, "");
}

function randomWeight(min: number, max: number): number {
  const skewed = Math.random() ** 1.8;
  const value = min + (max - min) * skewed;
  return Math.round(value * 10) / 10;
}
