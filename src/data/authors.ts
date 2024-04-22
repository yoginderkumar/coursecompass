import {
  CollectionReference,
  Timestamp,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  StorageReference,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useCallback, useEffect, useState } from "react";
import {
  useFirestore,
  useFirestoreCollectionData,
  useStorage,
} from "reactfire";
import { useMount } from "../utils";

export type Socials =
  | "linkedin"
  | "email"
  | "github"
  | "instagram"
  | "facebook"
  | "twitter";

export type AuthorSocial = {
  id: Socials;
  value: string;
};

export type AuthorRatings = { value: number; uid: string }[];

export type Author = {
  uid: string;
  name: string;
  displayPicture?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  reference_uid?: string;
  socials: AuthorSocial[];
  averageRatings: number;
  ratings?: AuthorRatings;
};

function useAuthorsCollection() {
  const store = useFirestore();
  return collection(store, "Authors") as CollectionReference<Author>;
}

export function useAuthorDocument(authorId: string) {
  const authorsCollection = useAuthorsCollection();
  return doc(authorsCollection, authorId);
}

type AddAuthorPayload = Omit<
  Author,
  | "displayPicture"
  | "reference_uid"
  | "created_at"
  | "updated_at"
  | "uid"
  | "averageRatings"
> & {
  image?: string;
  imageFile?: File;
  userId?: string;
};

export function useAddAuthor() {
  const authorsCollection = useAuthorsCollection();
  const authorDocRef = doc(authorsCollection);
  const storage = useStorage();
  return useCallback(
    async ({ userId, image, imageFile, ...rest }: AddAuthorPayload) => {
      try {
        let displayPictureRef: StorageReference | undefined = undefined;
        if (imageFile) {
          const storageRef = ref(
            storage,
            `authors/${authorDocRef.id}/${imageFile.name}`
          );
          const { ref: pathRef } = await uploadBytes(storageRef, imageFile);
          displayPictureRef = pathRef;
        }
        const imageUrl = displayPictureRef
          ? await getDownloadURL(displayPictureRef)
          : image?.length
          ? image
          : "missing";
        await setDoc(authorDocRef, {
          ...rest,
          uid: authorDocRef.id,
          displayPicture: imageUrl,
          averageRatings: 0,
          reference_uid: userId || authorDocRef.id,
          updated_at: serverTimestamp(),
          created_at: serverTimestamp(),
        });
      } catch (e) {
        throw e as Error;
      }
    },
    [authorDocRef, storage]
  );
}

export function useAuthors() {
  const authorsCollection = useAuthorsCollection();
  const authorsQuery = query(authorsCollection, orderBy("created_at", "desc"));
  const { data: authors } = useFirestoreCollectionData(authorsQuery, {
    idField: "id",
  });

  return {
    authors,
  };
}

export function usePopularAuthors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCalled, setIsCalled] = useState<boolean>(false);
  const authorsCollection = useAuthorsCollection();

  const getAuthors = useCallback(async () => {
    setIsLoading(true);
    try {
      const coursesQuery = query(
        authorsCollection,
        orderBy("averageRatings", "desc"),
        orderBy("updated_at", "desc")
      );
      const authorDocs = (await getDocs(coursesQuery)).docs;
      setAuthors(authorDocs.map((doc) => doc.data()));
      setIsLoading(false);
    } catch (e) {
      setAuthors([]);
      setIsLoading(false);
      throw e;
    }
  }, [authorsCollection]);

  useEffect(() => {
    if (!isCalled) {
      setIsCalled(true);
      getAuthors();
    }
  }, [getAuthors, isCalled]);

  return {
    authors,
    isLoading,
  };
}

export function useAuthorsOnce() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const authorsCollection = useAuthorsCollection();
  const getAuthors = useCallback(async () => {
    setIsLoading(true);
    try {
      const coursesQuery = query(
        authorsCollection,
        orderBy("created_at", "desc")
      );
      const authorDocs = (await getDocs(coursesQuery)).docs;
      setAuthors(authorDocs.map((doc) => doc.data()));
      setIsLoading(false);
    } catch (e) {
      setAuthors([]);
      setIsLoading(false);
      throw e;
    }
  }, [authorsCollection]);
  useMount(() => {
    getAuthors();
  });

  return {
    authors,
    isLoading,
  };
}
