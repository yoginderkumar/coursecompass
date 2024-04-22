import {
  Auth,
  GoogleAuthProvider,
  getAdditionalUserInfo,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  AuthError,
  createUserWithEmailAndPassword,
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

type UserRoles = "user" | "admin" | "super_admin";

export type TUser = {
  uid: string;
  name: string;
  email: string;
  displayPicture?: string | null;
  created_at?: string;
  updated_at?: string;
  emailVerified?: boolean;
  providerId: "firebase" | "mail" | "google";
  role: UserRoles;
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
        await createProfile(auth, {}, "google");
        return true;
      }
      return true;
    } catch (e) {
      throw handleFirebaseAuthError(e as AuthError);
    }
  }, [auth, createProfile]);

  const loginWithEmail = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        return true;
      } catch (e) {
        throw handleFirebaseAuthError(e as AuthError);
      }
    },
    [auth]
  );

  const signupWithEmail = useCallback(
    async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        await createProfile(auth, { name }, "mail");
        return true;
      } catch (e) {
        throw handleFirebaseAuthError(e as AuthError);
      }
    },
    [auth, createProfile]
  );

  return {
    loginWithEmail,
    loginWithGoogle,
    signupWithEmail,
  };
}

export function useCreateProfile() {
  const usersCollection = useUsersCollection();
  return useCallback(
    async (
      authUser: Auth,
      data?: Optional<TUser>,
      provider?: "mail" | "google"
    ) => {
      const { currentUser } = authUser;
      const userDoc = doc(usersCollection, currentUser?.uid || "missing");
      if (!currentUser) throw new Error("Please login to create profile");
      if (currentUser) {
        // update the auth profile
        const userToCreate: TUser = {
          uid: currentUser.uid,
          name: currentUser?.displayName || data?.name || "Unknown",
          email: currentUser?.email || "",
          role: "user",
          displayPicture: currentUser?.photoURL,
          created_at: currentUser.metadata?.creationTime,
          updated_at: currentUser.metadata?.lastSignInTime,
          emailVerified: currentUser.emailVerified || false,
          providerId: provider || "firebase",
        };
        if (data?.name) {
          // update the auth profile
          updateProfile(currentUser, { displayName: data.name });
          currentUser.reload();
        }
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

export enum USER_PERMISSIONS {
  ADD_COURSE = "ADD_COURSE",
  EDIT_COURSE = "EDIT_COURSE",
  DELETE_COURSE = "DELETE_COURSE",
  ADD_AUTHOR = "ADD_AUTHOR",
  EDIT_AUTHOR = "EDIT_AUTHOR",
  DELETE_AUTHOR = "DELETE_AUTHOR",
  ADD_CATEGORY = "ADD_CATEGORY",
  EDIT_CATEGORY = "EDIT_CATEGORY",
  DELETE_CATEGORY = "DELETE_CATEGORY",
  MENTION_OTHER_AUTHOR = "MENTION_OTHER_AUTHOR",
}

export function getRoleDetails(role: UserRoles) {
  return ROLES_AND_PERMISSIONS[role];
}

export function checkIfUserCan(
  role: UserRoles,
  ...permissions: Array<USER_PERMISSIONS>
) {
  const userPermissions: Array<USER_PERMISSIONS> =
    getRoleDetails(role).permissions;
  return permissions.every((p) => userPermissions.indexOf(p) !== -1);
}

const ROLES_AND_PERMISSIONS = {
  user: {
    id: "user" as const,
    title: "User",
    permissions: [],
  },
  admin: {
    id: "admin" as const,
    title: "Admin",
    permissions: [
      USER_PERMISSIONS.ADD_COURSE,
      USER_PERMISSIONS.EDIT_COURSE,
      USER_PERMISSIONS.DELETE_COURSE,
    ],
  },
  super_admin: {
    id: "super_admin" as const,
    title: "Super Admin",
    permissions: [
      USER_PERMISSIONS.ADD_COURSE,
      USER_PERMISSIONS.EDIT_COURSE,
      USER_PERMISSIONS.DELETE_COURSE,
      USER_PERMISSIONS.ADD_AUTHOR,
      USER_PERMISSIONS.ADD_CATEGORY,
      USER_PERMISSIONS.EDIT_AUTHOR,
      USER_PERMISSIONS.EDIT_CATEGORY,
      USER_PERMISSIONS.DELETE_AUTHOR,
      USER_PERMISSIONS.DELETE_CATEGORY,
      USER_PERMISSIONS.MENTION_OTHER_AUTHOR,
    ],
  },
};

export function handleFirebaseAuthError(error: AuthError): string {
  switch (error.code) {
    case "auth/wrong-password":
      return "Invalid email or password.";
    case "auth/user-not-found":
      return "User not found. Please create an account.";
    case "auth/weak-password":
      return "Password is too weak. Please choose a stronger password.";
    case "auth/email-already-in-use":
      return "Email already in use. Please try a different email.";
    case "auth/invalid-email":
      return "Invalid email address. Please enter a valid email.";
    case "auth/operation-not-allowed":
      return "This operation is not allowed. Please contact support.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with the same email but different sign-in credentials. Sign in with the appropriate provider.";
    case "auth/invalid-login-credentials":
      return "Invalid credentials. Please enter a valid email & password.";
    case "auth/popup-closed-by-user":
      return "Please select a valid account in order to proceed.";
    default:
      return "An error occurred. Please try again later.";
  }
}
