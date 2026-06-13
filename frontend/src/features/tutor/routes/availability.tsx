import { useState, useEffect } from "react";
import { CalendarClock, Info, Lock, Send } from "lucide-react";
import {
  AvailabilityService,
  SHIFTS,
  DAYS,
} from "../services/availability.service";
import type { AvailabilityStatus } from "../types/availability";
import { AvailabilityGrid } from "../components/AvailabilityGrid";
import { showConfirmModal, showAlertModal } from "@/utils/modal";
const AvailabilityRegistration = () => {
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<AvailabilityStatus>("draft");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [slotsData, statusData] = await Promise.all([
          AvailabilityService.getInitialSlots(),
          AvailabilityService.getInitialStatus(),
        ]);
        setSelectedSlots(slotsData);
        setStatus(statusData);
      } catch (error: unknown) {
        console.error("Failed to load availability:", error);
        showAlertModal(
          "Error",
          "Could not load availability data: " +
            ((error as Error)?.message || "Unknown error"),
          "error",
        );
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const toggleSlot = (day: string, shiftId: string) => {
    if (status === "submitted") return;

    const slotKey = `${day}-${shiftId}`;
    const newSlots = new Set(selectedSlots);
    if (newSlots.has(slotKey)) {
      newSlots.delete(slotKey);
    } else {
      newSlots.add(slotKey);
    }
    setSelectedSlots(newSlots);
  };

  const handleSubmit = async () => {
    const isConfirmed = await showConfirmModal(
      "Confirm Submission",
      "Are you sure you want to submit? Once submitted, your schedule will be locked to prevent changes during the scheduling process.",
      "warning",
    );
    if (!isConfirmed) {
      return;
    }
    setIsSubmitting(true);
    try {
      await AvailabilityService.submitAvailability(selectedSlots, "submitted");
      setStatus("submitted");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      await AvailabilityService.submitAvailability(selectedSlots, "draft");
      showAlertModal(
        "Success",
        "Your availability draft has been saved successfully. You can return later to finalize and submit it.",
        "info",
      );
    } catch (error: unknown) {
      showAlertModal(
        "Error",
        "Failed to save draft: " + ((error as Error)?.message || "Unknown error"),
        "error",
      );
    } finally {
      setIsSavingDraft(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 border border-[#e0e3e5] rounded-xl bg-white shadow-sm mt-8 mx-auto max-w-350">
        <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in-up space-y-6 pb-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#e3f2fd] flex items-center justify-center text-[#0061a5] shrink-0">
            <CalendarClock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#002045]">
              Availability Registration
            </h1>
            <p className="text-[#43474e] text-sm">
              Select your available time slots for the upcoming weeks.
            </p>
          </div>
        </div>

        {status === "draft" ? (
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveDraft}
              disabled={isSubmitting || isSavingDraft}
              className="px-5 py-2.5 bg-white text-[#43474e] border border-[#c4c6cf] rounded-lg font-bold text-sm hover:bg-[#f0f4f8] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSavingDraft ? (
                <div className="w-4 h-4 border-2 border-[#0061a5]/30 border-t-[#0061a5] rounded-full animate-spin" />
              ) : null}
              {isSavingDraft ? "Saving..." : "Save Draft"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isSavingDraft}
              className="px-5 py-2.5 bg-[#0061a5] text-white rounded-lg font-bold text-sm hover:bg-[#004d80] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isSubmitting ? "Submitting..." : "Submit & Lock Schedule"}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="px-5 py-2.5 bg-[#f0f4f8] text-[#43474e] rounded-lg font-bold text-sm flex items-center gap-2 border border-[#c4c6cf]">
              <Lock className="w-4 h-4" />
              Submitted
            </div>
          </div>
        )}
      </div>

      {/* Alert Banner */}
      {status === "submitted" ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900 leading-relaxed">
            <p className="font-bold mb-1">
              Your availability is currently locked.
            </p>
            <p>
              You have submitted your schedule for the upcoming period. Staff
              members are using this data to assign classes. To prevent
              scheduling conflicts, your schedule is now permanently locked. If
              you need to make urgent changes, please contact the Staff to
              request an update.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-[#0061a5] shrink-0 mt-0.5" />
          <p className="text-sm text-[#43474e] leading-relaxed">
            Click on the blocks below to toggle your availability. Once you are
            finished, click <strong>"Submit & Lock Schedule"</strong>.
            Submitting will lock your schedule so that staff can safely assign
            classes without unexpected changes.
          </p>
        </div>
      )}

      <AvailabilityGrid
        selectedSlots={selectedSlots}
        status={status}
        toggleSlot={toggleSlot}
      />

      {/* Legend / Summary */}
      <div className="flex items-center gap-6 pt-2 px-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#0061a5] shadow-sm" />
          <span className="text-sm font-bold text-[#002045]">
            Available ({selectedSlots.size})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#f8f9fa] border border-[#e0e3e5]" />
          <span className="text-sm font-medium text-[#43474e]">
            Off ({DAYS.length * SHIFTS.length - selectedSlots.size})
          </span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityRegistration;
