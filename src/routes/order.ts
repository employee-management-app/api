import { Router } from 'express';
import multer from 'multer';

import { getOrder, createOrder, updateOrder, deleteOrder, uploadFile, removeFile } from '../controllers/order';
import { verifyToken } from '../middlewares/verifyToken';

const upload = multer({ dest: './' });

export default (router: Router) => {
  router.get('/order/:id', [verifyToken], getOrder);
  router.post('/order', [verifyToken], createOrder);
  router.patch('/order/:id', [verifyToken], updateOrder);
  router.delete('/order/:id', [verifyToken], deleteOrder);
  router.post('/order/:id/file', [verifyToken, upload.single('file')], uploadFile);
  router.delete('/order/:id/file/:fileId', [verifyToken], removeFile);
};
