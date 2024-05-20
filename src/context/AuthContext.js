import React, { useContext, useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase-config';
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    // Function to send the sign-in link
    const sendSignInLink = (email, actionCodeSettings) => {
        return sendSignInLinkToEmail(auth, email, actionCodeSettings)
            .then(() => {
                localStorage.setItem('emailForSignIn', email);
                console.log(`emailForSignIn set ${email}`);
            })
            .catch(error => {
                throw error;
            });
    };

    const finishSignInFromLink = async (url, email) => {
        console.log(`do we have an email? ${email}`);
        if (!email) {
            throw new Error('Email not found. Please re-enter your email for confirmation.');
        }

        try {
            const result = await signInWithEmailLink(auth, email, url);
            setCurrentUser(result.user);
            console.log(`User signed in and set: ${result.user}`);
            navigate('/');
        } catch (error) {
            console.error('Error during sign-in:', error);
            navigate('/login');
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setCurrentUser(user);
            } else {
                navigate('/login');
            }
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, [navigate]);

    const logout = () => {
        return signOut(auth); // Logs out the user
    };

    const value = {
        currentUser,
        sendSignInLink,
        finishSignInFromLink,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;