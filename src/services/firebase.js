/**
 * Firebase Service
 * Handles authentication and Firestore operations
 * Project: here2help-2f8e9
 */
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// ── AUTH ──────────────────────────────────────────────────────────────────────

export const signUp = async (email, password, name, role = 'student') => {
  const userCredential = await auth().createUserWithEmailAndPassword(email, password);
  await userCredential.user.updateProfile({ displayName: name });
  await firestore().collection('users').doc(userCredential.user.uid).set({
    name,
    email,
    role, // 'student' | 'counsellor' | 'admin'
    createdAt: firestore.FieldValue.serverTimestamp(),
    isActive: true,
  });
  return userCredential.user;
};

export const signIn = async (email, password) => {
  const userCredential = await auth().signInWithEmailAndPassword(email, password);
  const doc = await firestore().collection('users').doc(userCredential.user.uid).get();
  return { user: userCredential.user, role: doc.data()?.role || 'student' };
};

export const signOut = async () => {
  await auth().signOut();
};

export const forgotPassword = async (email) => {
  await auth().sendPasswordResetEmail(email);
};

export const changePassword = async (currentPassword, newPassword) => {
  const user = auth().currentUser;
  const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);
  await user.reauthenticateWithCredential(credential);
  await user.updatePassword(newPassword);
};

export const getCurrentUser = () => auth().currentUser;

export const getUserRole = async (uid) => {
  const doc = await firestore().collection('users').doc(uid).get();
  return doc.data()?.role || 'student';
};

// ── SESSIONS & RATINGS ────────────────────────────────────────────────────────

export const saveSessionRating = async (sessionId, rating, feedback, studentId) => {
  await firestore().collection('session_ratings').add({
    sessionId,
    rating,
    feedback,
    studentId,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

export const getCounsellorSessions = async (counsellorId) => {
  const snapshot = await firestore()
    .collection('sessions')
    .where('counsellorId', '==', counsellorId)
    .orderBy('createdAt', 'desc')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createSession = async (studentId, studentName, topic, description) => {
  const ref = await firestore().collection('sessions').add({
    studentId,
    studentName,
    topic,
    description,
    status: 'waiting', // waiting | active | completed
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
  return ref.id;
};

export const updateSessionStatus = async (sessionId, status, counsellorId = null) => {
  const update = { status };
  if (counsellorId) update.counsellorId = counsellorId;
  await firestore().collection('sessions').doc(sessionId).update(update);
};

// ── ADMIN ─────────────────────────────────────────────────────────────────────

export const getAllUsers = async () => {
  const snapshot = await firestore().collection('users').orderBy('createdAt', 'desc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateUserRole = async (uid, role) => {
  await firestore().collection('users').doc(uid).update({ role });
};

export const deactivateUser = async (uid) => {
  await firestore().collection('users').doc(uid).update({ isActive: false });
};
