import express from 'express'
import AddRequest , {GetSentRequests,GetReceivedRequests , AcceptRequest , DenyRequest , GetScheduledRides , GetOldRides ,GetFeedbacks, submitFeedback} from '../Controller/Requests.js';
import verifyUser from '../middlewares/verifyUser.js';

const router = express.Router();

router.post('/addRequest' , AddRequest);
router.get('/get-sent-requests' , verifyUser , GetSentRequests) ;
router.get('/get-received-requests' , verifyUser , GetReceivedRequests) ;
router.post('/accept-request',AcceptRequest);
router.post('/deny-request' , DenyRequest);
router.get('/get-scheduled-rides',verifyUser , GetScheduledRides );
router.get('/get-old-rides',verifyUser , GetOldRides );
router.post('/submit-feedback/:rideId', verifyUser, submitFeedback);
router.get('/get-feedbacks/:rideId', verifyUser, GetFeedbacks);









export default router ; 