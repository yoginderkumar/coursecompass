import {
  CollectionReference,
  QueryDocumentSnapshot,
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  where,
} from "firebase/firestore";
import { useFormik } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useFirestore,
  useFirestoreCollectionData,
  useStorage,
} from "reactfire";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export type CURRENCY_TYPES = "INR" | "USD" | "EUR";

export type CategoryIds =
  | "software_development"
  | "software_design"
  | "personal_development"
  | "music"
  | "marketing";

export type CourseRatings = { value: number; uid: string }[];

type Author = {
  uid: string;
  name: string;
  isVerified?: boolean;
  photoUrl?: string | null;
  reference_uid?: string;
};

export type Course = {
  id: string;
  language?: string;
  content_url: string;
  created_at: Timestamp;
  currency: CURRENCY_TYPES;
  description: string;
  price: number;
  thumbnail?: string;
  title: string;
  updated_at: Timestamp;
  averageRatings: number;
  ratings?: CourseRatings;
  category: { id: string; title: string };
  author: Author;
  start: {
    date?: Timestamp;
    isRecorded?: boolean;
    isLive?: boolean;
  };
};

export type Request = {
  id: string;
  url: string;
  created_at: Timestamp;
  updated_at: Timestamp;
};

function useCoursesCollection() {
  const store = useFirestore();
  return collection(store, "Courses") as CollectionReference<Course>;
}

export function useCourseDocument(courseId: string) {
  const coursesCollection = useCoursesCollection();
  return doc(coursesCollection, courseId);
}

export function useCourseRequestCollection() {
  const store = useFirestore();
  return collection(store, "Requests") as CollectionReference<Request>;
}

export function useTopCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCalled, setIsCalled] = useState<boolean>(false);
  const coursesCollection = useCoursesCollection();
  const getCoursesByCategory = useCallback(async () => {
    setIsLoading(true);
    try {
      const coursesQuery = query(
        coursesCollection,
        orderBy("averageRatings", "desc"),
        orderBy("updated_at", "desc"),
        limit(5)
      );
      const courseDocs = (await getDocs(coursesQuery)).docs;
      setCourses(courseDocs.map((doc) => doc.data()));
      setIsLoading(false);
    } catch (e) {
      setCourses([]);
      setIsLoading(false);
      throw e;
    }
  }, [coursesCollection]);

  useEffect(() => {
    if (!isCalled) {
      setIsCalled(true);
      getCoursesByCategory();
    }
  }, [isCalled, getCoursesByCategory]);

  return {
    courses,
    isLoading,
  };
}

export type OrderDateBy = "latest" | "oldest";

export type RatingsFilter = "high_to_low" | "low_to_high";

export type Pagination = {
  lastItem: QueryDocumentSnapshot | null;
  emptied?: boolean;
  limit: number;
};

type CategoryForFilter = {
  id: string;
  title: string;
};
export type TCourseByCategoryParams = {
  q?: string;
  category: CategoryForFilter;
  orderDateBy?: OrderDateBy;
  ratings?: RatingsFilter;
};
export const initialParams: TCourseByCategoryParams = {
  category: { id: "all", title: "All" },
  orderDateBy: "latest",
  ratings: "high_to_low",
};

