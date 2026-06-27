import { supabaseAdmin } from '../../../configs/supabase';
import { TutorClassService } from '../tutor-class.service';
import { TutorClassRepository } from '../tutor-class.repository';
import { LearnerService } from '../../learner/learner.service';
import * as crypto from 'crypto';

async function runQA33() {
  console.log("🚀 QA-33: Testing Gradebook -> Transcript flow...");

  // Setup: Find an active enrollment
  const { data: enrollments, error } = await supabaseAdmin
    .from('enrollments')
    .select('class_id, learner_id, classes(grading_status)')
    .eq('status', 'ACTIVE')
    .limit(1);
    
  if (error || !enrollments || enrollments.length === 0) {
    console.error("No active enrollments found for testing.");
    return;
  }
  
  const classId = enrollments[0].class_id;
  const learnerId = enrollments[0].learner_id;
  const originalStatus = (enrollments[0].classes as any).grading_status;

  const assessmentId = crypto.randomUUID();

  try {
    // Ensure class is PENDING
    await TutorClassRepository.updateClassGradingStatus(classId, 'PENDING');

    console.log(`\n▶️ 1. Thêm điểm nháp (Draft)...`);
    await TutorClassService.saveGradebook(classId, {
      deletedAssessmentIds: [],
      upsertAssessments: [
        { id: assessmentId, name: 'Final Exam', order_index: 1 }
      ],
      upsertGrades: [
        { assessment_id: assessmentId, learner_id: learnerId, score: 8.5, feedback: 'Good job!' }
      ]
    });
    console.log("   ✅ Điểm đã lưu.");

    // Check Transcript (Should be hidden)
    console.log(`\n▶️ 2. Learner xem bảng điểm (Chưa Publish)...`);
    let transcript = await LearnerService.getTranscript(learnerId);
    let classInTranscript = transcript.find(t => t.class_id === classId);
    if (!classInTranscript) {
      console.log("   ✅ Bảng điểm ẩn: Learner KHÔNG xem được lớp học chưa Publish.");
    } else {
      console.log("   ❌ LỖI: Learner nhìn thấy lớp học chưa Publish!");
      throw new Error("Transcript visible before publish");
    }

    // Publish
    console.log(`\n▶️ 3. Tutor bấm Publish...`);
    await TutorClassService.publishGrades(classId);
    console.log("   ✅ Lớp đã chuyển trạng thái sang PUBLISHED.");

    // Check Transcript (Should be visible)
    console.log(`\n▶️ 4. Learner xem bảng điểm (Sau khi Publish)...`);
    transcript = await LearnerService.getTranscript(learnerId);
    classInTranscript = transcript.find(t => t.class_id === classId);
    if (classInTranscript) {
      console.log("   ✅ Bảng điểm hiển thị thành công!");
      console.log(`   - Overall Score: ${classInTranscript.overall_score}`);
      console.log(`   - Chi tiết:`, classInTranscript.details);
      
      if (classInTranscript.overall_score === 8.5) {
        console.log("   ✅ Điểm trung bình (Overall) được tính toán chính xác!");
      } else {
        console.log("   ❌ LỖI tính toán điểm trung bình.");
      }
    } else {
      console.log("   ❌ LỖI: Bảng điểm không hiển thị sau khi Publish.");
      throw new Error("Transcript hidden after publish");
    }

    console.log("\n✅ QA-33: Luồng Gradebook -> Transcript đã hoàn tất mỹ mãn!");

  } catch (err: any) {
    console.error("\n❌ Test Failed:", err.message);
  } finally {
    // Cleanup
    console.log("\n🧹 Dọn dẹp dữ liệu test...");
    await TutorClassService.saveGradebook(classId, {
      deletedAssessmentIds: [assessmentId],
      upsertAssessments: [],
      upsertGrades: []
    });
    // Reset original status
    await TutorClassRepository.updateClassGradingStatus(classId, originalStatus || 'PENDING');
  }
}

runQA33().catch(console.error);
