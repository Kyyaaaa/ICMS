export interface AdminTutorRatingSummary {
  id: string;
  name: string;
  avatar: string | null;
  rating: number;
  totalReviews: number;
  ongoingClasses: number;
  joinDate: string;
}

export interface AdminTutorReviewDetail {
  id: string;
  learner_name: string;
  class_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface AdminTutorProfileSummary {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  rating: number;
  totalReviews: number;
  joinDate: string;
  bio?: string;
  reviews: AdminTutorReviewDetail[];
}
