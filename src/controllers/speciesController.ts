import { Request, Response } from 'express';
import * as service from '../services/speciesService';
import { AuthRequest } from '../middleware/auth';

export const getAll = async (req: Request, res: Response) => {
  try {
    const { search, type, status } = req.query;

    const data = await service.getAllSpecies(
      search as string,
      type as string,
      status as string
    );

    res.json(data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await service.getSpeciesById(id);

    if (!data) {
      return res.status(404).json({ message: 'Species not found' });
    }

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getByOrganization = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user?.organizationId) {
      return res.status(400).json({ message: 'Organization missing' });
    }

    const { search, type, status } = req.query;

    const data = await service.getSpeciesByOrganization(
      req.user.organizationId,
      search as string,
      type as string,
      status as string
    );

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'teacher') {
      return res.status(403).json({ message: 'Forbidden: teachers only' });
    }

    if (!req.user?.organizationId) {
      return res.status(400).json({ message: 'Organization missing' });
    }

    const { name, scientificName, status, type, habitat, description, imageUrl, tags, keyThreats, educationalFacts, about, quickFact } = req.body;

    if (!name || !scientificName || !status || !type || !habitat || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const data = await service.createSpecies({
      name,
      scientificName,
      status,
      type,
      habitat,
      description,
      imageUrl: imageUrl ?? '',
      tags: tags ?? [],
      organizationId: req.user.organizationId,
      keyThreats: keyThreats ?? [],
      educationalFacts: educationalFacts ?? [],
      about: about ?? '',
      quickFact: {
        conservationStatus: status,
        category: type,
        region: '',
      },
    });

    res.status(201).json(data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};