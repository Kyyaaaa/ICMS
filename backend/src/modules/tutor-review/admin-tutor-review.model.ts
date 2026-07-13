export interface AdminTutorRatingSummary {
  id: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
  averageRating: number;
  reviewCount: number;
  activeClassesCount: number;
}

export interface AdminTutorReviewDetail {
  id: string;
  rating: number;
  review: string;
  created_at: string;
  learner_name: string;
  learner_avatar_url: string | null;
  course_name: string;
}

export interface AdminTutorProfileSummary {
  tutor: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    created_at: string;
    averageRating: number;
    reviewCount: number;
    activeClassesCount: number;
    activeClasses: any[];
  };
  reviews: AdminTutorReviewDetail[];
}
