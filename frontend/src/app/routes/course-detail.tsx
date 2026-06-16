import { useState, useEffect } from "react";
import {
  BookOpen,
  Headset,
  Compass,
  ArrowRight,
  Star,
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  Globe,
  Users,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { TopNav } from "@/shared/components/layout/TopNav";
import Cookies from "js-cookie";
import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";
import { CoursesService } from "@/shared/services/courses.service";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 p-10 flex flex-col items-start justify-center text-left">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            React App Crashed
          </h1>
          <pre className="bg-white p-4 rounded shadow text-red-800 text-sm overflow-auto max-w-full">
            {this.state.error?.toString()}
            <br />
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const CourseDetailInner = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!Cookies.get("access_token") && !!Cookies.get("user_info"),
  );
  const [userInfo] = useState<Record<string, unknown> | undefined>(() => {
    const userStr = Cookies.get("user_info");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return undefined;
      }
    }
    return undefined;
  });
  const [userRole] = useState<"learner" | "tutor" | "staff" | "admin">(() => {
    const userStr = Cookies.get("user_info");
    if (userStr) {
      try {
        return JSON.parse(userStr).role?.toLowerCase() || "learner";
      } catch {
        return "learner";
      }
    }
    return "learner";
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("syllabus");
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchCourse = async () => {
      if (!id) return;
      try {
        const data = await CoursesService.getCourseById(id);
        if (data) {
          const status = String(
            (data as unknown as Course & { status?: string }).status || "",
          ).toLowerCase();
          if (status === "draft" || status === "hidden") {
            setCourse(null);
            setErrorMsg("This course is currently not available.");
          } else {
            setCourse(data as unknown as Course);
          }
        } else {
          setCourse(null);
        }
      } catch (e: unknown) {
        console.error("Failed to fetch course:", e);
        setErrorMsg(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-[#002045]">Course not found</h1>
        <p className="text-red-500">{errorMsg || "Invalid course data"}</p>
        <Link to="/courses" className="text-[#0061a5] hover:underline">
          Return to Courses
        </Link>
      </div>
    );
  }

  // Tab state and Modal state moved to top

  interface CourseModule {
    title: string;
    sessions: string;
    description: string;
    topics: string[];
  }

  interface Course {
    id: number | string;
    title: string;
    band: string;
    duration: string;
    sessions: number;
    format: string;
    location?: string;
    language?: string;
    type: string;
    price: string | number;
    originalPrice?: string | number;
    original_price?: string | number;
    max_size?: number;
    description: string;
    nextCohort?: string;
    next_cohort?: string;
    modules?: CourseModule[];
  }

  return (
    <div className="bg-[#f7fafc] text-[#181c1e] text-base leading-6 font-sans min-h-screen flex flex-col">
      <TopNav
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        userInfo={userInfo}
        userRole={userRole}
      />

      {/* Main Content */}
      <main className="grow w-full max-w-360 mx-auto px-4 lg:px-8 py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-[#74777f] mb-6">
          <Link
            to="/courses"
            className="hover:text-[#0061a5] transition-colors"
          >
            Courses
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#181c1e] font-medium">{course.title}</span>
        </nav>

        {/* Course Header Hero Area */}
        <div className="bg-[#002045] rounded-3xl p-6 md:p-10 shadow-lg mb-10 relative overflow-hidden flex flex-col md:flex-row gap-10 items-center">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-100 h-100 bg-[#0061a5] rounded-full blur-[100px] opacity-40 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

          <div className="flex-1 z-10 w-full">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-[#0061a5] text-white text-xs font-bold px-3 py-1 rounded-full">
                {course.type}
              </span>
              <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {course.duration}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
              {course.title}
            </h1>
            <p className="text-lg text-[#adc7f7] max-w-2xl mb-8 leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 md:gap-10 bg-white/5 rounded-2xl p-6 border border-white/10 w-fit backdrop-blur-sm">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#adc7f7] uppercase tracking-wider mb-1">
                  Target Band
                </span>
                <span className="text-2xl font-extrabold text-[#ffd200] flex items-center gap-2">
                  <Star className="w-6 h-6 fill-[#ffd200]" /> {course.band}
                </span>
              </div>
              <div className="w-px h-12 bg-white/20 hidden md:block"></div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#adc7f7] uppercase tracking-wider mb-1">
                  Total Sessions
                </span>
                <span className="text-2xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-[#adc7f7]" />{" "}
                  {course.sessions}
                </span>
              </div>
              <div className="w-px h-12 bg-white/20 hidden md:block"></div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#adc7f7] uppercase tracking-wider mb-1">
                  Format
                </span>
                <span className="text-2xl font-bold text-white flex items-center gap-2">
                  <Globe className="w-6 h-6 text-[#adc7f7]" /> {course.format}
                </span>
              </div>
            </div>
          </div>

          {/* Enrollment Action Box */}
          <div className="bg-white rounded-2xl p-8 shadow-xl w-full md:w-85 z-10 flex flex-col border border-[#e0e3e5]">
            <div className="flex flex-col mb-6">
              {(course.original_price || course.originalPrice) && (
                <span className="text-base text-[#74777f] line-through font-medium mb-1 whitespace-nowrap">
                  {new Intl.NumberFormat("vi-VN").format(
                    Number(course.original_price || course.originalPrice),
                  )}{" "}
                  đ
                </span>
              )}
              <span className="text-4xl font-extrabold text-[#002045] leading-none tracking-tight whitespace-nowrap">
                {course.price
                  ? new Intl.NumberFormat("vi-VN").format(Number(course.price))
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
                  {course.next_cohort || course.nextCohort}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  navigate("/login");
                } else {
                  navigate(`/courses/${id}/register`);
                }
              }}
              className="w-full bg-[#0061a5] text-white font-bold py-4 rounded-xl shadow-md hover:bg-[#004a80] hover:shadow-lg hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 mb-4"
            >
              Enroll Now
              <ArrowRight className="w-5 h-5" />
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

                {/* Dynamic Syllabus Content */}
                <div className="space-y-4">
                  {Array.isArray(course.modules) &&
                    course.modules.map((module, index) => (
                      <div
                        key={index}
                        className={`bg-white border border-[#e0e3e5] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow ${index > 0 ? "opacity-70" : ""}`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
                          <h3 className="text-xl font-bold text-[#002045] flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#e6f0fa] text-[#0061a5] flex items-center justify-center text-sm">
                              {index + 1}
                            </div>
                            {module.title}
                          </h3>
                          <span className="bg-[#f7fafc] text-[#43474e] text-xs font-bold px-3 py-1 rounded-full border border-[#e0e3e5] whitespace-nowrap w-fit">
                            {module.sessions} Sessions
                          </span>
                        </div>
                        {index === 0 && (
                          <>
                            <p className="text-[#43474e] mb-4 leading-relaxed">
                              {module.description}
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                              {Array.isArray(module.topics) &&
                                module.topics.map((topic, tIndex) => (
                                  <li
                                    key={tIndex}
                                    className="flex items-start gap-2 text-sm text-[#43474e]"
                                  >
                                    <CheckCircle2 className="w-5 h-5 text-[#0061a5] shrink-0 mt-0.5" />
                                    <span>
                                      {typeof topic === "object"
                                        ? JSON.stringify(topic)
                                        : String(topic)}
                                    </span>
                                  </li>
                                ))}
                            </ul>
                          </>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {activeTab === "tutors" && (
              <div className="flex flex-col gap-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-[#002045]">
                  Lead Instructors
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Tutor 1 */}
                  <div className="bg-white border border-[#c4c6cf] rounded-2xl p-6 flex gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
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
                      <div className="flex items-center gap-1 text-xs font-bold text-[#74777f] mb-2">
                        <Star className="w-4 h-4 fill-[#ffd200] text-[#ffd200]" />{" "}
                        4.9 (120 reviews)
                      </div>
                      <p className="text-sm text-[#43474e] line-clamp-2">
                        Specializes in Advanced Writing Task 2 structure and
                        logic.
                      </p>
                    </div>
                  </div>
                  {/* Tutor 2 */}
                  <div className="bg-white border border-[#c4c6cf] rounded-2xl p-6 flex gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
                      alt="Tutor"
                      className="w-20 h-20 rounded-full object-cover shrink-0"
                    />
                    <div className="flex flex-col">
                      <h3 className="text-lg font-bold text-[#002045]">
                        Dr. Eleanor Vance
                      </h3>
                      <span className="text-xs font-bold text-[#0061a5] mb-2 uppercase tracking-wide">
                        Reading Specialist
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-[#74777f] mb-2">
                        <Star className="w-4 h-4 fill-[#ffd200] text-[#ffd200]" />{" "}
                        4.9 (95 reviews)
                      </div>
                      <p className="text-sm text-[#43474e] line-clamp-2">
                        Focuses on critical thinking and complex text analysis.
                      </p>
                    </div>
                  </div>
                  {/* Tutor 3 */}
                  <div className="bg-white border border-[#c4c6cf] rounded-2xl p-6 flex gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <img
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200"
                      alt="Tutor"
                      className="w-20 h-20 rounded-full object-cover shrink-0"
                    />
                    <div className="flex flex-col">
                      <h3 className="text-lg font-bold text-[#002045]">
                        Sophia Chen
                      </h3>
                      <span className="text-xs font-bold text-[#0061a5] mb-2 uppercase tracking-wide">
                        Speaking Coach
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-[#74777f] mb-2">
                        <Star className="w-4 h-4 fill-[#ffd200] text-[#ffd200]" />{" "}
                        5.0 (210 reviews)
                      </div>
                      <p className="text-sm text-[#43474e] line-clamp-2">
                        Helps students achieve natural fluency and
                        pronunciation.
                      </p>
                    </div>
                  </div>
                  {/* Tutor 4 */}
                  <div className="bg-white border border-[#c4c6cf] rounded-2xl p-6 flex gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200"
                      alt="Tutor"
                      className="w-20 h-20 rounded-full object-cover shrink-0"
                    />
                    <div className="flex flex-col">
                      <h3 className="text-lg font-bold text-[#002045]">
                        Michael Chang
                      </h3>
                      <span className="text-xs font-bold text-[#0061a5] mb-2 uppercase tracking-wide">
                        Listening Master
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-[#74777f] mb-2">
                        <Star className="w-4 h-4 fill-[#ffd200] text-[#ffd200]" />{" "}
                        4.8 (88 reviews)
                      </div>
                      <p className="text-sm text-[#43474e] line-clamp-2">
                        Expert in breaking down fast-paced native accents.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs can remain empty for now */}
            {["reviews", "schedule"].includes(activeTab) && (
              <div className="flex items-center justify-center h-50 bg-white border border-[#e0e3e5] rounded-2xl text-[#74777f] animate-fade-in">
                Content for {activeTab} will be available soon.
              </div>
            )}
          </div>

          {/* Sidebar (Desktop) / Bottom section (Mobile) */}
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
                      {course?.location}
                    </div>
                    <div className="text-sm text-[#74777f]">
                      {course?.format
                        ? `${course.format} delivery model`
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
                      {course?.language || "English"}
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
                      Max {course?.max_size || 15} Students / Class
                    </div>
                    <div className="text-sm text-[#74777f]">
                      Small group focus
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Promotional / Promo Code Box */}
            <div className="bg-[#002045] rounded-2xl p-6 shadow-sm text-white">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Ticket className="text-[#ffd200]" /> Apply Promo Code
              </h3>
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#adc7f7] placeholder:text-white/50"
                  placeholder="Enter code"
                  type="text"
                />
                <button className="bg-white text-[#002045] font-bold px-6 py-3 rounded-xl hover:bg-[#f1f4f6] transition-colors">
                  Apply
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer Component */}
      <footer className="bg-[#00142d] text-[#f1f4f6] w-full pt-20 pb-10 border-t-4 border-[#0061a5] mt-auto">
        <div className="max-w-300 mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="col-span-1 md:col-span-3 lg:col-span-5 flex flex-col items-start">
            <div className="text-3xl font-extrabold text-white mb-5 flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-[#adc7f7]" /> ICMS
            </div>
            <p className="text-[#a8aeb4] text-sm leading-6 mb-6 max-w-75">
              Empowering students to achieve their target IELTS band score with
              proven methodologies and elite instructors.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-[#a8aeb4] text-sm">
                <Headset className="w-5 h-5 text-[#adc7f7]" />
                <span>
                  Hotline: <strong className="text-white">1900 1234</strong>
                </span>
              </div>
              <div className="flex items-start gap-3 text-[#a8aeb4] text-sm">
                <Compass className="w-5 h-5 text-[#adc7f7] mt-0.5" />
                <span>
                  123 Education Street, Tech District,
                  <br />
                  Hanoi, Vietnam
                </span>
              </div>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-4">
            <h4 className="text-base font-bold text-white mb-6 uppercase tracking-wider">
              Our Programs
            </h4>
            <div className="flex flex-col gap-4">
              <Link
                to="/courses"
                className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-sm flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4" /> IELTS Masterclass
              </Link>
              <Link
                to="/courses"
                className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-sm flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4" /> Academic Fundamentals
              </Link>
              <Link
                to="/courses"
                className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-sm flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4" /> Intensive Crash Course
              </Link>
              <Link
                to="/courses"
                className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-sm flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4" /> 1-on-1 Private Tutoring
              </Link>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-3">
            <h4 className="text-base font-bold text-white mb-6 uppercase tracking-wider">
              Explore
            </h4>
            <div className="flex flex-col gap-4">
              <a
                href="/homepage#about"
                className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-sm"
              >
                About ICMS
              </a>
              <a
                href="/homepage#tutors"
                className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-sm"
              >
                Our Tutors
              </a>
              <a
                href="/homepage#stories"
                className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-sm"
              >
                Success Stories
              </a>
              <a
                href="/homepage#consultation"
                className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-sm"
              >
                Free Consultation
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-300 mx-auto px-4 lg:px-8 mt-16 pt-8 border-t border-[#43474e] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-[#a8aeb4]">
            © {new Date().getFullYear()} ICMS Education. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-[#a8aeb4] hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-[#a8aeb4] hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </footer>

      {/* Modal removed to use actual registration page */}
    </div>
  );
};

const CourseDetail = () => (
  <ErrorBoundary>
    <CourseDetailInner />
  </ErrorBoundary>
);

export default CourseDetail;
