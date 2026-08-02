import {Router} from 'express';
import {
  addFamilyMember,
  getCurrentUserProfile,
  getProfileById,
  listCurrentUserFamily,
  shareProfile,
  updateCurrentUserProfile,
  updateProfileById,
} from '../services/profiles.js';

export const profilesRouter = Router();

profilesRouter.get('/me', (_req, res) => {
  res.json(getCurrentUserProfile());
});

profilesRouter.patch('/me', (req, res) => {
  res.json(updateCurrentUserProfile(req.body ?? {}));
});

profilesRouter.get('/me/family', (_req, res) => {
  res.json(listCurrentUserFamily());
});

profilesRouter.post('/me/family', (req, res) => {
  res.status(201).json(addFamilyMember(req.body ?? {}));
});

profilesRouter.get('/:profileId', (req, res) => {
  const profile = getProfileById(req.params.profileId);
  if (!profile) {
    res.status(404).json({error: 'Profile not found'});
    return;
  }

  res.json(profile);
});

profilesRouter.patch('/:profileId', (req, res) => {
  const updated = updateProfileById(req.params.profileId, req.body ?? {});
  if (!updated) {
    res.status(404).json({error: 'Profile not found'});
    return;
  }

  res.json(updated);
});

profilesRouter.post('/:profileId/sharing', (req, res) => {
  const shared = shareProfile(req.params.profileId);
  if (!shared) {
    res.status(404).json({error: 'Profile not found'});
    return;
  }

  res.json(shared);
});
