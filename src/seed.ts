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
    description: "One of the rarest rhinos in the world",
    imageUrl: "https://example.com/javan-rhino.jpg",
    createdAt: new Date(),
  },
  {
    name: "Bali Myna",
    scientificName: "Leucopsar rothschildi",
    status: "critically_endangered",
    type: "bird",
    habitat: "Bali, Indonesia",
    description: "A rare bird native to Bali",
    imageUrl: "https://example.com/bali-myna.jpg",
    createdAt: new Date(),
  },
  {
    name: "Sumatran Tiger",
    scientificName: "Panthera tigris sumatrae",
    status: "critically_endangered",
    type: "mammal",
    habitat: "Sumatra, Indonesia",
    description: "A tiger subspecies from Sumatra",
    imageUrl: "https://example.com/sumatran-tiger.jpg",
    createdAt: new Date(),
  },
];

const dummyOrganizations: Organization[] = [
  {
    name: "Ujung Kulon Conservation Group",
    type: "community",
    location: "Banten, Indonesia",
    description: "Local group protecting Javan Rhinos",
    imageUrl: "https://example.com/ujungkulon-group.jpg",
    createdAt: new Date(),
  },
  {
    name: "Bali Bird Foundation",
    type: "community",
    location: "Bali, Indonesia",
    description: "Community-led bird conservation organization",
    imageUrl: "https://example.com/bali-bird.jpg",
    createdAt: new Date(),
  },
  {
    name: "Sumatra Wildlife School",
    type: "school",
    location: "Sumatra, Indonesia",
    description: "School teaching wildlife conservation",
    imageUrl: "https://example.com/sumatra-school.jpg",
    createdAt: new Date(),
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
