export type SpeciesStatus =
  | "endangered"
  | "critically_endangered"
  | "vulnerable";

export type SpeciesType = "mammal" | "bird" | "reptile" | "marine";

export interface Species {
  id?: string;
  name: string;
  scientificName: string;
  status: SpeciesStatus;
  type: SpeciesType;
  habitat: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  tags: string[];
  organizationId: string;
}

export interface SpeciesDetails extends Species {
  keyThreats: string[];
  educationalFacts: string[];
  about: string;
  quickFact: {
    conservationStatus: string;
    category: string;
    region: string;
  };
}