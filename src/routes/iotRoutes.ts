import { Router } from 'express';
import * as iotController from '../controllers/iotController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { handleDeleteDevice } from '../controllers/iotController';

const router = Router();

router.post('/telemetry', authMiddleware, iotController.handleTelemetry);
router.get('/devices/patient/:id_paciente', authMiddleware, iotController.handleListDevicesForPatient);
router.get('/devices', authMiddleware, iotController.handleListDevices);
router.post('/devices', authMiddleware, iotController.handleRegisterDevice);
router.delete('/devices/:id_dispositivo', authMiddleware, handleDeleteDevice);
router.patch('/devices/:id_dispositivo', authMiddleware, iotController.handleUpdateDevice);

export default router;
