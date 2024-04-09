import {
  CollectionReference,
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useFirestore } from "reactfire";
import { dateToTimestamp } from "../utils";
import { useCourseDocument } from "./courses";

export type Review = {
  id: string;
  courseId: string;
  user: {
    uid: string;
    name: string;
    isVerified?: boolean;
    photoUrl?: string | null;
  };
  rating: number;
  title: string;
  description?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
};

function useReviewsCollection() {
  const store = useFirestore();
  return collection(store, "Reviews") as CollectionReference<Review>;
}

export function useReviewDocument(reviewId: string) {
  const reviewsCollection = useReviewsCollection();
  return doc(reviewsCollection, reviewId);
}

export function useReviews(courseId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCalled, setIsCalled] = useState<boolean>(false);
  const reviewsCollection = useReviewsCollection();

  const getReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const reviewsQuery = query(
        reviewsCollection,
        where("courseId", "==", courseId),
        orderBy("created_at", "desc"),
        limit(10)
      );
      const reviewsData = (await getDocs(reviewsQuery)).docs;
      setReviews(reviewsData.map((review) => review.data()));
      setIsLoading(false);
    } catch (e) {
      setReviews([]);
      setIsLoading(false);
      throw e;
    }
  }, [courseId, reviewsCollection]);

  useEffect(() => {
    if (!isCalled) {
      setIsCalled(true);
      getReviews();
    }
  }, [isCalled, getReviews]);

  function reload() {
    setIsCalled(false);
  }

  return {
    reviews,
    isLoading,

    reload,
  };
}

type RatingsPayload = Pick<Review, "rating" | "title" | "description" | "user">;
export function useAddRatingAndReview(courseId: string) {
  const store = useFirestore();
  const reviewsCollection = useReviewsCollection();
  const courseDocRef = useCourseDocument(courseId);
  return useCallback(
    async ({ rating, title, description, user }: RatingsPayload) => {
      try {
        const batch = writeBatch(store);
        const reviewDocRef = doc(reviewsCollection, `${user.uid}_${courseId}`);
        batch.set(reviewDocRef, {
          id: reviewDocRef.id,
          courseId,
          user,
          rating,
          description,
          title,
          created_at: dateToTimestamp(new Date()),
          updated_at: dateToTimestamp(new Date()),
        });
        const data = await (await getDoc(courseDocRef)).data();
        const ratings = data?.ratings?.length
          ? [...data.ratings, { uid: user.uid, value: rating }]
          : [{ uid: user.uid, value: rating }];
        const averageRating: number =
          Number(
            ratings
              ?.reduce(function (avg, value, _, { length }) {
                return avg + value.value / length;
              }, 0)
              .toFixed(1)
          ) || 0;
        batch.update(courseDocRef, {
          updated_at: dateToTimestamp(new Date()),
          ratings: ratings,
          averageRatings: averageRating,
        });
        await batch.commit();
      } catch (e) {
        throw e as Error;
      }
    },
    [courseDocRef, courseId, reviewsCollection, store]
  );
}
