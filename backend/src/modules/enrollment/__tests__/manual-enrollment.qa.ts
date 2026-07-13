import { supabaseAdmin } from '../../../configs/supabase';
import { EnrollmentService } from '../enrollment.service';

async function runQA() {
    
    
    // 1. Setup test data
    
    
    // Find an existing class
    const { data: classes, error: classErr } = await supabaseAdmin
        .from('classes')
        .select('id, capacity')
        .limit(1);
    
    if (classErr || !classes || classes.length === 0) throw new Error('No class found');
    const classData = classes[0];

    // Find two learners
    const { data: learners, error: lErr } = await supabaseAdmin
        .from('account')
        .select('id')
        .eq('role', 'LEARNER')
        .limit(2);
    
    if (lErr || !learners || learners.length < 2) throw new Error('Not enough learners found');
    const learner1 = learners[0];
    const learner2 = learners[1];

    // Clean up any existing enrollments for these learners in this class just in case
    await supabaseAdmin.from('enrollments').delete().eq('class_id', classData.id).in('learner_id', [learner1.id, learner2.id]);

    try {
        // Test 1: Staff adds 1 new student -> Success
        
        const enroll1 = await EnrollmentService.enrollLearner(learner1.id, { class_id: classData.id });
        

        // Test 2: Add someone already in class -> Error
        
        try {
            await EnrollmentService.enrollLearner(learner1.id, { class_id: classData.id });
            
        } catch (e: any) {
            
        }

        // Test 3: Add to full class -> Error
        // Class capacity is 1, so learner2 should fail
        
        try {
            await EnrollmentService.enrollLearner(learner2.id, { class_id: classData.id });
            
        } catch (e: any) {
            
        }

    } finally {
        
        await supabaseAdmin.from('enrollments').delete().eq('class_id', classData.id).in('learner_id', [learner1.id, learner2.id]);
        
    }
}

runQA().catch(console.error);
