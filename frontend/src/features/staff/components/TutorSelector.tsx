import { showConfirmModal } from "@/utils/modal";
import { useState } from "react";
import { Search, Lock, ChevronDown } from "lucide-react";
import type { TutorAvailabilityProfile } from "../types/tutor-availability";

interface TutorSelectorProps {
  tutors: TutorAvailabilityProfile[];
  selectedTutorId: string;
  hasUnsavedChanges: boolean;
  onSelectTutor: (id: string) => void;
}

export const TutorSelector = ({
  tutors,
  selectedTutorId,
  hasUnsavedChanges,
  onSelectTutor,
}: TutorSelectorProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedTutor = tutors.find((t) => t.id === selectedTutorId);
  const filteredTutors = tutors.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.account_code &&
        t.account_code.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const handleSelect = async (tutorId: string) => {
    if (hasUnsavedChanges) {
      const isConfirmed = await showConfirmModal(
        "Discard Changes",
        "You have unsaved changes. Are you sure you want to discard them and switch tutor?",
        "warning",
      );
      if (!isConfirmed) {
        return;
      }
    }
    onSelectTutor(tutorId);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-full md:w-100">
      <span className="text-[12px] font-bold text-[#74777f] uppercase tracking-wider mb-1.5 block">
        Select Tutor
      </span>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-full flex items-center justify-between p-3 rounded-xl border border-[#c4c6cf] hover:border-[#0061a5] bg-white transition-colors text-left"
      >
        {selectedTutor ? (
          <div className="flex items-center gap-3">
            {selectedTutor.avatar_url ? (
              <img
                src={selectedTutor.avatar_url}
                alt={selectedTutor.name}
                className="w-9 h-9 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#e3f2fd] text-[#0061a5] flex items-center justify-center font-bold text-[13px] shrink-0">
                {selectedTutor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()}
              </div>
            )}
            <div>
              <div className="font-bold text-[14px] text-[#002045] leading-none mb-1">
                {selectedTutor.name}
              </div>
              <div className="flex items-center gap-1.5">
                {selectedTutor.status === "submitted" ? (
                  <Lock className="w-3 h-3 text-amber-600" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c4c6cf]"></span>
                )}
                <span
                  className={`text-[11px] font-bold ${selectedTutor.status === "submitted" ? "text-amber-700" : "text-[#74777f]"}`}
                >
                  {selectedTutor.status === "submitted" ? "Locked" : "Draft"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <span className="text-[#74777f]">Select a tutor</span>
        )}
        <ChevronDown
          className={`w-5 h-5 text-[#74777f] transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-full md:w-112.5 bg-white border border-[#e0e3e5] rounded-xl shadow-xl z-50 overflow-hidden flex flex-col">
            <div className="p-3 border-b border-[#e0e3e5] bg-[#f8f9fa]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search tutors by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-lg border border-[#c4c6cf] focus:border-[#0061a5] outline-none text-sm"
                />
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredTutors.length > 0 ? (
                filteredTutors
                  .sort((a) => (a.status === "submitted" ? -1 : 1))
                  .map((tutor) => {
                    const initials = tutor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase();
                    return (
                      <button
                        key={tutor.id}
                        onClick={() => handleSelect(tutor.id)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#f0f4f8] transition-colors ${selectedTutorId === tutor.id ? "bg-[#e6f0fa]" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          {tutor.avatar_url ? (
                            <img
                              src={tutor.avatar_url}
                              alt={tutor.name}
                              className="w-8 h-8 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${selectedTutorId === tutor.id ? "bg-[#0061a5] text-white" : "bg-[#e0e3e5] text-[#43474e]"}`}
                            >
                              {initials}
                            </div>
                          )}
                          <div className="text-left">
                            <div
                              className={`font-bold text-sm leading-none mb-1 ${selectedTutorId === tutor.id ? "text-[#0061a5]" : "text-[#181c1e]"}`}
                            >
                              {tutor.name}
                            </div>
                            <div className="text-[11px] text-[#74777f] leading-none">
                              {tutor.account_code || tutor.id}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          {tutor.status === "submitted" ? (
                            <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" /> Locked
                            </span>
                          ) : (
                            <span className="text-[10px] uppercase font-bold text-[#74777f] bg-[#e0e3e5] px-2 py-0.5 rounded-full">
                              Draft
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })
              ) : (
                <div className="text-center py-6 text-[#74777f] text-[13px]">
                  No tutors found.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
