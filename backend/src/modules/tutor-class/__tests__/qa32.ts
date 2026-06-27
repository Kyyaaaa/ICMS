import { supabaseAdmin } from '../../../configs/supabase';
import { TutorClassService } from '../tutor-class.service';
import { TutorClassRepository } from '../tutor-class.repository';
import * as crypto from 'crypto';

async function runQA32() {
  console.log("🚀 QA-32: Testing Gradebook endpoints...");

  // Setup: Find a class with an enrollment
  const { data: enrollments, error } = await supabaseAdmin
    .from('enrollments')
    .select('class_id, learner_id')
    .limit(1);
    
  if (error || !enrollments || enrollments.length === 0) {
    console.error("No enrollments found for testing.");
    return;
  }
  
  const classId = enrollments[0].class_id;
  const learnerId = enrollments[0].learner_id;

  try {
    // 1. Thêm 1 cột -> Nhập điểm -> Lưu
    console.log(`\n▶️ Testing Insert Assessment & Grade...`);
    const assessmentId = crypto.randomUUID();
    
    await TutorClassService.saveGradebook(classId, {
      deletedAssessmentIds: [],
      upsertAssessments: [
        { id: assessmentId, name: 'Midterm', order_index: 1 }
      ],
      upsertGrades: [
        { assessment_id: assessmentId, learner_id: learnerId, score: 9.5, feedback: 'Great job!' }
      ]
    });
    console.log("   ✅ Saved successfully.");

    // 2. Kiểm tra dữ liệu (Reload)
    console.log(`\n▶️ Verifying Data (Reloading)...`);
    let gradebook = await TutorClassService.getGradebook(classId);
    let addedAssesment = gradebook.assessments.find((a: any) => a.id === assessmentId);
    let addedGrade = gradebook.students.find((s: any) => s.id === learnerId)?.grades[assessmentId];
    
    if (addedAssesment && addedGrade) {
      console.log("   ✅ Assessment and Grade found in reload.");
    } else {
      console.log("   ❌ Missing Assessment or Grade.");
    }

    // 3. Đảm bảo điểm số không được phép lớn hơn 9
    console.log(`\n▶️ Testing Score Cap (Input 9.5)...`);
    if (addedGrade?.score === 9) {
      console.log("   ✅ Score was successfully capped at 9.");
    } else {
      console.log(`   ❌ Score was NOT capped: ${addedGrade?.score}`);
    }

    // 4. Nhập Feedback dài cho 1 ô điểm -> Lưu
    console.log(`\n▶️ Testing Long Feedback...`);
    const longFeedback = 'A'.repeat(500);
    await TutorClassService.saveGradebook(classId, {
      deletedAssessmentIds: [],
      upsertAssessments: [],
      upsertGrades: [
        { assessment_id: assessmentId, learner_id: learnerId, score: 8, feedback: longFeedback }
      ]
    });
    
    gradebook = await TutorClassService.getGradebook(classId);
    addedGrade = gradebook.students.find((s: any) => s.id === learnerId)?.grades[assessmentId];
    if (addedGrade?.feedback === longFeedback) {
      console.log("   ✅ Long feedback saved successfully.");
    } else {
      console.log("   ❌ Long feedback failed to save or was truncated.");
    }

    // 5. Xóa 1 cột -> Lưu -> Reload
    console.log(`\n▶️ Testing Delete Assessment...`);
    await TutorClassService.saveGradebook(classId, {
      deletedAssessmentIds: [assessmentId],
      upsertAssessments: [],
      upsertGrades: []
    });

    gradebook = await TutorClassService.getGradebook(classId);
    addedAssesment = gradebook.assessments.find((a: any) => a.id === assessmentId);
    if (!addedAssesment) {
      console.log("   ✅ Assessment deleted successfully.");
    } else {
      console.log("   ❌ Assessment still exists after deletion.");
    }

    console.log("\n✅ QA-32 completed successfully!");

  } catch (err: any) {
    console.error("❌ Test Failed:", err.message);
  }
}

runQA32().catch(console.error);
