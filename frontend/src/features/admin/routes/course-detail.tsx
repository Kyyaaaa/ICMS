import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  Edit,
  Target,
  Save,
  X,
  Image as ImageIcon,
  Star,
  Globe,
  MapPin,
  Plus,
} from "lucide-react";

import { CoursesService } from "../../../shared/services/courses.service";

interface ApiModule {
  sessions?: string | number;
  topics?: string | string[];
  [key: string]: unknown;
}

interface ApiCourse {
  title?: string;
  code?: string;
  category?: string;
  status?: string;
  description?: string;
  sessions?: number | string;
  max_size?: number | string;
  format?: string;
  location?: string;
  language?: string;
  band?: string;
  price?: number | string;
  original_price?: number | string;
  next_cohort?: string;
  image_url?: string;
  allow_installments?: boolean;
  number_of_installments?: number;
  sessions_list?: ApiModule[];
}

const AdminCourseDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(id !== "new");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [courseData, setCourseData] = useState({
    title: "",
    code: "",
    category: "",
    status: "Draft",
    description: "",
    sessions: "",
    maxSize: "",
    format: "",
    location: "",
    language: "",
    minBand: "",
    maxBand: "",
    price: "",
    originalPrice: "",
    nextCohort: "",
    imageUrl: "",
    sessionsList: [] as {
      title?: string;
      description?: string;
      isExisting?: boolean;
    }[],
    allowInstallments: false,
    numberOfInstallments: 3,
  });
  const [originalCourseData, setOriginalCourseData] = useState<
    typeof courseData | null
  >(null);

  const [activeTab, setActiveTab] = useState("syllabus");
  const [isEditing, setIsEditing] = useState(
    id === "new"
      ? true
      : new URLSearchParams(location.search).get("edit") === "true",
  );

  useEffect(() => {
    const fetchCourse = async () => {
      if (id && id !== "new") {
        setLoading(true);
        const data = (await CoursesService.getCourseById(id)) as ApiCourse;
        if (data) {
          let minB = "",
            maxB = "";
          if (data.band) {
            const parts = data.band.split("-");
            if (parts.length === 2) {
              minB = parts[0].trim();
              maxB = parts[1].trim();
            } else {
              minB = data.band;
            }
          }
          let parsedNextCohort = "";
          if (data.next_cohort) {
            // Backend returns DD/MM/YYYY
            const parts = data.next_cohort.split("/");
            if (parts.length === 3) {
              parsedNextCohort = `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to YYYY-MM-DD for input
            } else {
              parsedNextCohort = data.next_cohort;
            }
          }

          const parsedSessions = data.sessions_list
            ? data.sessions_list.map((m: ApiModule) => ({
                ...m,
                isExisting: true,
              }))
            : [];

          const initialState = {
            title: data.title || "",
            code: data.code || "",
            category: data.category || "",
            status: data.status || "Draft",
            description: data.description || "",
            sessions: String(data.sessions || ""),
            maxSize: String(data.max_size || ""),
            format: data.format || "",
            location: data.location || "",
            language: data.language || "",
            minBand: minB,
            maxBand: maxB,
            price: String(data.price || ""),
            originalPrice: String(data.original_price || ""),
            nextCohort: parsedNextCohort,
            imageUrl: data.image_url || "",
            allowInstallments: !!data.allow_installments,
            numberOfInstallments: Number(data.number_of_installments) || 3,
            sessionsList: parsedSessions,
          };
          setCourseData(initialState);
          setOriginalCourseData(JSON.parse(JSON.stringify(initialState)));
        }
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const calculatedTotalSessions = courseData.sessionsList.length;

  const handleSave = async () => {
    if (id && id !== "new") {
      if (
        courseData.originalPrice &&
        Number(courseData.originalPrice) < Number(courseData.price)
      ) {
        window.dispatchEvent(
          new CustomEvent("SHOW_GLOBAL_MODAL", {
            detail: {
              title: "Validation Error",
              message:
                "Original Price must be greater than or equal to the current Price.",
              mode: "alert",
              type: "warning",
            },
          }),
        );
        return;
      }

      if (
        courseData.minBand &&
        courseData.maxBand &&
        parseFloat(courseData.minBand) > parseFloat(courseData.maxBand)
      ) {
        window.dispatchEvent(
          new CustomEvent("SHOW_GLOBAL_MODAL", {
            detail: {
              title: "Validation Error",
              message:
                "Maximum band must be greater than or equal to minimum band.",
              mode: "alert",
              type: "warning",
            },
          }),
        );
        return;
      }

      if (courseData.sessionsList.length === 0) {
        window.dispatchEvent(
          new CustomEvent("SHOW_GLOBAL_MODAL", {
            detail: {
              title: "Validation Error",
              message: `Minimum 1 session is required.`,
              mode: "alert",
              type: "warning",
            },
          }),
        );
        return;
      }

      setIsUploadingImage(true); // Reuse as loading state for button
      try {
        const formattedDate = courseData.nextCohort || null;

        const cleanedSessions = courseData.sessionsList.map((m) => ({
          ...m,
        }));

        // map frontend fields to backend fields
        const backendData = {
          title: courseData.title,
          code: courseData.code,
          category: courseData.category,
          status: courseData.status,
          description: courseData.description,
          sessions: calculatedTotalSessions,
          format: courseData.format,
          band:
            courseData.minBand && courseData.maxBand
              ? courseData.minBand === courseData.maxBand
                ? courseData.minBand
                : `${courseData.minBand} - ${courseData.maxBand}`
              : courseData.minBand,
          price: parseFloat(courseData.price) || 0,
          original_price: parseFloat(courseData.originalPrice) || 0,
          max_size: parseInt(courseData.maxSize) || 15,
          location: courseData.location,
          language: courseData.language,
          next_cohort: formattedDate,
          image_url: courseData.imageUrl,
          allow_installments: courseData.allowInstallments,
          number_of_installments: Number(courseData.numberOfInstallments),
          sessions_list: cleanedSessions,
        };
        await CoursesService.updateCourse(id, backendData);
        window.dispatchEvent(
          new CustomEvent("SHOW_GLOBAL_MODAL", {
            detail: {
              title: "Success",
              message: "Course saved successfully!",
              mode: "alert",
              type: "success",
            },
          }),
        );
        setCourseData({
          ...courseData,
          sessions: String(calculatedTotalSessions),
          nextCohort: formattedDate,
        });
        setOriginalCourseData(
          JSON.parse(
            JSON.stringify({
              ...courseData,
              sessions: String(calculatedTotalSessions),
              nextCohort: formattedDate,
            }),
          ),
        );
        setIsEditing(false);
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        if (err.response?.data?.message) {
          window.dispatchEvent(
            new CustomEvent("SHOW_GLOBAL_MODAL", {
              detail: {
                title: "Error",
                message: err.response.data.message,
                mode: "alert",
                type: "error",
              },
            }),
          );
        } else {
          window.dispatchEvent(
            new CustomEvent("SHOW_GLOBAL_MODAL", {
              detail: {
                title: "Error",
                message: "An error occurred while saving the course.",
                mode: "alert",
                type: "error",
              },
            }),
          );
        }
      } finally {
        setIsUploadingImage(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (JSON.stringify(courseData) !== JSON.stringify(originalCourseData)) {
      window.dispatchEvent(
        new CustomEvent("SHOW_GLOBAL_MODAL", {
          detail: {
            title: "Unsaved Changes",
            message:
              "You have unsaved changes. Are you sure you want to discard them?",
            mode: "confirm",
            type: "warning",
            onConfirm: () => {
              setCourseData(JSON.parse(JSON.stringify(originalCourseData)));
              setIsEditing(false);
            },
          },
        }),
      );
    } else {
      setIsEditing(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploadingImage(true);
      const url = await CoursesService.uploadImage(file);
      if (url) {
        setCourseData({ ...courseData, imageUrl: url });
      } else {
        window.dispatchEvent(
          new CustomEvent("SHOW_GLOBAL_MODAL", {
            detail: {
              title: "Upload Failed",
              message: "Failed to upload image!",
              mode: "alert",
              type: "error",
            },
          }),
        );
      }
      setIsUploadingImage(false);
    }
  };

  const handleSessionChange = (index: number, field: string, value: string) => {
    const newSessions = [...courseData.sessionsList];
    newSessions[index] = { ...newSessions[index], [field]: value };
    setCourseData({ ...courseData, sessionsList: newSessions });
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split("T")[0];

  // Check if the cohort date is in the past or today
  let isCohortLocked = false;
  if (courseData.nextCohort) {
    const cohortDate = new Date(courseData.nextCohort);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (cohortDate <= today) {
      isCohortLocked = true;
    }
  }

  const handleTotalSessionsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const valStr = e.target.value;
    if (valStr === "") {
      setCourseData({
        ...courseData,
        sessionsList: [{ title: `Session 1: `, description: "" }],
      });
      return;
    }
    let val = parseInt(valStr);
    if (isNaN(val) || val < 1) return;
    if (val > 100) val = 100;

    setCourseData((prev) => {
      const currentLen = prev.sessionsList.length;
      if (val === currentLen) return prev;
      if (val > currentLen) {
        const added = Array.from({ length: val - currentLen }).map(() => ({
          title: "",
          description: "",
        }));
        return { ...prev, sessionsList: [...prev.sessionsList, ...added] };
      } else {
        return { ...prev, sessionsList: prev.sessionsList.slice(0, val) };
      }
    });
  };

  const handleAddSession = () => {
    setCourseData({
      ...courseData,
      sessionsList: [
        ...courseData.sessionsList,
        { title: "", description: "" },
      ],
    });
  };

  const handleRemoveSession = (index: number) => {
    if (courseData.sessionsList.length <= 1) return;
    const newSessions = courseData.sessionsList.filter((_, i) => i !== index);
    setCourseData({ ...courseData, sessionsList: newSessions });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      {/* Header / Edit Toggle */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/courses"
          className="p-2 rounded-full hover:bg-[#e0e3e5] text-[#43474e] transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-[#002045]">
          Course Details
        </h1>
        <div className="ml-auto flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-[#f1f4f6] text-[#43474e] px-4 py-2 rounded-xl font-bold hover:bg-[#e0e3e5] transition-colors"
              >
                <X size={20} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-[#0061a5] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#004d84] transition-colors"
              >
                <Save size={20} />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-[#e6f0fa] text-[#0061a5] px-4 py-2 rounded-xl font-bold hover:bg-[#d2e4ff] transition-colors"
            >
              <Edit size={20} />
              Edit Course
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        /* EDIT FORM */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] overflow-hidden">
              <div className="p-6 border-b border-[#e0e3e5] bg-[#f8f9fa]">
                <label className="block text-xs font-bold text-[#43474e] mb-2">
                  Cover Image
                </label>
                <div className="flex gap-4 items-start">
                  {courseData.imageUrl ? (
                    <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-[#c4c6cf]">
                      <img
                        src={courseData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setCourseData({ ...courseData, imageUrl: "" })
                        }
                        className="absolute top-1 right-1 bg-white/90 text-[#ba1a1a] p-1 rounded-full hover:bg-white transition-colors shadow-sm"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-40 h-24 rounded-lg border-2 border-dashed border-[#c4c6cf] flex flex-col items-center justify-center text-[#74777f] bg-white cursor-pointer hover:border-[#0061a5] hover:text-[#0061a5] transition-colors relative">
                      {isUploadingImage ? (
                        <div className="w-6 h-6 border-2 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <ImageIcon size={24} className="mb-1" />
                          <span className="text-xs font-medium">
                            Upload Image
                          </span>
                          <input
                            type="file"
                            onChange={handleImageChange}
                            className={`absolute inset-0 w-full h-full opacity-0 ${isUploadingImage ? "cursor-not-allowed" : "cursor-pointer"}`}
                            accept="image/*"
                            disabled={isUploadingImage}
                          />
                        </>
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-xs text-[#74777f] mb-2">
                      Upload a high-quality image to represent this course.
                      Recommended size: 1200x800px (16:9 ratio). Max file size:
                      5MB.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-col mb-6">
                  <label className="block text-xs font-bold text-[#43474e] mb-1">
                    Course Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={courseData.title}
                    onChange={handleChange}
                    className="w-full text-2xl font-bold text-[#181c1e] px-3 py-2 border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] mb-4"
                    placeholder="e.g. IELTS Intensive Mastery"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[13px] font-bold text-[#43474e] mb-1">
                        Course Code
                      </label>
                      <input
                        type="text"
                        value={courseData.code}
                        readOnly
                        className="w-full px-3 py-2 text-[14px] font-bold text-[#43474e] bg-[#e0e3e5] border border-[#c4c6cf] rounded-lg cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#43474e] mb-1">
                        Category
                      </label>
                      <select
                        name="category"
                        value={courseData.category}
                        onChange={handleChange}
                        disabled={isCohortLocked}
                        className={`w-full px-3 py-2 text-sm border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] ${isCohortLocked ? "bg-[#e0e3e5] cursor-not-allowed text-[#74777f]" : "bg-white"}`}
                      >
                        <option value="Masterclass">Masterclass</option>
                        <option value="Fundamentals">Fundamentals</option>
                        <option value="Specialized">Specialized</option>
                        <option value="General">General</option>
                        <option value="Private">Private</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#43474e] mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={courseData.status}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] bg-white"
                      >
                        <option value="Active">Active (Public)</option>
                        <option value="Hidden">Hidden (Private)</option>
                        <option value="Draft">Draft (Unpublished)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <textarea
                    name="description"
                    value={courseData.description}
                    onChange={handleChange}
                    className="w-full text-[#43474e] leading-relaxed p-3 border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] min-h-25"
                    placeholder="Course Description"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#e0e3e5]">
                    <Users className="text-[#0061a5] mb-2" size={24} />
                    <h4 className="text-xs text-[#74777f] font-bold uppercase mb-1">
                      Max Students
                    </h4>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        name="maxSize"
                        value={courseData.maxSize}
                        onChange={handleChange}
                        className="w-16 text-sm font-bold text-[#181c1e] p-1 border border-[#c4c6cf] rounded focus:outline-none focus:border-[#0061a5]"
                      />
                      <span className="text-xs font-bold text-[#74777f]">
                        / Class
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#e0e3e5]">
                    <BookOpen className="text-[#0061a5] mb-2" size={24} />
                    <h4 className="text-xs text-[#74777f] font-bold uppercase mb-1">
                      Sessions
                    </h4>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={calculatedTotalSessions || ""}
                        onChange={handleTotalSessionsChange}
                        disabled={isCohortLocked}
                        className={`w-16 text-sm font-bold text-[#181c1e] p-1 border border-[#c4c6cf] rounded focus:outline-none focus:border-[#0061a5] ${isCohortLocked ? "bg-[#e0e3e5] cursor-not-allowed" : "bg-white"}`}
                      />
                      <span className="text-xs font-bold text-[#74777f]">
                        Total
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#e0e3e5]">
                    <Globe className="text-[#0061a5] mb-2" size={24} />
                    <h4 className="text-xs text-[#74777f] font-bold uppercase mb-1">
                      Format
                    </h4>
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        name="format"
                        value="Offline"
                        readOnly
                        className="w-full text-sm font-bold text-[#43474e] p-1 border border-[#c4c6cf] rounded bg-[#e0e3e5] cursor-not-allowed outline-none"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#e0e3e5] col-span-2">
                    <Target className="text-[#0061a5] mb-2" size={24} />
                    <h4 className="text-xs text-[#74777f] font-bold uppercase mb-1">
                      Target
                    </h4>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-[#74777f]">
                        IELTS
                      </span>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max={courseData.maxBand || "9.0"}
                        name="minBand"
                        value={courseData.minBand}
                        onChange={handleChange}
                        readOnly={isCohortLocked}
                        className={`w-16 text-sm font-bold text-[#181c1e] p-1 border border-[#c4c6cf] rounded focus:outline-none focus:border-[#0061a5] ${isCohortLocked ? "bg-[#e0e3e5] cursor-not-allowed" : ""}`}
                      />
                      <span className="mx-2 text-[#74777f] font-bold">-</span>
                      <input
                        type="number"
                        step="0.5"
                        min={courseData.minBand || "0"}
                        max="9.0"
                        name="maxBand"
                        value={courseData.maxBand}
                        onChange={handleChange}
                        readOnly={isCohortLocked}
                        className={`w-16 text-sm font-bold text-[#181c1e] p-1 border border-[#c4c6cf] rounded focus:outline-none focus:border-[#0061a5] ${isCohortLocked ? "bg-[#e0e3e5] cursor-not-allowed" : ""}`}
                      />
                    </div>
                    {courseData.minBand &&
                      courseData.maxBand &&
                      parseFloat(courseData.minBand) >
                        parseFloat(courseData.maxBand) && (
                        <p className="text-[11px] text-[#ba1a1a] mt-1 font-medium">
                          Maximum band must be greater than or equal to minimum
                          band.
                        </p>
                      )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#181c1e]">Syllabus</h3>
                </div>
              </div>
              {isEditing && (
                <p className="text-[13px] text-[#74777f] mb-4">
                  Create the curriculum by adding sessions below.
                </p>
              )}
              <div className="space-y-6 max-h-125 overflow-y-auto pr-2 custom-scrollbar">
                {courseData.sessionsList.map((session, sIndex) => (
                  <div
                    key={sIndex}
                    className="p-4 border border-[#e0e3e5] rounded-xl bg-[#f7fafc]"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3 w-full pr-4">
                        <div className="w-8 h-8 bg-[#0061a5] text-white rounded-full flex items-center justify-center font-bold shrink-0">
                          {sIndex + 1}
                        </div>
                        <input
                          type="text"
                          value={session.title}
                          onChange={(e) =>
                            handleSessionChange(sIndex, "title", e.target.value)
                          }
                          readOnly={isCohortLocked && session.isExisting}
                          className={`flex-1 font-bold text-[#181c1e] px-3 py-1.5 border border-[#c4c6cf] rounded focus:outline-none focus:border-[#0061a5] ${isCohortLocked && session.isExisting ? "bg-[#e0e3e5] cursor-not-allowed" : ""}`}
                          placeholder="Session Title"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveSession(sIndex)}
                        disabled={
                          (isCohortLocked && session.isExisting) ||
                          courseData.sessionsList.length <= 1
                        }
                        className={`text-[#ba1a1a] p-1.5 rounded-lg shrink-0 mt-1 ${(isCohortLocked && session.isExisting) || courseData.sessionsList.length <= 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#fceeee]"}`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="pl-11 space-y-4">
                      <textarea
                        value={session.description}
                        onChange={(e) =>
                          handleSessionChange(
                            sIndex,
                            "description",
                            e.target.value,
                          )
                        }
                        readOnly={isCohortLocked && session.isExisting}
                        className={`w-full text-sm text-[#43474e] px-3 py-2 border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] ${isCohortLocked && session.isExisting ? "bg-[#e0e3e5] cursor-not-allowed" : ""}`}
                        placeholder="Session Description"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleAddSession}
                    className="px-6 py-2.5 bg-[#f1f4f6] text-[#0061a5] font-bold text-[14px] rounded-xl flex items-center gap-2 hover:bg-[#e6f0fa] transition-colors border border-[#c4c6cf] hover:border-[#0061a5]"
                  >
                    <Plus size={18} /> Add New Session
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] p-6">
              <h3 className="text-lg font-bold text-[#181c1e] mb-4">
                Pricing & Cohort
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#43474e] mb-1">
                      Current Price
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        name="price"
                        value={
                          courseData.price
                            ? new Intl.NumberFormat("vi-VN").format(
                                Number(courseData.price),
                              )
                            : ""
                        }
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setCourseData({ ...courseData, price: val });
                        }}
                        readOnly={isCohortLocked}
                        className={`w-full text-base font-bold px-2 py-1.5 border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] ${isCohortLocked ? "bg-[#e0e3e5] cursor-not-allowed" : ""}`}
                      />
                      <span className="text-xl font-bold text-[#0061a5]">
                        đ
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#43474e] mb-1">
                      Original Price
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        name="originalPrice"
                        value={
                          courseData.originalPrice
                            ? new Intl.NumberFormat("vi-VN").format(
                                Number(courseData.originalPrice),
                              )
                            : ""
                        }
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setCourseData({ ...courseData, originalPrice: val });
                        }}
                        readOnly={isCohortLocked}
                        className={`w-full text-base font-bold px-2 py-1.5 border ${courseData.price && courseData.originalPrice && Number(courseData.originalPrice) < Number(courseData.price) ? "border-[#ba1a1a] focus:border-[#ba1a1a]" : "border-[#c4c6cf] focus:border-[#0061a5]"} rounded-lg focus:outline-none ${isCohortLocked ? "bg-[#e0e3e5] cursor-not-allowed" : ""}`}
                      />
                      <span className="text-xl font-bold text-[#74777f]">
                        đ
                      </span>
                    </div>
                    {courseData.price &&
                      courseData.originalPrice &&
                      Number(courseData.originalPrice) <
                        Number(courseData.price) && (
                        <p className="text-[11px] text-[#ba1a1a] mt-1 font-medium">
                          Note: Original Price should be greater than Price.
                        </p>
                      )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#43474e] mb-1">
                    Course Starts
                  </label>
                  <div className="flex items-center gap-2">
                    <Clock className="text-[#74777f]" size={20} />
                    <input
                      type="date"
                      min={isCohortLocked ? undefined : minDateStr}
                      disabled={isCohortLocked}
                      name="nextCohort"
                      value={courseData.nextCohort}
                      onChange={handleChange}
                      className={`flex-1 text-sm font-bold px-2 py-1.5 border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] ${isCohortLocked ? "bg-[#e0e3e5] text-[#74777f] cursor-not-allowed" : ""}`}
                    />
                  </div>
                  {isCohortLocked && (
                    <p className="text-[11px] text-[#ba1a1a] mt-1 font-medium">
                      The course has already started, cohort date cannot be
                      changed.
                    </p>
                  )}
                </div>
                <div className="pt-2 pb-2 border-t border-[#e0e3e5] mt-2">
                  <label className="flex items-center gap-3 cursor-pointer mb-3">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="allowInstallments"
                        checked={courseData.allowInstallments}
                        onChange={(e) =>
                          setCourseData((prev) => ({
                            ...prev,
                            allowInstallments: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0061a5]"></div>
                    </div>
                    <span className="text-[14px] font-bold text-[#181c1e]">
                      Enable Installment Payments
                    </span>
                  </label>

                  {courseData.allowInstallments && (
                    <div className="ml-14 animate-fade-in-up">
                      <label className="block text-[13px] font-bold text-[#43474e] mb-1">
                        Number of Installments (Max 12)
                      </label>
                      <input
                        type="number"
                        min="2"
                        max="12"
                        name="numberOfInstallments"
                        value={courseData.numberOfInstallments}
                        onChange={handleChange}
                        className="w-1/3 px-4 py-2 bg-[#f7fafc] border border-[#c4c6cf] rounded-xl focus:border-[#0061a5] outline-none transition-all"
                      />
                      <p className="text-[12px] text-[#74777f] mt-1">
                        Specify how many terms the student can split the payment
                        into.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] p-6">
              <h3 className="text-lg font-bold text-[#181c1e] mb-4">
                Course Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#43474e] mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={courseData.location}
                    onChange={handleChange}
                    className="w-full text-sm font-bold px-2 py-1.5 border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5]"
                    placeholder="e.g. London Center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#43474e] mb-1">
                    Language
                  </label>
                  <input
                    type="text"
                    name="language"
                    value={courseData.language}
                    onChange={handleChange}
                    className="w-full text-sm font-bold px-2 py-1.5 border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5]"
                    placeholder="e.g. English"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#43474e] mb-1">
                    Max Class Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    name="maxSize"
                    value={courseData.maxSize}
                    onChange={handleChange}
                    className="w-full text-sm font-bold px-2 py-1.5 border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* PREVIEW/PUBLIC LAYOUT */
        <div className="grow w-full max-w-360 mx-auto pb-4">
          {/* Course Header Hero Area */}
          <div className="bg-[#002045] rounded-3xl p-6 md:p-10 shadow-lg mb-10 relative overflow-hidden flex flex-col md:flex-row gap-10 items-center">
            <div className="absolute top-0 right-0 w-100 h-100 bg-[#0061a5] rounded-full blur-[100px] opacity-40 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

            <div className="flex-1 z-10 w-full">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-[#0061a5] text-white text-xs font-bold px-3 py-1 rounded-full">
                  {courseData.category || "Category"}
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${courseData.status === "Active" ? "bg-[#e6f4ea] text-[#137333]" : courseData.status === "Hidden" ? "bg-[#ffebed] text-[#ba1a1a]" : "bg-[#f1f4f6] text-[#74777f]"}`}
                >
                  {courseData.status}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                {courseData.title}
              </h1>
              <p className="text-lg text-[#adc7f7] max-w-2xl mb-8 leading-relaxed">
                {courseData.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 md:gap-10 bg-white/5 rounded-2xl p-6 border border-white/10 w-fit backdrop-blur-sm">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#adc7f7] uppercase tracking-wider mb-1">
                    Target Band
                  </span>
                  <span className="text-2xl font-extrabold text-[#ffd200] flex items-center gap-2">
                    <Star className="w-6 h-6 fill-[#ffd200]" />{" "}
                    {courseData.minBand && courseData.maxBand
                      ? courseData.minBand === courseData.maxBand
                        ? courseData.minBand
                        : `${courseData.minBand} - ${courseData.maxBand}`
                      : courseData.minBand}
                  </span>
                </div>
                <div className="w-px h-12 bg-white/20 hidden md:block"></div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#adc7f7] uppercase tracking-wider mb-1">
                    Total Sessions
                  </span>
                  <span className="text-2xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-[#adc7f7]" />{" "}
                    {courseData.sessions}
                  </span>
                </div>
                <div className="w-px h-12 bg-white/20 hidden md:block"></div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#adc7f7] uppercase tracking-wider mb-1">
                    Format
                  </span>
                  <span className="text-2xl font-bold text-white flex items-center gap-2">
                    <Globe className="w-6 h-6 text-[#adc7f7]" />{" "}
                    {courseData.format}
                  </span>
                </div>
              </div>
            </div>

            {/* Enrollment Action Box */}
            <div className="bg-white rounded-2xl p-8 shadow-xl w-full md:w-85 z-10 flex flex-col border border-[#e0e3e5]">
              <div className="flex flex-col mb-6">
                {courseData.originalPrice && (
                  <span className="text-base text-[#74777f] line-through font-medium mb-1 whitespace-nowrap">
                    {new Intl.NumberFormat("vi-VN").format(
                      Number(courseData.originalPrice),
                    )}{" "}
                    đ
                  </span>
                )}
                <span className="text-4xl font-extrabold text-[#002045] leading-none tracking-tight whitespace-nowrap">
                  {courseData.price
                    ? new Intl.NumberFormat("vi-VN").format(
                        Number(courseData.price),
                      )
                    : "0"}{" "}
                  đ
                </span>
              </div>
              <div className="flex items-center gap-3 bg-[#f7fafc] rounded-xl p-4 mb-6 border border-[#e0e3e5]">
                <Clock className="text-[#0061a5] w-6 h-6" />
                <div className="text-sm text-[#43474e]">
                  Course starts:
                  <br />
                  <span className="font-bold text-[#002045] text-base">
                    {courseData.nextCohort
                      ? new Date(courseData.nextCohort).toLocaleDateString(
                          "en-GB",
                        )
                      : ""}
                  </span>
                </div>
              </div>
              <button
                disabled
                className="w-full bg-[#e0e3e5] text-[#74777f] font-bold py-4 rounded-xl flex justify-center items-center gap-2 cursor-not-allowed"
              >
                Enroll Now (Preview)
              </button>
            </div>
          </div>

          {/* Layout Grid: Content + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* Tab Navigation */}
              <div className="border-b border-[#e0e3e5] flex overflow-x-auto hide-scrollbar gap-8">
                {["syllabus", "tutors", "reviews", "schedule"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-base font-bold capitalize whitespace-nowrap transition-colors relative ${activeTab === tab ? "text-[#0061a5]" : "text-[#74777f] hover:text-[#002045]"}`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 w-full h-0.75 bg-[#0061a5] rounded-t-full"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === "syllabus" && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-[#002045]">
                    Syllabus
                  </h2>

                  <div className="max-h-125 overflow-y-auto pr-4">
                    <div className="relative border-l-2 border-[#e0e3e5] ml-4 space-y-6 pb-4 mt-4">
                      {courseData.sessionsList &&
                        courseData.sessionsList.map((session, index) => (
                          <div
                            key={index}
                            className="relative pl-8 animate-fade-in"
                          >
                            {/* Timeline Dot */}
                            <div className="absolute -left-4.25 top-1 w-8 h-8 rounded-full bg-[#e6f0fa] border-4 border-white text-[#0061a5] flex items-center justify-center text-sm font-bold shadow-sm">
                              {index + 1}
                            </div>
                            {/* Content Card */}
                            <div className="bg-white border border-[#e0e3e5] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                              <h3 className="text-lg font-bold text-[#002045] mb-2">
                                {session.title}
                              </h3>
                              {session.description && (
                                <p className="text-sm text-[#43474e] leading-relaxed">
                                  {session.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "tutors" && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-[#002045]">
                    Lead Instructors
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white border border-[#c4c6cf] rounded-2xl p-6 flex gap-4 shadow-sm">
                      <img
                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200"
                        alt="Tutor"
                        className="w-20 h-20 rounded-full object-cover shrink-0"
                      />
                      <div className="flex flex-col">
                        <h3 className="text-lg font-bold text-[#002045]">
                          James Sterling
                        </h3>
                        <span className="text-xs font-bold text-[#0061a5] mb-2 uppercase tracking-wide">
                          Ex-IELTS Examiner
                        </span>
                        <p className="text-sm text-[#43474e] line-clamp-2">
                          Specializes in Advanced Writing Task 2 structure and
                          logic.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {["reviews", "schedule"].includes(activeTab) && (
                <div className="flex items-center justify-center h-50 bg-white border border-[#e0e3e5] rounded-2xl text-[#74777f] animate-fade-in">
                  Content for {activeTab} will be available soon.
                </div>
              )}
            </div>

            {/* Sidebar (Desktop) */}
            <aside className="lg:col-span-4 flex flex-col gap-6">
              {/* Key Information Card */}
              <div className="bg-white border border-[#c4c6cf] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#002045] border-b border-[#e0e3e5] pb-4 mb-6">
                  Course Details
                </h3>

                <div className="flex flex-col gap-5">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#f1f4f6] p-2 rounded-lg text-[#0061a5]">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-base font-bold text-[#002045]">
                        {courseData.location || "London Center / Online"}
                      </div>
                      <div className="text-sm text-[#74777f]">
                        {courseData.format
                          ? `${courseData.format} delivery model`
                          : "Hybrid delivery model"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-[#f1f4f6] p-2 rounded-lg text-[#0061a5]">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-base font-bold text-[#002045]">
                        {courseData.language || "English"}
                      </div>
                      <div className="text-sm text-[#74777f]">
                        Instruction language
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-[#f1f4f6] p-2 rounded-lg text-[#0061a5]">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-base font-bold text-[#002045]">
                        Max {courseData.maxSize} Students / Class
                      </div>
                      <div className="text-sm text-[#74777f]">
                        Small group focus
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourseDetail;
