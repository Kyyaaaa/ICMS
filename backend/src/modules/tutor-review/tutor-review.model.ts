export interface UpsertTutorReviewDTO {
    tutor_id: string;
    class_id: string;
    rating: number;
    review?: string;
}
