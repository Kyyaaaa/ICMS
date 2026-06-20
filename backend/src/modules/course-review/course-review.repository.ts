import { supabaseAdmin } from '../../configs/supabase';
import { UpsertCourseReviewDTO } from './course-review.model';

export class CourseReviewRepository {
    static async getReviewByClass(learnerId: string, classId: string) {
        const { data, error } = await supabaseAdmin
            .from('course_reviews')
            .select('*')
            .eq('learner_id', learnerId)
            .eq('class_id', classId)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }
        return data || null;
    }

    static async upsertReview(learnerId: string, dto: UpsertCourseReviewDTO) {
        const { data, error } = await supabaseAdmin
            .from('course_reviews')
            .upsert({
                learner_id: learnerId,
                course_id: dto.course_id,
                class_id: dto.class_id,
                rating: dto.rating,
                review: dto.review || null,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'learner_id,class_id'
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }
}
