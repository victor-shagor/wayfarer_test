import express from 'express';

import User from '../controllers/users';
import validate from '../middleware/validations';


const userRouter = express.Router();

const { verifyInput, verifySignin } = validate;
const { create, signin } = User;


userRouter.route('/api/v1/auth/signup').post(verifyInput, create);
userRouter.route('/api/v1/auth/signin').post(verifySignin, signin);


export default userRouter;
