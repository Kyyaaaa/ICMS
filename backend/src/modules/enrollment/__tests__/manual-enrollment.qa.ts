import { supabaseAdmin } from '../../../configs/supabase';
import { EnrollmentService } from '../enrollment.service';

async function runQA() {
    console.log("🚀 Starting QA-30: Manual Enrollment Tests...");
    
    // 1. Setup test data
    console.log("Setting up test data...");
    
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
        console.log("▶️ Test 1: Enroll Learner 1 into Class");
        const enroll1 = await EnrollmentService.enrollLearner(learner1.id, { class_id: classData.id });
        console.log("   ✅ Success. Enrollment ID:", enroll1.id);

        // Test 2: Add someone already in class -> Error
        console.log("▶️ Test 2: Enroll Learner 1 into Class AGAIN");
        try {
            await EnrollmentService.enrollLearner(learner1.id, { class_id: classData.id });
            console.log("   ❌ FAILED: Should have thrown duplicate error");
        } catch (e: any) {
            console.log("   ✅ Caught expected error:", e.message);
        }

        // Test 3: Add to full class -> Error
        // Class capacity is 1, so learner2 should fail
        console.log("▶️ Test 3: Enroll Learner 2 into FULL Class");
        try {
            await EnrollmentService.enrollLearner(learner2.id, { class_id: classData.id });
            console.log("   ❌ FAILED: Should have thrown capacity error");
        } catch (e: any) {
            console.log("   ✅ Caught expected error:", e.message);
        }

    } finally {
        console.log("🧹 Cleaning up test data...");
        await supabaseAdmin.from('enrollments').delete().eq('class_id', classData.id).in('learner_id', [learner1.id, learner2.id]);
        console.log("🎉 QA-30 Tests completed!");
    }
}

runQA().catch(console.error);
