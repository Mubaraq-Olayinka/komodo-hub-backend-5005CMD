import { db } from "../config/firebase";
import { Species, SpeciesDetails } from "../types/species";

export const getAllSpecies = async (
  search?: string,
  type?: string,
  status?: string,
): Promise<Species[]> => {
  let query: FirebaseFirestore.Query = db.collection("species");

  if (type) {
    query = query.where("type", "==", type);
  }

  if (status) {
    query = query.where("status", "==", status);
  }

  const snapshot = await query.get();

  let results = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Species),
  }));

  // 🔍 search (client-side for now)
  if (search) {
    const term = search.toLowerCase();
    results = results.filter((s) => s.name.toLowerCase().includes(term));
  }

  return results;
};

export const getSpeciesById = async (id: string): Promise<SpeciesDetails | null> => {
  const doc = await db.collection("species").doc(id).get();

  if (!doc.exists) return null;
  const data = doc.data() as SpeciesDetails;

  return {
    id: doc.id,
    ...data,
    keyThreats: data.keyThreats || [],
    educationalFacts: data.educationalFacts || [],
    about: data.about || '',
    quickFact: data.quickFact || { conservationStatus: data.status, category: data.type, region: '' },
  };
};

export const getSpeciesByOrganization = async (
  organizationId: string,
  search?: string,
  type?: string,
  status?: string
): Promise<Species[]> => {
  let query: FirebaseFirestore.Query = db
    .collection('species')
    .where('organizationId', '==', organizationId);

  if (type) {
    query = query.where('type', '==', type);
  }

  if (status) {
    query = query.where('status', '==', status);
  }

  const snapshot = await query.get();

  let results = snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Species),
  }));

  // 🔍 search (still client-side)
  if (search) {
    const term = search.toLowerCase();
    results = results.filter(s =>
      s.name.toLowerCase().includes(term)
    );
  }

  return results;
};


export const createSpecies = async (
  data: Omit<SpeciesDetails, 'id' | 'createdAt'>,
): Promise<SpeciesDetails> => {
  const newSpecies = {
    ...data,
    createdAt: new Date().toISOString(),
    keyThreats: data.keyThreats ?? [],
    educationalFacts: data.educationalFacts ?? [],
    about: data.about ?? '',
    quickFact: data.quickFact ?? {
      conservationStatus: data.status,
      category: data.type,
      region: '',
    },
  };

  const docRef = await db.collection('species').add(newSpecies);

  return { id: docRef.id, ...newSpecies };
};

export const updateSpecies = async (
  id: string,
  data: Partial<Omit<SpeciesDetails, 'id' | 'createdAt'>>,
): Promise<SpeciesDetails> => {
  await db.collection('species').doc(id).update(data);

  const updated = await db.collection('species').doc(id).get();
  const updatedData = updated.data() as SpeciesDetails;

  return {
    id: updated.id,
    ...updatedData,
    keyThreats: updatedData.keyThreats || [],
    educationalFacts: updatedData.educationalFacts || [],
    about: updatedData.about || '',
    quickFact: updatedData.quickFact || {
      conservationStatus: updatedData.status,
      category: updatedData.type,
      region: '',
    },
  };
};