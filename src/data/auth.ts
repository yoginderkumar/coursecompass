import {
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
import { useAuth, useFirestore, useFirestoreDocData, useUser } from "reactfire";
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
        await createProfile();
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
  const { data: authUser } = useUser();
  const userDoc = useUserDocument(authUser?.uid || "missing");
  return useCallback(
    async (data?: Optional<TUser>) => {
      if (!authUser) throw new Error("Please login to create profile");
      if (authUser) {
        // update the auth profile
        const userToCreate: TUser = {
          uid: authUser.uid,
          name: authUser?.displayName || data?.name || "Unknown",
          email: authUser?.email || "",
          displayPicture: authUser?.photoURL,
          created_at: authUser.metadata?.creationTime,
          updated_at: authUser.metadata?.lastSignInTime,
          emailVerified: authUser.emailVerified || false,
          providerId: "firebase",
        };
        await setDoc(userDoc, {
          ...userToCreate,
        });
      }
    },
    [authUser, userDoc]
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
  const { data: user } = useFirestoreDocData<TUser>(userDoc, {
    idField: "uid",
  });
  const update = useUpdateProfile();
  return {
    user,
    update,
  };
}