export function useCoursesByCategory(
  initialSearchParamsProps: TCourseByCategoryParams = initialParams
) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCalled, setIsCalled] = useState<boolean>(false);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const coursesCollection = useCoursesCollection();
  const [pagination, setPagination] = useState<Pagination>({
    limit: 20,
    lastItem: null,
  });

  const initialSearchParams = useMemo(() => {
    if (!initialSearchParamsProps) return initialParams;
    return {
      ...initialParams,
      ...initialSearchParamsProps,
      category: initialSearchParamsProps.category || initialParams.category,
    };
  }, [initialSearchParamsProps]);

  const { values: params, setFieldValue } = useFormik<TCourseByCategoryParams>({
    initialValues: initialSearchParams,
    onSubmit: () => undefined,
  });

  const getCoursesByCategory = useCallback(async () => {
    setIsLoading(true);
    try {
      if (params.category.id === "all") {
        const coursesQuery = query(
          coursesCollection,
          orderBy(
            "averageRatings",
            params?.ratings === "high_to_low" ? "desc" : "asc"
          ),
          orderBy(
            "updated_at",
            params?.orderDateBy === "oldest" ? "asc" : "desc"
          ),
          limit(pagination.limit)
        );
        const courseDocsRefs = (await getDocs(coursesQuery)).docs;
        setPagination((prev) => {
          return {
            ...prev,
            emptied: courseDocsRefs.length < pagination.limit,
            lastItem: courseDocsRefs[courseDocsRefs.length - 1],
          };
        });
        setCourses(courseDocsRefs.map((doc) => doc.data()));
      } else {
        const coursesQuery = query(
          coursesCollection,
          where("category.id", "==", params.category.id),
          orderBy(
            "averageRatings",
            params?.ratings === "high_to_low" ? "desc" : "asc"
          ),
          orderBy(
            "updated_at",
            params?.orderDateBy === "oldest" ? "asc" : "desc"
          ),
          limit(pagination.limit)
        );
        const courseDocsRefs = (await getDocs(coursesQuery)).docs;
        setPagination((prev) => {
          return {
            ...prev,
            emptied: courseDocsRefs.length < pagination.limit,
            lastItem: courseDocsRefs[courseDocsRefs.length - 1],
          };
        });
        setCourses(courseDocsRefs.map((doc) => doc.data()));
      }
      setIsLoading(false);
    } catch (e) {
      setCourses([]);
      setIsLoading(false);
      throw e;
    }
  }, [
    coursesCollection,
    params.category,
    params?.ratings,
    params?.orderDateBy,
    pagination,
  ]);

  const getMoreCourses = useCallback(async () => {
    setIsFetchingMore(true);
    try {
      if (params.category.id === "all") {
        const coursesQuery = query(
          coursesCollection,
          orderBy(
            "averageRatings",
            params?.ratings === "high_to_low" ? "desc" : "asc"
          ),
          orderBy(
            "updated_at",
            params?.orderDateBy === "oldest" ? "asc" : "desc"
          ),
          startAfter(pagination.lastItem),
          limit(pagination.limit)
        );
        const courseDocsRefs = (await getDocs(coursesQuery)).docs;
        setPagination((prev) => {
          return {
            ...prev,
            emptied: courseDocsRefs.length < pagination.limit,
            lastItem: courseDocsRefs[courseDocsRefs.length - 1],
          };
        });
        setCourses((prev) =>
          [...prev].concat(courseDocsRefs.map((doc) => doc.data()))
        );
      } else {
        const coursesQuery = query(
          coursesCollection,
          where("category.id", "==", params.category.id),
          orderBy(
            "averageRatings",
            params?.ratings === "high_to_low" ? "desc" : "asc"
          ),
          orderBy(
            "updated_at",
            params?.orderDateBy === "oldest" ? "asc" : "desc"
          ),
          startAfter(pagination.lastItem),
          limit(pagination.limit)
        );
        const courseDocsRefs = (await getDocs(coursesQuery)).docs;
        setPagination((prev) => {
          return {
            ...prev,
            emptied: courseDocsRefs.length < pagination.limit,
            lastItem: courseDocsRefs[courseDocsRefs.length - 1],
          };
        });
        setCourses((prev) =>
          [...prev].concat(courseDocsRefs.map((doc) => doc.data()))
        );
      }
      setIsFetchingMore(false);
    } catch (e) {
      setIsFetchingMore(false);
      throw e;
    }
  }, [
    coursesCollection,
    params.category,
    params?.ratings,
    params?.orderDateBy,
    pagination,
  ]);

  function loadMore() {
    getMoreCourses();
  }

  useEffect(() => {
    if (!isCalled) {
      setIsCalled(true);
      getCoursesByCategory();
    }
  }, [isCalled, getCoursesByCategory]);

  function handleParamChange(
    key: string,
    value: string | OrderDateBy | RatingsFilter | CategoryForFilter
  ) {
    setFieldValue(key, value);
    setIsCalled(false);
  }

  return {
    params,
    courses,
    isLoading,
    isFetchingMore,

    pagination,

    loadMore,
    setFieldValue: handleParamChange,
  };
}

