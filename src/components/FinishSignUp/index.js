import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FinishSignUp = () => {
    const { finishSignInFromLink } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (window.location.href.includes('apiKey')) {
            let email = localStorage.getItem('emailForSignIn');
            if (!email) {
                email = prompt('Please enter your email to complete verification:');
                if (email) {
                    finishSignInFromLink(window.location.href, email)
                    .then(() => {
                    })
                    .catch(error => {
                        console.error('Error completing sign in:', error);
                        navigate('/login');
                    });
                } else {
                    alert('Email is required to finish signing in.');
                    navigate('/login');
                }
            } else {
                finishSignInFromLink(window.location.href, email)
                .then(() => {
                    navigate('/calendar');
                })
                .catch(error => {
                    console.error('Error completing sign in:', error);
                    navigate('/login');
                });
            }

        }
    }, [finishSignInFromLink, navigate]);

    return (
        <div>Loading, please wait...</div>
    );
};

export default FinishSignUp;