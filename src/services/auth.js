import firebase from '../../config/firebase-config';

// Function to register user with email and password
export const registerWithEmailPassword = async (email, password) => {
  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    // Additional logic or state updates based on successful registration
    return userCredential;
  } catch (error) {
    // Handle errors like duplicate email, weak password, etc.
    throw error;
  }
};