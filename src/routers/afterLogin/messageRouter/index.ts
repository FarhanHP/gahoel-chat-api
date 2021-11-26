import { Router } from 'express';
import createMessageHandler from './createMessageHandler';
import createNewMessageHandler from './createNewMessageHandler';

const router = Router()

router.post('/create/new', createNewMessageHandler);

router.post('/create', createMessageHandler);

export default router;
