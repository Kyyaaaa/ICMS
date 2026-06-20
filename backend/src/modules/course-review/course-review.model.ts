export interface UpsertCourseReviewDTO {
    course_id: string;
    class_id: string;
    rating: number;
    review?: string;
}
