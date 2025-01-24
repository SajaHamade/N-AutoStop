import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import'./Feedbacks.css'

const Feedbacks = () => {
    const { rideId } = useParams();
    const navigate = useNavigate();
    const [feedbacksFetched, setFeedbacksFetched] = useState([]);
    const [userFeedback, SetUserFeedback] = useState(false);
    const [feedback, setFeedback] = useState({});
    const [rating, setRating] = useState({});

    useEffect(() => {
        const fetchRideHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`http://localhost:3000/requests/get-feedbacks/${rideId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setFeedbacksFetched(response.data.feedback);
                if(response.data.message === 'User Did not add a feedback ,Feedbacks fetched successfully.'){
                    SetUserFeedback(true);
                }
            } catch (error) {
                console.error('Error fetching ride history:', error);
            }
        };
        




        console.log('Ride id' , rideId);
        fetchRideHistory();

    }, []);



    const handleSubmitFeedback = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await axios.post(
                `http://localhost:3000/requests/submit-feedback/${rideId}`,
                {
                    rating,
                    feedback,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

           alert("Feedback Sent !")
            SetUserFeedback(false);
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    return (
        <div>
       <h2>Feedbacks</h2>
            {feedbacksFetched.length > 0 ? (
                <div className="feedback-list">
                    {feedbacksFetched.map((f) => (
                        <div key={f.UserId} className="feedback-card">
                            <p>
                                <strong>Rating:</strong> {f.rating}/5
                            </p>
                            <p>
                                <strong>Message:</strong> {f.message}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-feedback-message">No one provided feedback yet.</p>
            )}

            {userFeedback ? (
                <div className="feedback-section">
                    <div>
                        <label>Rating (1-5):</label>
                        <select onChange={(e) =>setRating(e.target.value)}>
                            <option value="">Select Rating</option>
                            {[1, 2, 3, 4, 5].map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Feedback:</label>
                        <textarea
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Write your feedback here..."
                        />
                    </div>

                    <button onClick={handleSubmitFeedback} className="submit-feedback-btn">
                        Submit Feedback
                    </button>
                </div>
            ): (<></>)}
        </div>
    );
};

export default Feedbacks;
