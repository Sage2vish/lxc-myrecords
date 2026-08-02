import {Router} from 'express';
import {getDoctorAvailability, getDoctorProfile, listDoctors} from '../services/doctors.js';

export const doctorsRouter = Router();

doctorsRouter.get('/search', (req, res) => {
  const name = typeof req.query.name === 'string' ? req.query.name : undefined;
  const specialization = typeof req.query.specialization === 'string' ? req.query.specialization : undefined;
  const location = typeof req.query.location === 'string' ? req.query.location : undefined;

  const items = listDoctors({name, specialization, location});

  res.json({
    filters: {
      name: name ?? null,
      specialization: specialization ?? null,
      location: location ?? null,
    },
    count: items.length,
    items,
  });
});

doctorsRouter.get('/:doctorId/profile', (req, res) => {
  const doctor = getDoctorProfile(req.params.doctorId);
  if (!doctor) {
    res.status(404).json({error: 'Doctor not found'});
    return;
  }

  res.json({
    doctorId: doctor.doctorId,
    name: doctor.name,
    specialization: doctor.specialization,
    location: doctor.location,
    yearsOfExperience: doctor.yearsOfExperience,
    profile: doctor.profile,
  });
});

doctorsRouter.get('/:doctorId/availability', (req, res) => {
  const availability = getDoctorAvailability(req.params.doctorId);
  if (!availability) {
    res.status(404).json({error: 'Doctor not found'});
    return;
  }

  res.json(availability);
});
