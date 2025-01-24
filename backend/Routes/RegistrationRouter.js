import express from 'express'
import Signup , {upload , login , GetUserDetails } from '../Controller/Registration.js'
import verifyUser from '../middlewares/verifyUser.js';

const router = express.Router();

router.post('/signup', upload.single('image'), Signup);

router.post('/login' , login);

router.get('/verify', verifyUser, (req, res) => {
    res.json({ message: "This is a verified user", user: req.user });
  });

router.post('/getUser' , GetUserDetails);

export default router ; 