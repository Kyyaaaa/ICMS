import { supabaseAdmin } from '../../configs/supabase';

export class AdminTutorReviewRepository {
    static async getAllTutorRatings() {
        // Get all accounts with role TUTOR
        const { data: roles } = await supabaseAdmin.from('roles').select('id').eq('name', 'TUTOR').single();
        if (!roles) return [];

        const tutorRoleId = roles.id;

        const { data: tutors, error: tutorError } = await supabaseAdmin
            .from('account')
            .select('id, full_name, avatar_url, created_at')
            .eq('role_id', tutorRoleId);

        if (tutorError) throw tutorError;
        if (!tutors || tutors.length === 0) return [];

        // Get reviews
        const { data: reviews, error: reviewError } = await supabaseAdmin
            .from('tutor_reviews')
            .select('tutor_id, rating');

        if (reviewError) throw reviewError;

        // Get ongoing classes count
        const { data: classes, error: classesError } = await supabaseAdmin
            .from('classes')
            .select('tutor_id')
            .eq('status', 'ONGOING');

        if (classesError) throw classesError;

        return tutors.map((tutor: any) => {
            const tutorReviews = reviews.filter((r: any) => r.tutor_id === tutor.id);
            const sum = tutorReviews.reduce((acc: number, val: any) => acc + val.rating, 0);
            const averageRating = tutorReviews.length > 0 ? Number((sum / tutorReviews.length).toFixed(1)) : 0;
            
            const activeClassesCount = classes.filter((c: any) => c.tutor_id === tutor.id).length;

            return {
                id: tutor.id,
                full_name: tutor.full_name,
                avatar_url: tutor.avatar_url,
                created_at: tutor.created_at,
                averageRating,
                reviewCount: tutorReviews.length,
                activeClassesCount
            };
        });
    }

    static async getTutorReviewDetail(tutorId: string) {
        // Fetch tutor info
        const { data: tutor, error: tutorError } = await supabaseAdmin
            .from('account')
            .select('id, full_name, avatar_url, created_at')
            .eq('id', tutorId)
            .single();

        if (tutorError || !tutor) throw new Error('Tutor not found');

        // Fetch active classes
        const { data: classes, error: classesError } = await supabaseAdmin
            .from('classes')
            .select('id, course_id, status, courses(title)')
            .eq('tutor_id', tutorId)
            .eq('status', 'ONGOING');

        if (classesError) throw classesError;

        // Fetch reviews with learner names and class info
        // Need to query learner names and class names separately if join is complex via SDK
        const { data: reviews, error: reviewError } = await supabaseAdmin
            .from('tutor_reviews')
            .select('id, rating, review, created_at, learner_id, class_id')
            .eq('tutor_id', tutorId)
            .order('created_at', { ascending: false });

        if (reviewError) throw reviewError;

        // Fetch learner names
        const learnerIds = [...new Set(reviews.map((r: any) => r.learner_id))];
        let learnersMap: Record<string, any> = {};
        if (learnerIds.length > 0) {
            const { data: learners } = await supabaseAdmin
                .from('account')
                .select('id, full_name, avatar_url')
                .in('id', learnerIds);
            
            if (learners) {
                learnersMap = learners.reduce((acc: any, l: any) => {
                    acc[l.id] = { full_name: l.full_name, avatar_url: l.avatar_url };
                    return acc;
                }, {});
            }
        }

        // Fetch class info for reviews
        const classIds = [...new Set(reviews.map((r: any) => r.class_id))];
        let classesMap: Record<string, any> = {};
        if (classIds.length > 0) {
            const { data: classData } = await supabaseAdmin
                .from('classes')
                .select('id, name, course_id, courses(title)')
                .in('id', classIds);

            if (classData) {
                classesMap = classData.reduce((acc: any, c: any) => {
                    const courseTitle = Array.isArray(c.courses) ? c.courses[0]?.title : c.courses?.title;
                    acc[c.id] = {
                        course_name: `${c.name} (${courseTitle})`
                    };
                    return acc;
                }, {});
            }
        }

        const enrichedReviews = reviews.map((r: any) => ({
            id: r.id,
            rating: r.rating,
            review: r.review,
            created_at: r.created_at,
            learner_name: learnersMap[r.learner_id]?.full_name || 'Unknown Learner',
            learner_avatar_url: learnersMap[r.learner_id]?.avatar_url || null,
            course_name: classesMap[r.class_id]?.course_name || 'Unknown Course'
        }));

        const sum = reviews.reduce((acc: number, val: any) => acc + val.rating, 0);
        const averageRating = reviews.length > 0 ? Number((sum / reviews.length).toFixed(1)) : 0;

        const activeClasses = classes.map((c: any) => ({
            id: c.id,
            name: Array.isArray(c.courses) ? c.courses[0]?.title : c.courses?.title
        }));

        return {
            tutor: {
                id: tutor.id,
                full_name: tutor.full_name,
                avatar_url: tutor.avatar_url,
                created_at: tutor.created_at,
                averageRating,
                reviewCount: reviews.length,
                activeClassesCount: activeClasses.length,
                activeClasses
            },
            reviews: enrichedReviews
        };
    }
}
