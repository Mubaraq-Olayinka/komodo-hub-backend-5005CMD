import { db } from "./config/firebase";
import { Species } from "./types/species";
import { Organization } from "./types/organization";

const dummySpecies: Species[] = [
  {
    name: "Javan Rhino",
    scientificName: "Rhinoceros sondaicus",
    status: "critically_endangered",
    type: "mammal",
    habitat: "Ujung Kulon National Park",
    description: "They are small, single-horned rhinoceroses with folded skin resembling armor. Only males have horns (typically <25 cm), while females are generally hornless",
    imageUrl: "https://images.pexels.com/photos/5969262/pexels-photo-5969262.jpeg?_gl=1*1cva6hz*_ga*MTM2MjIwMTk2NC4xNzcxOTM1NzM4*_ga_8JE65Q40S6*czE3NzQ2MDc4NDEkbzIkZzEkdDE3NzQ2MDgwMjkkajI5JGwwJGgw",
    tags: ["rare", "protected", "indonesia", "rhino"],
    createdAt: new Date().toISOString(),
  },
  {
    name: "Bali Myna",
    scientificName: "Leucopsar rothschildi",
    status: "critically_endangered",
    type: "bird",
    habitat: "Bali, Indonesia",
    description: "Bali starling is recognized by its almost pure white plumage, black wing/tail tips, and bright blue bare skin around the eyes. Known for a long, drooping crest, these social birds inhabit coastal forests and are highly coveted in the pet trade",
    imageUrl: "https://images.pexels.com/photos/7199367/pexels-photo-7199367.jpeg?_gl=1*g4o3kn*_ga*MTM2MjIwMTk2NC4xNzcxOTM1NzM4*_ga_8JE65Q40S6*czE3NzQ2MDc4NDEkbzIkZzEkdDE3NzQ2MDc5NzMkajI1JGwwJGgw",
    tags: ["rare", "protected", "indonesia", "rhino"],
    createdAt: new Date().toISOString(),
  },
  {
    name: "Sumatran Tiger",
    scientificName: "Panthera tigris sumatrae",
    status: "critically_endangered",
    type: "mammal",
    habitat: "Sumatra, Indonesia",
    description: "Critically endangered with fewer than 400 left in the wild, they are known for their dark, thick, closely spaced stripes and a small mane, which help them camouflage in dense jungles.",
    imageUrl: "https://images.pexels.com/photos/68134/tiger-sumatran-sumatran-tiger-tiger-cub-68134.jpeg?_gl=1*172b508*_ga*MTM2MjIwMTk2NC4xNzcxOTM1NzM4*_ga_8JE65Q40S6*czE3NzQ2MDc4NDEkbzIkZzEkdDE3NzQ2MDc5MDAkajEkbDAkaDA.",
    tags: ["bird", "endemic", "bali", "protected"],
    createdAt: new Date().toISOString(),
  },
];

const dummyOrganizations: Organization[] = [
  {
    name: "Ujung Kulon Conservation Group",
    type: "community",
    location: "Banten, Indonesia",
    description: "Local group protecting Javan Rhinos",
    imageUrl: "https://example.com/ujungkulon-group.jpg",
    createdAt: new Date().toISOString(),
  },
  {
    name: "Bali Bird Foundation",
    type: "community",
    location: "Bali, Indonesia",
    description: "Community-led bird conservation organization",
    imageUrl: "https://example.com/bali-bird.jpg",
    createdAt: new Date().toISOString(),
  },
  {
    name: "Sumatra Wildlife School",
    type: "school",
    location: "Sumatra, Indonesia",
    description: "School teaching wildlife conservation",
    imageUrl: "https://example.com/sumatra-school.jpg",
    createdAt: new Date().toISOString(),
  },
];

const seed = async () => {
  try {
    console.log("Seeding species...");
    for (const s of dummySpecies) {
      await db.collection("species").add(s);
    }

    console.log("Seeding organizations...");
    for (const o of dummyOrganizations) {
      await db.collection("organizations").add(o);
    }

    console.log("✅ Seeding completed!");
    process.exit(0);
  } catch (error: any) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seed();