export function useCourse(courseId: string) {
  const [isCalled, setIsCalled] = useState<boolean>(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const courseDoc = useCourseDocument(courseId);

  const getCourse = useCallback(async () => {
    setIsLoading(true);
    try {
      const courseData = (await getDoc(courseDoc))?.data() || null;
      setCourse(courseData);
      setIsLoading(false);
    } catch (e) {
      setCourse(null);
      setIsLoading(false);
      throw e;
    }
  }, [courseDoc]);

  useEffect(() => {
    if (!isCalled) {
      setIsCalled(true);
      getCourse();
    }
  }, [isCalled, getCourse]);

  function reload() {
    setIsCalled(false);
  }

  return {
    course,
    isLoading,

    reload,
  };
}

export function usePopularCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCalled, setIsCalled] = useState<boolean>(false);
  const coursesCollection = useCoursesCollection();
  const getCoursesByPopularity = useCallback(async () => {
    setIsLoading(true);
    try {
      const coursesQuery = query(
        coursesCollection,
        orderBy("averageRatings", "desc"),
        limit(10)
      );
      const courseDocs = (await getDocs(coursesQuery)).docs;
      setCourses(courseDocs.map((doc) => doc.data()));
      setIsLoading(false);
    } catch (e) {
      setCourses([]);
      setIsLoading(false);
      throw e;
    }
  }, [coursesCollection]);

  useEffect(() => {
    if (!isCalled) {
      setIsCalled(true);
      getCoursesByPopularity();
    }
  }, [isCalled, getCoursesByPopularity]);

  return {
    courses,
    isLoading,
  };
}

export function useCourses() {
  const coursesCollection = useCoursesCollection();
  const coursesQuery = query(coursesCollection, orderBy("created_at", "desc"));
  const { data: courses } = useFirestoreCollectionData(coursesQuery, {
    idField: "id",
  });

  return {
    courses,
  };
}

export function useMyCourses(userId: string) {
  const coursesCollection = useCoursesCollection();
  const coursesQuery = query(
    coursesCollection,
    where("author.uid", "==", userId),
    orderBy("created_at", "desc")
  );
  const { data: courses } = useFirestoreCollectionData(coursesQuery, {
    idField: "id",
  });

  return {
    courses,
  };
}

export function useCoursesForUser() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCalled, setIsCalled] = useState<boolean>(false);
  const coursesCollection = useCoursesCollection();
  const getCoursesByPopularity = useCallback(async () => {
    setIsLoading(true);
    try {
      const coursesQuery = query(
        coursesCollection,
        orderBy("updated_at", "desc")
      );
      const courseDocs = (await getDocs(coursesQuery)).docs;
      setCourses(courseDocs.map((doc) => doc.data()));
      setIsLoading(false);
    } catch (e) {
      setCourses([]);
      setIsLoading(false);
      throw e;
    }
  }, [coursesCollection]);

  useEffect(() => {
    if (!isCalled) {
      setIsCalled(true);
      getCoursesByPopularity();
    }
  }, [isCalled, getCoursesByPopularity]);

  return {
    courses,
    isLoading,
  };
}

export function useAddNewCourse() {
  const coursesCollection = useCoursesCollection();
  const docRef = doc(coursesCollection);
  const storage = useStorage();
  return useCallback(
    async ({
      image,
      ...rest
    }: Omit<
      Course,
      "id" | "thumbnail" | "updated_at" | "created_at" | "averageRatings"
    > & {
      image: File;
    }) => {
      try {
        if (!image) return null;
        const storageRef = ref(storage, `courses/${docRef.id}/${image.name}`);
        const { ref: pathRef } = await uploadBytes(storageRef, image);
        const imageUrl = await getDownloadURL(pathRef);
        await setDoc(docRef, {
          ...rest,
          id: docRef.id,
          averageRatings: 0,
          thumbnail: `${imageUrl || pathRef.fullPath || image.name}`,
          updated_at: serverTimestamp(),
          created_at: serverTimestamp(),
        });
      } catch (e) {
        throw e as Error;
      }
    },
    [docRef, storage]
  );
}

export function useAddRequest() {
  const requestsCollection = useCourseRequestCollection();
  return useCallback(
    async (courseUrl: string) => {
      try {
        const docRef = doc(requestsCollection);
        await setDoc(docRef, {
          id: docRef.id,
          url: courseUrl,
          updated_at: serverTimestamp(),
          created_at: serverTimestamp(),
        });
      } catch (e) {
        throw e as Error;
      }
    },
    [requestsCollection]
  );
}
