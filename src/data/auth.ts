import {
  Auth,
  GoogleAuthProvider,
  getAdditionalUserInfo,
  getAuth,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import {
  CollectionReference,
  collection,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useCallback } from "react";
import {
  useAuth,
  useFirestore,
  useFirestoreDocDataOnce,
  useUser,
} from "reactfire";
import { Optional } from "utility-types";

export type TUser = {
  uid: string;
  name: string;
  email: string;
  displayPicture?: string | null;
  created_at?: string;
  updated_at?: string;
  emailVerified?: boolean;
  providerId: "firebase";
  roles?: string[];
};

function useUsersCollection() {
  const store = useFirestore();
  return collection(store, "Users") as CollectionReference<TUser>;
}

export function useUserDocument(userId: string) {
  const coursesCollection = useUsersCollection();
  return doc(coursesCollection, userId);
}

export function useLoginCredentials() {
  const auth = useAuth();
  const createProfile = useCreateProfile();

  const loginWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      const credentials = await signInWithPopup(auth, provider);
      const isNewUser = getAdditionalUserInfo(credentials)?.isNewUser;
      if (isNewUser) {
        await createProfile(auth);
        return true;
      }
      return true;
    } catch (e) {
      const err = e as Error;
      throw err;
    }
  }, [auth, createProfile]);

  return {
    loginWithGoogle,
  };
}

export function useCreateProfile() {
  const usersCollection = useUsersCollection();
  return useCallback(
    async (authUser: Auth, data?: Optional<TUser>) => {
      const { currentUser } = authUser;
      const userDoc = doc(usersCollection, currentUser?.uid || "missing");
      if (!currentUser) throw new Error("Please login to create profile");
      if (currentUser) {
        // update the auth profile
        const userToCreate: TUser = {
          uid: currentUser.uid,
          name: currentUser?.displayName || data?.name || "Unknown",
          email: currentUser?.email || "",
          displayPicture: currentUser?.photoURL,
          created_at: currentUser.metadata?.creationTime,
          updated_at: currentUser.metadata?.lastSignInTime,
          emailVerified: currentUser.emailVerified || false,
          providerId: "firebase",
        };
        await setDoc(userDoc, {
          ...userToCreate,
        });
      }
    },
    [usersCollection]
  );
}

export function useUpdateProfile() {
  const { data: authUser } = useUser();
  const userDoc = useUserDocument(authUser?.uid || "missing");
  return useCallback(
    async function update(data: Optional<TUser>) {
      if (!authUser) throw new Error("Please login to update profile");
      if (data.name) {
        // update the auth profile
        updateProfile(authUser, {
          displayName: data.name,
        });
      }
      await updateDoc(userDoc, data);
      reloadUserAuth();
    },
    [userDoc, authUser]
  );
}

export async function reloadUserAuth() {
  const authUser = getAuth().currentUser;
  await authUser?.reload();
}

export function useProfile() {
  const { data: authUser } = useUser();
  const userDoc = useUserDocument(authUser?.uid || "missing");
  const { data: user } = useFirestoreDocDataOnce<TUser>(userDoc, {
    idField: "uid",
  });
  const update = useUpdateProfile();
  return {
    user,
    update,
  };
}
