import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithCredential,
  FacebookAuthProvider,
  sendEmailVerification,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User, SubscriptionStatus, MembershipTier } from '../types';
import { generateReferralCode } from '../utils/referralUtils';

class AuthService {
  // Register new user
  async register(email: string, password: string, userData: Partial<User>): Promise<User> {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Generate a unique referral code
      const referralCode = generateReferralCode();

      // Prepare user data for Firestore
      const newUser: User = {
        id: firebaseUser.uid,
        email: email,
        displayName: userData.displayName || '',
        photoURL: userData.photoURL,
        cpf: userData.cpf || '',
        address: userData.address || {
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'Brasil',
        },
        subscriptionStatus: SubscriptionStatus.PENDING,
        commissionBalance: 0,
        tier: MembershipTier.BRONZE,
        referralCode,
        referredBy: userData.referredBy,
        activeReferrals: 0,
        createdAt: new Date(),
      };

      // Save user data to Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);

      // Update user profile in Firebase Auth
      if (userData.displayName) {
        await updateProfile(firebaseUser, {
          displayName: userData.displayName,
          photoURL: userData.photoURL,
        });
      }

      // Send email verification
      await sendEmailVerification(firebaseUser);

      // If referred by someone, update referrer's stats
      if (userData.referredBy) {
        await this.updateReferrerStats(userData.referredBy);
      }

      return newUser;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  // Login user
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User does not exist in database');
      }

      return userDoc.data() as User;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  // Sign in with Google
  async googleSignIn(idToken: string): Promise<User> {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const firebaseUser = userCredential.user;

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        // Create new user document
        const referralCode = generateReferralCode();
        
        const newUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL,
          cpf: '',
          address: {
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'Brasil',
          },
          subscriptionStatus: SubscriptionStatus.PENDING,
          commissionBalance: 0,
          tier: MembershipTier.BRONZE,
          referralCode,
          activeReferrals: 0,
          createdAt: new Date(),
        };

        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
        return newUser;
      }

      return userDoc.data() as User;
    } catch (error) {
      console.error('Error with Google sign in:', error);
      throw error;
    }
  }

  // Sign in with Facebook
  async facebookSignIn(accessToken: string): Promise<User> {
    try {
      const credential = FacebookAuthProvider.credential(accessToken);
      const userCredential = await signInWithCredential(auth, credential);
      const firebaseUser = userCredential.user;

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        // Create new user document
        const referralCode = generateReferralCode();
        
        const newUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL,
          cpf: '',
          address: {
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'Brasil',
          },
          subscriptionStatus: SubscriptionStatus.PENDING,
          commissionBalance: 0,
          tier: MembershipTier.BRONZE,
          referralCode,
          activeReferrals: 0,
          createdAt: new Date(),
        };

        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
        return newUser;
      }

      return userDoc.data() as User;
    } catch (error) {
      console.error('Error with Facebook sign in:', error);
      throw error;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Send password reset email
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userId: string, userData: Partial<User>): Promise<User> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, userData);

      // Get updated user data
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User does not exist');
      }

      return userDoc.data() as User;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const firebaseUser = auth.currentUser;
      
      if (!firebaseUser) {
        return null;
      }

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        return null;
      }

      return userDoc.data() as User;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }

  // Update referrer stats when a new user signs up with referral code
  private async updateReferrerStats(referralCode: string): Promise<void> {
    try {
      // Find the user with this referral code
      // Note: In a real app, you'd want to create an index for referralCode to make this query efficient
      const querySnapshot = await getDoc(doc(db, 'referralCodes', referralCode));
      
      if (!querySnapshot.exists()) {
        console.warn('Referral code not found:', referralCode);
        return;
      }

      const referrerId = querySnapshot.data().userId;
      const referrerRef = doc(db, 'users', referrerId);
      
      // Get current referrer data
      const referrerDoc = await getDoc(referrerRef);
      
      if (!referrerDoc.exists()) {
        console.warn('Referrer not found for code:', referralCode);
        return;
      }

      const referrer = referrerDoc.data() as User;
      
      // Update referrer stats
      await updateDoc(referrerRef, {
        activeReferrals: referrer.activeReferrals + 1,
      });
    } catch (error) {
      console.error('Error updating referrer stats:', error);
      throw error;
    }
  }
}

export default new AuthService();
