import {Router} from 'express';
import {
  addHealthCondition,
  addVital,
  getHealthScore,
  getHealthSummary,
  listAllergies,
  listHealthConditions,
  listVitals,
} from '../services/healthSummary.js';

export const healthSummaryRouter = Router();

healthSummaryRouter.get('/:profileId/health-summary', (req, res) => {
  res.json(getHealthSummary(req.params.profileId));
});

healthSummaryRouter.get('/:profileId/conditions', (req, res) => {
  res.json(listHealthConditions(req.params.profileId));
});

healthSummaryRouter.post('/:profileId/conditions', (req, res) => {
  res.status(201).json(addHealthCondition(req.params.profileId, req.body ?? {}));
});

healthSummaryRouter.get('/:profileId/allergies', (req, res) => {
  res.json(listAllergies(req.params.profileId));
});

healthSummaryRouter.get('/:profileId/vitals', (req, res) => {
  res.json(listVitals(req.params.profileId));
});

healthSummaryRouter.post('/:profileId/vitals', (req, res) => {
  res.status(201).json(addVital(req.params.profileId, req.body ?? {}));
});

healthSummaryRouter.get('/:profileId/health-score', (req, res) => {
  res.json(getHealthScore(req.params.profileId));
});
