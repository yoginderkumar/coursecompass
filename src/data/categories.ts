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
import { useCallback, useEffect, useState } from "react";
import { useFirestore } from "reactfire";

export type Category = {
  id: string;
  title: string;
  created_at: Timestamp;
  updated_at: Timestamp;
};

function useCategoriesCollection() {
  const store = useFirestore();
  return collection(store, "Categories") as CollectionReference<Category>;
}

export function useCategoryDocument(categoryId: string) {
  const categoriesCollection = useCategoriesCollection();
  return doc(categoriesCollection, categoryId);
}

type AddCategoryPayload = {
  id: string;
  title: string;
};
export function useAddCategory() {
  const categoriesCollection = useCategoriesCollection();
  return useCallback(
    async (data: AddCategoryPayload) => {
      try {
        const categoryDocRef = doc(categoriesCollection, data.id);
        await setDoc(categoryDocRef, {
          id: data.id,
          title: data.title,
          updated_at: serverTimestamp(),
          created_at: serverTimestamp(),
        });
      } catch (e) {
        throw e as Error;
      }
    },
    [categoriesCollection]
  );
}

export function useCategories() {
  const categoriesCollection = useCategoriesCollection();
  const [isCalled, setIsCalled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const getCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const coursesQuery = query(categoriesCollection, orderBy("created_at"));
      const categoryDocs = (await getDocs(coursesQuery)).docs;
      setCategories(categoryDocs.map((doc) => doc.data()));
      setIsLoading(false);
    } catch (e) {
      setCategories([]);
      setIsLoading(false);
      throw e;
    }
  }, [categoriesCollection]);

  useEffect(() => {
    if (!isCalled) {
      setIsCalled(true);
      getCategories();
    }
  }, [getCategories, isCalled]);

  function reload() {
    setIsCalled(false);
  }

  return {
    categories,
    isLoading,
    reload,
  };
}
