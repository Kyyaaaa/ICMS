import { formatDate } from "../../../shared/utils/date";
import { useState, useEffect } from "react";
import { BookOpen, MapPin, Calendar, Clock } from "lucide-react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { TopNav } from "@/shared/components/layout/TopNav";
import type {
  RegistrationClassOption,
  RegistrationInvoicePreview,
} from "../types/registration";
import { LearnerRegistrationService } from "../services/registration.service";
import { showAlertModal } from "@/utils/modal";

const ClassRegistration = () => {
  const { courseId } = useParams();
  const [classOptions, setClassOptions] = useState<RegistrationClassOption[]>(
    [],
  );
  const [selectedClass, setSelectedClass] = useState<number | string | null>(
    () => {
      const pending = localStorage.getItem("pending_registration_class");
      if (pending) {
        localStorage.removeItem("pending_registration_class");
        return isNaN(Number(pending)) ? pending : Number(pending);
      }
      return null;
    },
  );
  const [_invoicePreview, setInvoicePreview] =
    useState<RegistrationInvoicePreview | null>(null);
  const [loading, setLoading] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!Cookies.get("access_token"),
  );
  const [userRole] = useState<"learner" | "tutor" | "staff" | "admin">(() => {
    try {
      return (
        JSON.parse(Cookies.get("user_info") || "{}").role?.toLowerCase() ||
        "learner"
      );
    } catch {
      return "learner";
    }
  });
  const [userInfo] = useState(() => {
    try {
      return JSON.parse(Cookies.get("user_info") || "null");
    } catch {
      return null;
    }
  });
  const navigate = useNavigate();

  const [isConfirming, setIsConfirming] = useState(false);

  // View Schedule Modal
  const [viewScheduleModal, setViewScheduleModal] = useState<{
    isOpen: boolean;
    classOpt: RegistrationClassOption | null;
  }>({ isOpen: false, classOpt: null });

  useEffect(() => {
    const fetchClasses = async () => {
      if (courseId) {
        const data =
          await LearnerRegistrationService.getAvailableClasses(courseId);
        setClassOptions(data);
      }
      setLoading(false);
    };
    fetchClasses();
  }, [courseId]);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (courseId && selectedClass) {
        const preview = await LearnerRegistrationService.getInvoicePreview(
          courseId,
          selectedClass,
        );
        setInvoicePreview(preview);
      } else {
        setInvoicePreview(null);
      }
    };
    fetchInvoice();
  }, [courseId, selectedClass]);

  const location = useLocation();
  const discountCode = location.state?.discountCode;

  const handleConfirm = async () => {
    if (!courseId || !selectedClass) return;

    if (!isLoggedIn) {
      localStorage.setItem("pending_registration_course", courseId);
      localStorage.setItem(
        "pending_registration_class",
        selectedClass.toString(),
      );
      navigate("/login");
      return;
    }

    setIsConfirming(true);
    try {
      const invoiceId = await LearnerRegistrationService.createInvoice(
        courseId,
        selectedClass,
        discountCode
      );
      navigate(`/learner/payments/${invoiceId}/checkout`);
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred.";
      showAlertModal("Registration Failed", errorMsg, "error");
    } finally {
      setIsConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">Loading available classes...</div>
    );
  }

  return (
    <div className="bg-[#f7fafc] min-h-screen flex flex-col">
      <TopNav
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        userRole={userRole}
        userInfo={userInfo || undefined}
      />
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up py-10 px-4 w-full grow">
        <div className="flex items-center gap-4">
          <Link
            to={`/courses/${courseId}`}
            className="text-[#0061a5] hover:underline font-medium text-sm"
          >
            ← Back to Course
          </Link>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-[#002045]">
          Class Registration
        </h1>

        <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] p-6 md:p-8">
          <h2 className="text-lg font-bold text-[#181c1e] mb-4">
            Available Classes
          </h2>

          <div className="space-y-4 mb-8">
            {classOptions.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-[#e0e3e5] rounded-xl bg-[#f8f9fa]">
                <p className="text-base font-medium text-[#43474e]">
                  No upcoming classes are currently available for registration.
                </p>
                <p className="text-sm text-[#74777f] mt-1">
                  Classes may have already started or reached maximum capacity.
                </p>
              </div>
            ) : (
              classOptions.map((opt) => {
                const isLearner = userRole === "learner";
                const isSelected = selectedClass === opt.id;
                return (
                  <div
                    key={opt.id}
                    className={`block border ${isSelected && isLearner ? "border-[#0061a5] bg-[#f7fafc]" : "border-[#e0e3e5]"} rounded-lg p-3 ${isLearner ? "cursor-pointer hover:border-[#0061a5] transition-colors" : ""}`}
                    onClick={() => isLearner && setSelectedClass(opt.id)}
                  >
                    <div className="flex items-center gap-3">
                      {isLearner && (
                        <input
                          type="radio"
                          name="class"
                          checked={isSelected}
                          readOnly
                          className="w-4 h-4 text-[#0061a5] shrink-0"
                        />
                      )}
                      <div className="flex-1 flex flex-col gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-[#181c1e] text-base">{opt.name}</h3>
                            <span className="bg-[#e3f2fd] text-[#0061a5] text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
                              {opt.availableSeats} seats left
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-[#43474e] mt-1.5">
                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#74777f]" /> {opt.room}</span>
                            <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-[#74777f]" /> {opt.sessions} Sessions</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-[#74777f]">
                            <Calendar className="w-3.5 h-3.5" /> Schedule
                          </div>
                          <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap">
                            {opt.schedule.split(" | ").map((s, i) => {
                              if (s === "TBD") return <span key={i} className="text-xs text-[#43474e]">TBD</span>;
                              return (
                                <span key={i} className="bg-blue-50/50 border border-blue-100 rounded text-xs px-2 py-1 text-[#0061a5] font-medium w-fit">
                                  {s}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Invoice Preview is hidden for Phase 1 & 3 */}

          {userRole === "learner" && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleConfirm}
                disabled={!selectedClass || isConfirming}
                className="bg-[#002045] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0061a5] transition-colors disabled:opacity-50"
              >
                {isConfirming ? "Processing..." : "Proceed to Checkout"}
              </button>
            </div>
          )}
        </div>

        {/* View Schedule Modal */}
        {viewScheduleModal.isOpen && viewScheduleModal.classOpt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
              <div className="px-6 py-4 border-b border-[#e0e3e5] flex justify-between items-center">
                <h3 className="font-bold text-[#002045] text-lg">
                  Class Schedule: {viewScheduleModal.classOpt.name}
                </h3>
                <button
                  onClick={() =>
                    setViewScheduleModal({ isOpen: false, classOpt: null })
                  }
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {viewScheduleModal.classOpt.sessionList &&
                viewScheduleModal.classOpt.sessionList.length > 0 ? (
                  <div className="space-y-3">
                    {viewScheduleModal.classOpt.sessionList.map(
                      (session, idx) => (
                        <div
                          key={session.id || idx}
                          className="flex justify-between p-3 border border-[#e0e3e5] rounded-lg bg-[#f8f9fa]"
                        >
                          <div className="font-semibold text-[#181c1e]">
                            Session {session.session_number}
                          </div>
                          <div className="text-sm text-[#43474e] flex gap-4">
                            <span>
                              <Calendar className="w-4 h-4 inline mr-1" />{" "}
                              {session.date
                                ? formatDate(session.date)
                                : "TBA"}
                            </span>
                            <span>
                              <Clock className="w-4 h-4 inline mr-1" />{" "}
                              {session.slot || "TBA"}
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    No detailed schedule available.
                  </p>
                )}
              </div>
              <div className="p-4 bg-gray-50 border-t border-[#e0e3e5] text-right">
                <button
                  onClick={() =>
                    setViewScheduleModal({ isOpen: false, classOpt: null })
                  }
                  className="px-4 py-2 bg-white border border-[#c4c6cf] text-[#43474e] rounded-lg font-semibold hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassRegistration;
