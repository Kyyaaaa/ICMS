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
  CheckCircle2,
  ShieldCheck,
  MapPin,
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
  duration?: string;
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
  modules?: ApiModule[];
}

const AdminCourseDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(id !== "new");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [initialDuration, setInitialDuration] = useState(1);
  const [courseData, setCourseData] = useState({
    title: "",
    code: "",
    category: "",
    status: "Draft",
    description: "",
    duration: "",
    sessions: "",
    maxSize: "",
    format: "",
    location: "London Center / Online",
    language: "English",
    minBand: "",
    maxBand: "",
    price: "",
    originalPrice: "",
    nextCohort: "",
    imageUrl: "",
    modules: [] as {
      title?: string;
      sessions?: number | string;
      description?: string;
      topics?: string[];
      isExisting?: boolean;
    }[],
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
          let dur = "";
          if (data.duration) {
            dur = data.duration.replace(/[^\d]/g, "");
            setInitialDuration(parseInt(dur) || 1);
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

          const parsedModules = data.modules
            ? data.modules.map((m: ApiModule) => ({
                ...m,
                sessions: m.sessions
                  ? parseInt(String(m.sessions).replace(/[^\d]/g, "")) || 1
                  : 1,
                topics: Array.isArray(m.topics)
                  ? m.topics
                  : typeof m.topics === "string"
                    ? m.topics
                        .split("\n")
                        .filter((t: string) => t.trim() !== "")
                    : [],
                isExisting: true,
              }))
            : [];

          const initialState = {
            title: data.title || "",
            code: data.code || "",
            category: data.category || "",
            status: data.status || "Draft",
            description: data.description || "",
            duration: dur,
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
            modules: parsedModules,
          };
          setCourseData(initialState);
          setOriginalCourseData(JSON.parse(JSON.stringify(initialState)));
        }
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const calculatedTotalSessions = courseData.modules.reduce(
    (acc, mod) => acc + (Number(mod.sessions) || 0),
    0,
  );

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

      if (courseData.modules.length === 0) {
        window.dispatchEvent(
          new CustomEvent("SHOW_GLOBAL_MODAL", {
            detail: {
              title: "Validation Error",
              message: "At least 1 Course Module is required.",
              mode: "alert",
              type: "warning",
            },
          }),
        );
        return;
      }

      setIsUploadingImage(true); // Reuse as loading state for button
      try {
        let formattedDate = courseData.nextCohort;
        if (formattedDate && formattedDate.includes("-")) {
          const parts = formattedDate.split("-");
          if (parts.length === 3) {
            formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`; // YYYY-MM-DD -> DD/MM/YYYY
          }
        }

        const cleanedModules = courseData.modules.map((m) => ({
          ...m,
          sessions: `${m.sessions} Sessions`,
          topics:
            m.topics && Array.isArray(m.topics)
              ? m.topics.filter(
                  (t: unknown) => typeof t === "string" && t.trim() !== "",
                )
              : [],
        }));

        // map frontend fields to backend fields
        const backendData = {
          title: courseData.title,
          code: courseData.code,
          category: courseData.category,
          status: courseData.status,
          description: courseData.description,
          duration: `${courseData.duration} Weeks`,
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
          modules: cleanedModules,
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
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
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

  const handleModuleChange = (index: number, field: string, value: string) => {
    const newModules = [...courseData.modules];
    newModules[index] = { ...newModules[index], [field]: value };
    setCourseData({ ...courseData, modules: newModules });
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

  const handleTopicChange = (
    moduleIndex: number,
    topicIndex: number,
    value: string,
  ) => {
    const newModules = [...courseData.modules];
    const newTopics = [...(newModules[moduleIndex].topics || [])];
    newTopics[topicIndex] = value;
    newModules[moduleIndex] = { ...newModules[moduleIndex], topics: newTopics };
    setCourseData({ ...courseData, modules: newModules });
  };

  const handleAddModule = () => {
    setCourseData({
      ...courseData,
      modules: [
        ...courseData.modules,
        { title: "New Module", sessions: 1, description: "", topics: [""] },
      ],
    });
  };

  const handleRemoveModule = (index: number) => {
    const newModules = courseData.modules.filter((_, i) => i !== index);
    setCourseData({ ...courseData, modules: newModules });
  };

  const handleAddTopic = (moduleIndex: number) => {
    const newModules = [...courseData.modules];
    newModules[moduleIndex].topics = [...(newModules[moduleIndex].topics || []), ""];
    setCourseData({ ...courseData, modules: newModules });
  };

  const handleRemoveTopic = (moduleIndex: number, topicIndex: number) => {
    setCourseData((prev) => {
      const newModules = [...prev.modules];
      newModules[moduleIndex].topics = (newModules[moduleIndex].topics || []).filter(
        (_: string, i: number) => i !== topicIndex,
      );
      return { ...prev, modules: newModules };
    });
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
                      <input
                        type="text"
                        name="category"
                        value={courseData.category}
                        onChange={handleChange}
                        readOnly={isCohortLocked}
                        className={`w-full px-3 py-2 text-sm border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] ${isCohortLocked ? "bg-[#e0e3e5] cursor-not-allowed" : ""}`}
                        placeholder="e.g. Masterclass"
                      />
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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#e0e3e5]">
                    <Clock className="text-[#0061a5] mb-2" size={24} />
                    <h4 className="text-xs text-[#74777f] font-bold uppercase mb-1">
                      Duration
                    </h4>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={isCohortLocked ? initialDuration : 1}
                        name="duration"
                        value={courseData.duration}
                        onChange={handleChange}
                        className="w-16 text-sm font-bold text-[#181c1e] p-1 border border-[#c4c6cf] rounded focus:outline-none focus:border-[#0061a5]"
                      />
                      <span className="text-xs font-bold text-[#74777f]">
                        Weeks
                      </span>
                    </div>
                  </div>
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
                        type="text"
                        readOnly
                        value={calculatedTotalSessions}
                        className="w-16 text-sm font-bold text-[#43474e] bg-[#e0e3e5] p-1 border border-[#c4c6cf] rounded cursor-not-allowed outline-none"
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
                        value={courseData.format}
                        onChange={handleChange}
                        readOnly={isCohortLocked}
                        className={`w-full text-sm font-bold text-[#181c1e] p-1 border border-[#c4c6cf] rounded focus:outline-none focus:border-[#0061a5] ${isCohortLocked ? "bg-[#e0e3e5] cursor-not-allowed" : ""}`}
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
                  <h3 className="text-lg font-bold text-[#181c1e]">
                    Course Modules
                  </h3>
                  {isCohortLocked && (
                    <p className="text-xs text-[#ba1a1a] mt-1">
                      Note: adding modules should be accompanied by an increase
                      in duration.
                    </p>
                  )}
                </div>
                <button
                  onClick={handleAddModule}
                  className="text-sm text-[#0061a5] font-bold hover:underline"
                >
                  + Add Module
                </button>
              </div>
              <div className="space-y-6">
                {courseData.modules.map((module, mIndex) => (
                  <div
                    key={mIndex}
                    className="p-4 border border-[#e0e3e5] rounded-xl bg-[#f7fafc]"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3 w-full pr-4">
                        <div className="w-8 h-8 bg-[#0061a5] text-white rounded-full flex items-center justify-center font-bold shrink-0">
                          {mIndex + 1}
                        </div>
                        <input
                          type="text"
                          value={module.title}
                          onChange={(e) =>
                            handleModuleChange(mIndex, "title", e.target.value)
                          }
                          readOnly={isCohortLocked && module.isExisting}
                          className={`flex-1 font-bold text-[#181c1e] px-3 py-1.5 border border-[#c4c6cf] rounded focus:outline-none focus:border-[#0061a5] ${isCohortLocked && module.isExisting ? "bg-[#e0e3e5] cursor-not-allowed" : ""}`}
                          placeholder="Module Title"
                        />
                        <div className="flex items-center gap-1 shrink-0">
                          <input
                            type="number"
                            min="1"
                            value={module.sessions}
                            onChange={(e) =>
                              handleModuleChange(
                                mIndex,
                                "sessions",
                                e.target.value,
                              )
                            }
                            readOnly={isCohortLocked && module.isExisting}
                            className={`w-16 text-sm font-bold text-[#0061a5] px-2 py-1.5 border border-[#c4c6cf] rounded focus:outline-none focus:border-[#0061a5] ${isCohortLocked && module.isExisting ? "bg-[#e0e3e5] cursor-not-allowed" : ""}`}
                          />
                          <span className="text-xs font-bold text-[#74777f]">
                            Sessions
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveModule(mIndex)}
                        disabled={isCohortLocked && module.isExisting}
                        className={`text-[#ba1a1a] p-1.5 rounded-lg shrink-0 mt-1 ${isCohortLocked && module.isExisting ? "opacity-50 cursor-not-allowed" : "hover:bg-[#fceeee]"}`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="pl-11 space-y-4">
                      <textarea
                        value={module.description}
                        onChange={(e) =>
                          handleModuleChange(
                            mIndex,
                            "description",
                            e.target.value,
                          )
                        }
                        readOnly={isCohortLocked && module.isExisting}
                        className={`w-full text-sm text-[#43474e] px-3 py-2 border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] ${isCohortLocked && module.isExisting ? "bg-[#e0e3e5] cursor-not-allowed" : ""}`}
                        placeholder="Module Description"
                        rows={2}
                      />

                      <div className="space-y-2">
                        <div className="text-xs font-bold text-[#43474e] mb-2 flex justify-between items-center">
                          <span>Key Topics</span>
                          <button
                            onClick={() => handleAddTopic(mIndex)}
                            disabled={isCohortLocked && module.isExisting}
                            className={`text-[#0061a5] ${isCohortLocked && module.isExisting ? "opacity-50 cursor-not-allowed" : "hover:underline"}`}
                          >
                            + Add Topic
                          </button>
                        </div>
                        {module.topics &&
                          module.topics.map((topic: string, tIndex: number) => (
                            <div
                              key={tIndex}
                              className="flex items-center gap-2"
                            >
                              <CheckCircle2 className="text-[#0061a5] w-4 h-4 shrink-0" />
                              <input
                                type="text"
                                value={topic}
                                onChange={(e) =>
                                  handleTopicChange(
                                    mIndex,
                                    tIndex,
                                    e.target.value,
                                  )
                                }
                                readOnly={isCohortLocked && module.isExisting}
                                className={`flex-1 text-sm text-[#181c1e] px-2 py-1 border border-[#c4c6cf] rounded focus:outline-none focus:border-[#0061a5] ${isCohortLocked && module.isExisting ? "bg-[#e0e3e5] cursor-not-allowed" : ""}`}
                                placeholder="Topic point"
                              />
                              <button
                                onClick={() =>
                                  handleRemoveTopic(mIndex, tIndex)
                                }
                                disabled={isCohortLocked && module.isExisting}
                                className={`text-[#ba1a1a] p-1 rounded shrink-0 ${isCohortLocked && module.isExisting ? "opacity-50 cursor-not-allowed" : "hover:bg-[#fceeee]"}`}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {courseData.duration}
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
              <div className="flex justify-between items-end mb-4 gap-2">
                <span className="text-4xl font-extrabold text-[#002045] leading-none whitespace-nowrap">
                  {courseData.price
                    ? new Intl.NumberFormat("vi-VN").format(
                        Number(courseData.price),
                      )
                    : "0"}{" "}
                  đ
                </span>
                {courseData.originalPrice && (
                  <span className="text-lg text-[#74777f] line-through font-medium mb-1 whitespace-nowrap text-right">
                    {new Intl.NumberFormat("vi-VN").format(
                      Number(courseData.originalPrice),
                    )}{" "}
                    đ
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 bg-[#f7fafc] rounded-xl p-4 mb-6 border border-[#e0e3e5]">
                <Clock className="text-[#0061a5] w-6 h-6" />
                <div className="text-sm text-[#43474e]">
                  Course starts:
                  <br />
                  <span className="font-bold text-[#002045] text-base">
                    {courseData.nextCohort &&
                    courseData.nextCohort.includes("-")
                      ? courseData.nextCohort.split("-").reverse().join("/")
                      : courseData.nextCohort}
                  </span>
                </div>
              </div>
              <button
                disabled
                className="w-full bg-[#e0e3e5] text-[#74777f] font-bold py-4 rounded-xl flex justify-center items-center gap-2 mb-4 cursor-not-allowed"
              >
                Enroll Now (Preview)
              </button>
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-[#74777f]">
                <ShieldCheck className="w-4 h-4 text-[#0061a5]" /> 14-day
                money-back guarantee
              </div>
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
                    Course Modules
                  </h2>

                  {courseData.modules &&
                    courseData.modules.map((module, index) => (
                      <div
                        key={index}
                        className={`bg-white border border-[#c4c6cf] rounded-2xl overflow-hidden shadow-sm ${index > 0 ? "opacity-70" : ""}`}
                      >
                        <div className="bg-[#f7fafc] px-6 py-4 flex justify-between items-center border-b border-[#e0e3e5]">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? "bg-[#0061a5] text-white" : "bg-[#e0e3e5] text-[#43474e]"}`}
                            >
                              {index + 1}
                            </div>
                            <h3
                              className={`text-lg font-bold ${index === 0 ? "text-[#002045]" : "text-[#43474e]"}`}
                            >
                              {module.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-4">
                            <span
                              className={`text-xs font-bold px-3 py-1 rounded-full ${index === 0 ? "text-[#0061a5] bg-[#e6f0fa]" : "text-[#74777f] bg-white border border-[#c4c6cf]"}`}
                            >
                              {module.sessions} Sessions
                            </span>
                          </div>
                        </div>
                        {index === 0 && (
                          <div className="p-6 flex flex-col gap-4">
                            <p className="text-[#43474e]">
                              {module.description}
                            </p>
                            <ul className="flex flex-col gap-3 mt-2">
                              {module.topics &&
                                module.topics.map(
                                  (topic: string, tIndex: number) => (
                                    <li
                                      key={tIndex}
                                      className="flex items-start gap-3 text-[#181c1e] font-medium"
                                    >
                                      <CheckCircle2 className="text-[#0061a5] w-5 h-5 shrink-0" />{" "}
                                      {topic}
                                    </li>
                                  ),
                                )}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
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
                        {courseData.format ? `${courseData.format} delivery model` : "Hybrid delivery model"}
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
