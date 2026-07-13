import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Save, Search, Plus, Trash2, Users, BarChart3, MessageSquareText, Settings2, X, MessageCircle } from 'lucide-react';
import { showAlertModal, showConfirmModal } from '@/utils/modal';
import { GradebookService } from '../services/gradebook.service';
import type { Assessment, StudentWithGrades } from '../services/gradebook.service';

const TutorGradebook = () => {
    const { id: classId } = useParams<{ id: string }>();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [gradesData, setGradesData] = useState<StudentWithGrades[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [gradingStatus, setGradingStatus] = useState<string>('PENDING');
    const defaultScale = 9;
    
    // Side Panel State
    const [selectedCell, setSelectedCell] = useState<{ studentId: string, assId: string } | null>(null);
    
    // Modal State for Adding Column
    const [showAddModal, setShowAddModal] = useState(false);
    const [newAssTitle, setNewAssTitle] = useState('');
    
    const [deletedAssessmentIds, setDeletedAssessmentIds] = useState<string[]>([]);

    useEffect(() => {
        if (!classId) return;
        const loadData = async () => {
            setIsLoading(true);
            try {
                const data = await GradebookService.getGradebook(classId);
                setAssessments(data.assessments);
                setGradesData(data.students);
                setGradingStatus(data.grading_status);
            } catch (_error) {
                showAlertModal('Error', 'Failed to load gradebook data.', 'error');
            }
            setIsLoading(false);
        };
        loadData();
    }, [classId]);

    const calculateAverage = (grades: { [key: string]: { score: number | null } }) => {
        let totalNormalized = 0;
        let count = 0;

        assessments.forEach(ass => {
            const grade = grades[ass.id];
            if (grade && grade.score !== null) {
                totalNormalized += (Number(grade.score) / ass.maxScore) * defaultScale;
                count++;
            }
        });

        if (count === 0) return '-';
        const rawAvg = totalNormalized / count;

        if (defaultScale === 9) {
            const fraction = rawAvg - Math.floor(rawAvg);
            let roundedAvg = Math.floor(rawAvg);
            if (fraction >= 0.75) roundedAvg += 1.0;
            else if (fraction >= 0.25) roundedAvg += 0.5;
            return roundedAvg.toFixed(1);
        }

        return rawAvg.toFixed(1);
    };

    const classAverage = () => {
        let total = 0;
        let count = 0;
        gradesData.forEach(s => {
            const avg = calculateAverage(s.grades);
            if (avg !== '-') {
                total += Number(avg);
                count++;
            }
        });
        return count === 0 ? 'N/A' : (total / count).toFixed(1);
    };

    const handleGradeChange = (studentId: string, assessmentId: string, field: 'score' | 'feedback', value: string) => {
        if (field === 'score' && value !== '') {
            const num = Number(value);
            if (isNaN(num) || num < 0 || num > 9) {
                showAlertModal('Warning', 'Score must be a decimal number between 0 and 9.', 'warning');
                return;
            }
        }
        setGradesData(prev => prev.map(student => {
            if (student.id === studentId) {
                return {
                    ...student,
                    grades: {
                        ...student.grades,
                        [assessmentId]: {
                            ...student.grades[assessmentId],
                            [field]: field === 'score' ? (value === '' ? null : Number(value)) : value
                        }
                    }
                };
            }
            return student;
        }));
    };

    const handleSaveGrades = async () => {
        if (!classId) return;

        // Validation for scores (0 -> 9, decimal)
        for (const student of gradesData) {
            for (const assId of Object.keys(student.grades)) {
                const score = student.grades[assId].score;
                if (score !== null && score !== undefined && (score as any) !== '') {
                    const numScore = Number(score);
                    if (isNaN(numScore) || numScore < 0 || numScore > 9) {
                        showAlertModal('Validation Error', `Score for student ${student.name} must be a decimal number between 0 and 9.`, 'error');
                        return;
                    }
                }
            }
        }

        setIsSaving(true);
        
        const upsertAssessments = assessments.map((a, index) => ({
            id: a.id,
            name: a.title,
            order_index: index
        }));

        const upsertGrades: { assessment_id: string, learner_id: string, score: number, feedback: string }[] = [];
        gradesData.forEach(student => {
            Object.keys(student.grades).forEach(assId => {
                const grade = student.grades[assId];
                if (grade.score !== null || (grade.feedback && grade.feedback.trim() !== '')) {
                    upsertGrades.push({
                        assessment_id: assId,
                        learner_id: student.id,
                        score: grade.score || 0,
                        feedback: grade.feedback || ''
                    });
                }
            });
        });

        try {
            await GradebookService.saveGrades(classId, {
                deletedAssessmentIds,
                upsertAssessments,
                upsertGrades
            });
            setIsSaving(false);
            setIsEditing(false);
            setDeletedAssessmentIds([]);
            showAlertModal('Grades Saved', 'All learner grades and feedback have been successfully saved.', 'success');
        } catch (_error) {
            setIsSaving(false);
            showAlertModal('Error', 'Failed to save grades.', 'error');
        }
    };

    const handlePublishGrades = async () => {
        if (!classId) return;
        
        const confirm = await showConfirmModal(
            'Publish Grades', 
            'Are you sure you want to publish these grades? Once published, learners will be able to view their Academic Transcript. This action cannot be easily undone.', 
            'warning', 
            'Publish', 
            'Cancel'
        );
        if (!confirm) return;

        setIsPublishing(true);
        try {
            // Wait for any pending saves first if we are in editing mode
            if (isEditing) {
                await handleSaveGrades();
            }
            
            await GradebookService.publishGrades(classId);
            setGradingStatus('PUBLISHED');
            setIsPublishing(false);
            showAlertModal('Grades Published', 'Grades have been published successfully. Learners can now view their transcripts.', 'success');
        } catch (_error) {
            setIsPublishing(false);
            showAlertModal('Error', 'Failed to publish grades.', 'error');
        }
    };

    const handleConfirmAddColumn = () => {
        if (!newAssTitle.trim()) {
            showAlertModal('Missing Information', 'Please enter a name for the new assessment column before adding.', 'warning');
            return;
        }
        
        const newId = window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : `a${Date.now()}`;
        const newAss = {
            id: newId,
            title: newAssTitle.trim(),
            maxScore: defaultScale
        };
        setAssessments(prev => [...prev, newAss]);
        setShowAddModal(false);
        setNewAssTitle('');
    };

    const handleDeleteColumn = async (id: string) => {
        const confirm = await showConfirmModal('Delete Assessment', 'Are you sure you want to delete this assessment column?', 'error', 'Delete', 'Cancel');
        if (!confirm) return;
        
        setDeletedAssessmentIds(prev => [...prev, id]);
        setAssessments(prev => prev.filter(a => a.id !== id));
        setGradesData(prev => prev.map(student => {
            const newGrades = { ...student.grades };
            delete newGrades[id];
            return {
                ...student,
                grades: newGrades
            };
        }));
        if (selectedCell?.assId === id) setSelectedCell(null);
    };

    const filteredStudents = gradesData.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const activeStudent = selectedCell ? gradesData.find(s => s.id === selectedCell.studentId) : null;
    const activeAss = selectedCell ? assessments.find(a => a.id === selectedCell.assId) : null;
    const activeGrade = activeStudent && activeAss ? (activeStudent.grades[activeAss.id] || { score: null, feedback: '' }) : null;

    return (
        <div className="space-y-8 pb-12 relative w-full min-w-0">
            <div className="w-full min-w-0">
                {classId && (
                    <>
                        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 mb-8">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-extrabold text-[#002045] tracking-tight">Gradebook</h2>
                                <p className="text-[#43474e] text-sm">Manage learner grades and provide feedback.</p>
                            </div>
                            
                            <div className="flex gap-3 w-full xl:w-auto">
                                <div className="flex-1 xl:flex-none bg-white py-2 px-4 rounded-xl shadow-sm border border-[#e2e2e9] flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#f8f9fc] flex items-center justify-center">
                                        <Users size={18} className="text-[#0061a5]" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#74777f] uppercase tracking-wider">Learners</p>
                                        <p className="text-lg font-bold text-[#002045] leading-none mt-0.5">{gradesData.length}</p>
                                    </div>
                                </div>
                                <div className="flex-1 xl:flex-none bg-white py-2 px-4 rounded-xl shadow-sm border border-[#e2e2e9] flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#f8f9fc] flex items-center justify-center">
                                        <BarChart3 size={18} className="text-[#0061a5]" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#74777f] uppercase tracking-wider">Class Avg</p>
                                        <p className="text-lg font-bold text-[#002045] leading-none mt-0.5">{classAverage()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center z-20 sticky top-0 bg-[#f8f9fc] py-2 mb-4">
                            <div className="relative w-full lg:w-80">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#74777f]" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Search learners by name or ID..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-[#e2e2e9] rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#0061a5]/30 focus:border-[#0061a5] transition-all"
                                />
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-3">
                                {isEditing && (
                                    <>


                                        <button 
                                            onClick={() => {
                                                setNewAssTitle('');
                                                setShowAddModal(true);
                                            }}
                                            className="px-4 py-2 text-[#0061a5] font-semibold bg-white border border-[#e2e2e9] shadow-sm rounded-xl hover:bg-[#f0f4f8] transition-colors flex items-center gap-2 text-sm"
                                        >
                                            <Plus size={16} />
                                            Add Column
                                        </button>
                                    </>
                                )}
                                
                                <button 
                                    onClick={handlePublishGrades}
                                    disabled={isPublishing || isSaving}
                                    className={`px-4 py-2 font-semibold bg-white border shadow-sm rounded-xl transition-colors flex items-center gap-2 text-sm ${
                                        isPublishing || isSaving
                                            ? 'border-[#e2e2e9] text-[#74777f] cursor-not-allowed'
                                            : 'border-[#059669] text-[#059669] hover:bg-[#ecfdf5]'
                                    }`}
                                >
                                    {isPublishing ? 'Publishing...' : (gradingStatus === 'PUBLISHED' ? 'Update Published' : 'Publish Grades')}
                                </button>
                                
                                {isEditing ? (
                                    <button 
                                        onClick={handleSaveGrades}
                                        disabled={isSaving}
                                        className={`px-5 py-2 font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 text-sm ${
                                            isSaving 
                                                ? 'bg-[#e2e2e9] text-[#74777f] cursor-not-allowed' 
                                                : 'bg-[#0061a5] text-white hover:bg-[#004a80]'
                                        }`}
                                    >
                                        <Save size={16} />
                                        {isSaving ? 'Saving...' : 'Save Grades'}
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="px-5 py-2 text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 bg-[#0061a5] text-white hover:bg-[#004a80]"
                                    >
                                        <Settings2 size={16} />
                                        Edit Grades
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-[#e2e2e9] overflow-hidden mb-12">
                            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#c4c6cf] scrollbar-track-[#f8f9fc]">
                                <table className="w-full text-left border-collapse min-w-max">
                                    <thead>
                                        <tr className="bg-[#f8f9fc] border-b-2 border-[#e2e2e9]">
                                            <th className="py-3 px-5 font-bold text-[#43474e] min-w-70 w-auto sticky left-0 bg-[#f8f9fc] z-20 text-xs uppercase tracking-wider">
                                                Learner Information
                                            </th>
                                            {assessments.map(ass => (
                                                <th key={ass.id} className="py-3 px-3 text-center relative group w-32.5 min-w-32.5 max-w-32.5 bg-[#f8f9fc] border-l border-[#e2e2e9]">
                                                    <div className="flex flex-col gap-0.5 items-center relative">
                                                        <span className="text-xs font-bold text-[#43474e] leading-tight text-center uppercase tracking-wider">{ass.title}</span>
                                                        {isEditing && (
                                                            <button 
                                                                onClick={() => handleDeleteColumn(ass.id)}
                                                                className="absolute -right-2.5 -top-2.5 opacity-0 group-hover:opacity-100 p-1.5 text-[#ba1a1a] bg-white shadow-sm border border-[#e2e2e9] hover:bg-[#ffdad6] rounded-full transition-all shrink-0 z-30"
                                                                title="Delete Column"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </th>
                                            ))}
                                            <th className="py-3 px-5 font-bold text-[#43474e] text-center w-30 min-w-30 border-l border-[#e2e2e9] bg-[#f8f9fc] sticky right-0 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] z-20 text-xs uppercase tracking-wider">
                                                {defaultScale === 9 ? 'Overall' : 'Average'}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredStudents.length > 0 ? (
                                            filteredStudents.map(student => (
                                                <tr key={student.id} className={`border-b border-[#e2e2e9] hover:bg-[#fcfdfd] transition-colors bg-white group/row`}>
                                                    <td className="py-3 px-5 sticky left-0 bg-inherit z-10">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full bg-[#f8f9fc] text-[#0061a5] flex items-center justify-center font-bold text-xs shrink-0 border border-[#e2e2e9]">
                                                                {student.name.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-[#181c1e] text-sm">{student.name}</div>
                                                                <div className="text-xs text-[#74777f]">{student.code}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    
                                                    {assessments.map(ass => {
                                                        const grade = student.grades[ass.id] || { score: null, feedback: '' };
                                                        const hasFeedback = grade.feedback && grade.feedback.trim() !== '';
                                                        const isSelected = selectedCell?.studentId === student.id && selectedCell?.assId === ass.id;

                                                        return (
                                                        <td key={ass.id} className={`py-2 px-2 border-l border-[#e2e2e9] align-middle w-32.5 min-w-32.5 max-w-32.5 bg-inherit ${isSelected ? 'bg-[#f0f4f8]' : ''}`}>
                                                            <div className="flex items-center justify-center gap-2 relative w-full px-2">
                                                                {isEditing ? (
                                                                    <input 
                                                                        type="number" 
                                                                        min="0" max="9" step="0.5"
                                                                        placeholder="-"
                                                                        value={grade.score ?? ''}
                                                                        onChange={(e) => handleGradeChange(student.id, ass.id, 'score', e.target.value)}
                                                                        className={`w-14 py-1.5 bg-white border rounded-lg text-center focus:outline-none font-semibold text-sm transition-colors shadow-sm
                                                                            ${isSelected ? 'border-[#0061a5] text-[#0061a5] ring-2 ring-[#0061a5]/20' : 'border-[#c4c6cf] hover:border-[#74777f] text-[#181c1e]'}
                                                                        `}
                                                                    />
                                                                ) : (
                                                                    <div className="w-14 py-1.5 text-center font-semibold text-sm text-[#181c1e]">
                                                                        {grade.score ?? '-'}
                                                                    </div>
                                                                )}
                                                                <div className="w-7 shrink-0 flex items-center justify-center">
                                                                    {(isEditing || hasFeedback) && (
                                                                        <button
                                                                            onClick={() => setSelectedCell({ studentId: student.id, assId: ass.id })}
                                                                            className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${
                                                                                isSelected 
                                                                                    ? 'bg-[#e3f2fd] text-[#0061a5]' 
                                                                                    : 'hover:bg-[#f1f4f6] text-[#c4c6cf] hover:text-[#0061a5]'
                                                                            }`}
                                                                            title={hasFeedback ? "View feedback" : "Add feedback"}
                                                                        >
                                                                            <MessageCircle 
                                                                                size={16} 
                                                                                className={hasFeedback && !isSelected ? "text-[#0061a5] fill-[#e3f2fd]" : ""} 
                                                                            />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        );
                                                    })}

                                                    <td className="py-2 px-5 text-center border-l border-[#e2e2e9] bg-inherit sticky right-0 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] z-10">
                                                        <span className={`inline-flex items-center justify-center text-xs font-bold ${
                                                            calculateAverage(student.grades) === '-' 
                                                                ? 'text-[#74777f]' 
                                                                : Number(calculateAverage(student.grades)) >= defaultScale * 0.8
                                                                    ? 'text-[#059669]'
                                                                    : Number(calculateAverage(student.grades)) >= defaultScale * 0.65
                                                                        ? 'text-[#0284c7]'
                                                                        : Number(calculateAverage(student.grades)) >= defaultScale * 0.5
                                                                            ? 'text-[#d97706]'
                                                                            : 'text-[#e11d48]'
                                                        }`}>
                                                            {calculateAverage(student.grades)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={assessments.length + 2} className="p-12 text-center">
                                                    <div className="inline-flex flex-col items-center justify-center text-[#74777f]">
                                                        <Search size={48} className="mb-4 text-[#c4c6cf]" />
                                                        <p className="text-lg font-bold text-[#002045]">No learners found</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Feedback Popup Modal */}
            {selectedCell && activeStudent && activeAss && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#002045]/40 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedCell(null)}>
                    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 m-4 flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-extrabold text-[#002045] text-xl flex items-center gap-2">
                                <MessageSquareText size={20} className="text-[#0061a5]" />
                                Tutor Note
                            </h3>
                            <button onClick={() => setSelectedCell(null)} className="p-1.5 text-[#74777f] hover:bg-[#f1f4f6] rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="bg-[#f8f9fc] border border-[#e2e2e9] rounded-xl p-4 space-y-3">
                                <div className="flex justify-between items-center border-b border-[#e2e2e9] pb-3">
                                    <span className="text-xs font-semibold text-[#74777f]">Learner</span>
                                    <span className="font-bold text-[#002045]">{activeStudent.name}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-semibold text-[#74777f]">Assessment</span>
                                    <span className="font-bold text-[#002045]">{activeAss.title}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[#43474e] mb-2">Note / Feedback</label>
                                <textarea 
                                    placeholder={isEditing ? "Write your feedback here..." : "No feedback provided."}
                                    value={activeGrade?.feedback ?? ''}
                                    readOnly={!isEditing}
                                    onChange={(e) => handleGradeChange(activeStudent.id, activeAss.id, 'feedback', e.target.value)}
                                    rows={5}
                                    className="w-full px-4 py-3 bg-[#fdfdfd] border border-[#e2e2e9] rounded-xl text-sm text-[#181c1e] placeholder-[#c4c6cf] focus:outline-none focus:ring-2 focus:ring-[#0061a5]/30 focus:border-[#0061a5] resize-none transition-all shadow-inner"
                                    autoFocus
                                />
                                {isEditing && <p className="text-xs text-[#74777f] mt-2 italic">Saved automatically when you save changes.</p>}
                            </div>
                            
                            <div className="pt-2 flex justify-end">
                                <button 
                                    onClick={() => setSelectedCell(null)}
                                    className="px-6 py-2.5 bg-[#0061a5] text-white font-bold rounded-xl hover:bg-[#004a80] shadow-md transition-all"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#002045]/40 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-extrabold text-[#002045] flex items-center gap-3">
                                <Settings2 className="text-[#0061a5]" />
                                New Assessment
                            </h3>
                            <button onClick={() => setShowAddModal(false)} className="p-2 text-[#74777f] hover:bg-[#f1f4f6] rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-[#43474e] mb-2">Assessment Name</label>
                                <input 
                                    type="text" 
                                    value={newAssTitle}
                                    onChange={(e) => setNewAssTitle(e.target.value)}
                                    placeholder="e.g. Mid-term Exam"
                                    className="w-full px-4 py-3 bg-[#f8f9fc] border border-[#e2e2e9] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0061a5]/30 focus:border-[#0061a5] transition-all text-[#181c1e]"
                                    autoFocus
                                />
                            </div>
                            
                            <div className="pt-4 flex justify-end gap-3">
                                <button 
                                    onClick={() => setShowAddModal(false)}
                                    className="px-5 py-2.5 text-[#43474e] font-bold hover:bg-[#f1f4f6] rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleConfirmAddColumn}
                                    className="px-6 py-2.5 bg-[#0061a5] text-white font-bold rounded-xl hover:bg-[#004a80] shadow-md hover:shadow-lg transition-all"
                                >
                                    Add Assessment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TutorGradebook;
