import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../../../store/useStore';
import { GlassCard } from '../../ui/GlassCard';
import { GradientButton } from '../../ui/GradientButton';
import { Briefcase, AlertTriangle, CheckCircle, Cpu, UploadCloud, ExternalLink, Eye, AlertOctagon, Zap } from 'lucide-react';

const ResumeAudit = () => {
    const { resumeData, setResumeData } = useStore();
    const [file, setFile] = useState(null);
    const [manualText, setManualText] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [uploadMode, setUploadMode] = useState("file"); // "file" or "text"

    // Check if resume data exists in store on component mount
    useEffect(() => {
        if (resumeData) {
            if (resumeData.type === 'text') {
                setManualText(resumeData.text);
                setUploadMode('text');
            }
        }
    }, [resumeData]);

    const handleAnalyze = async () => {
        if (uploadMode === "file") {
            if (!file) {
                setError("Please select a file first");
                return;
            }
            
            const formData = new FormData();
            formData.append('resume', file);
            setLoading(true);
            setError("");
            
            try {
                console.log("Uploading file:", file.name, "Size:", file.size);
                // Use relative URL to go through Vite proxy
                const { data } = await axios.post('/api/resume/audit', formData);
                console.log("Response:", data);
                setResult(data.data);
                
                // Save extracted text to store for reuse in Career Audit
                setResumeData({ type: 'text', text: data.extractedText });
            } catch (err) {
                console.error("Upload error:", err.response?.data || err.message);
                const errorMessage = err.response?.data?.error || err.message || "Failed to analyze resume. Please try again.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        } else {
            if (!manualText.trim()) {
                setError("Please paste your resume text");
                return;
            }
            
            if (manualText.trim().length < 50) {
                setError("Resume text is too short. Please provide at least 50 characters.");
                return;
            }
            
            setLoading(true);
            setError("");
            
            try {
                console.log("Analyzing resume text:", manualText.substring(0, 50) + "...");
                const { data } = await axios.post('/api/resume/audit-text', {
                    resumeText: manualText
                });
                console.log("Response:", data);
                setResult(data.data);
                
                // Save text to store for reuse in Career Audit
                setResumeData({ type: 'text', text: manualText });
            } catch (err) {
                console.error("Analysis error:", err.response?.data || err.message);
                const errorMessage = err.response?.data?.error || err.message || "Failed to analyze resume. Please try again.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleReset = () => {
        setFile(null);
        setResult(null);
        setError("");
    };

    const getAIScoreColor = (score) => {
        if (score > 70) return { bg: 'bg-red-900/10', border: 'border-red-500/20', text: 'text-red-400', label: '🤖 Very Robotic' };
        if (score > 50) return { bg: 'bg-yellow-900/10', border: 'border-yellow-500/20', text: 'text-yellow-400', label: '⚠️ Somewhat Robotic' };
        return { bg: 'bg-emerald-900/10', border: 'border-emerald-500/20', text: 'text-emerald-400', label: '✨ Human-Like' };
    };

    const getATSScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const aiScoreStyle = getAIScoreColor(result?.aiSpeakScore || 0);

    return (
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fade-in-up px-4">
            
            {/* Input Section */}
            {!result && (
                <div className="space-y-6 sm:space-y-8">
                    <div className="text-center space-y-3 sm:space-y-4">
                        <GlassCard className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-indigo-500/30 bg-indigo-500/10">
                            <Briefcase size={14} className="text-indigo-400 sm:w-4 sm:h-4" />
                            <span className="text-[10px] sm:text-xs font-bold text-indigo-300 uppercase tracking-widest">Career Strategist</span>
                        </GlassCard>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight px-4">
                            Get Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">Professional Mirror</span>
                        </h2>
                        <p className="text-sm sm:text-lg text-gray-400 max-w-2xl mx-auto px-4">
                            AI-powered analysis: Who recruiters see, where you rank, and what to fix.
                        </p>
                    </div>

                    {/* Toggle between Upload and Text */}
                    <div className="max-w-2xl mx-auto flex gap-2 border-b border-white/10">
                        <button
                            onClick={() => setUploadMode("file")}
                            className={`px-4 py-2 font-bold transition-colors ${uploadMode === "file" ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
                        >
                            📄 Upload PDF
                        </button>
                        <button
                            onClick={() => setUploadMode("text")}
                            className={`px-4 py-2 font-bold transition-colors ${uploadMode === "text" ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
                        >
                            ✏️ Paste Text
                        </button>
                    </div>

                    {/* File Upload Section */}
                    {uploadMode === "file" && (
                    <GlassCard className="max-w-2xl mx-auto group relative cursor-pointer hover:bg-white/15 transition-all border-dashed border-2 border-white/20 p-6 sm:p-8">
                        <input 
                            type="file" 
                            accept=".pdf,.docx,.doc"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                        <div className="flex flex-col items-center justify-center py-6 sm:py-8">
                            <div className={`p-3 sm:p-4 rounded-full mb-3 sm:mb-4 transition-colors ${file ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-indigo-300'}`}>
                                {file ? <CheckCircle size={28} className="sm:w-8 sm:h-8" /> : <UploadCloud size={28} className="sm:w-8 sm:h-8" />}
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-white text-center px-4">
                                {file ? file.name : "Drag & Drop Your Resume (PDF/DOCX)"}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-400 mt-2">Max Size: 5MB</p>
                        </div>
                    </GlassCard>
                    )}

                    {/* Text Paste Section */}
                    {uploadMode === "text" && (
                    <GlassCard className="max-w-2xl mx-auto p-4 sm:p-6 border-white/10">
                        <textarea
                            value={manualText}
                            onChange={(e) => setManualText(e.target.value)}
                            placeholder="Paste your resume text here..."
                            className="w-full h-64 sm:h-80 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none text-sm leading-relaxed"
                        />
                        <p className="text-xs text-gray-400 mt-2">Minimum 50 characters required</p>
                    </GlassCard>
                    )}

                    <div className="max-w-2xl mx-auto">
                        <GradientButton 
                            onClick={handleAnalyze} 
                            loading={loading} 
                            disabled={uploadMode === "file" ? !file : !manualText.trim()} 
                            className="w-full text-sm sm:text-base py-3"
                        >
                            {loading ? "Analyzing Your Profile..." : "Analyze My Profile"}
                        </GradientButton>
                    </div>

                    {error && (
                        <div className="max-w-2xl mx-auto">
                            <p className="text-red-400 text-sm text-center bg-red-900/20 py-3 px-4 rounded-lg border border-red-500/30 flex items-center justify-between gap-2">
                                <span className="flex items-center gap-2"><AlertTriangle size={16} /> {error}</span>
                                <button onClick={() => setError('')} className="text-red-200 hover:text-white">✕</button>
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Dashboard Result */}
            {result && (
                <div className="space-y-4 sm:space-y-6">
                    
                    {/* Reset Button */}
                    <div className="flex justify-end">
                        <button onClick={handleReset} className="text-sm text-gray-400 hover:text-white transition-colors">
                            ← New Analysis
                        </button>
                    </div>

                    {/* FEATURE A: The Mirror - AI Profile Summary */}
                    <GlassCard delay={0.1} className="bg-gradient-to-br from-indigo-900/20 via-slate-900 to-slate-900 border-indigo-500/30 p-4 sm:p-6">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 rounded-full bg-indigo-500/20 text-indigo-400 flex-shrink-0">
                                <Eye size={20} className="sm:w-6 sm:h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Who Recruiters See</h3>
                                <p className="text-sm sm:text-base text-gray-300 italic leading-relaxed">"{result.profileSummary}"</p>
                                <div className="mt-3 space-y-2">
                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                                        <span className="px-2 py-1 bg-indigo-500/20 rounded text-indigo-300 font-semibold">{result.detectedRole}</span>
                                        <span className="text-gray-500">•</span>
                                        <span className="text-gray-400">{result.experienceLevel}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Dual Scoring Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {/* ATS Score */}
                        <GlassCard delay={0.15} className="bg-gradient-to-br from-blue-900/20 to-slate-900 border-blue-500/30 p-4 sm:p-5">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs sm:text-sm font-bold text-blue-300 uppercase tracking-wider">ATS Score</span>
                                    <span className={`text-2xl sm:text-3xl font-black ${getATSScoreColor(result.atsScore)}`}>{result.atsScore}</span>
                                </div>
                                <div className="w-full bg-gray-700/30 rounded-full h-1.5 sm:h-2">
                                    <div 
                                        className={`h-full rounded-full ${result.atsScore >= 80 ? 'bg-emerald-500' : result.atsScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                        style={{ width: `${result.atsScore}%` }}
                                    />
                                </div>
                                <p className="text-[10px] sm:text-xs text-gray-400">{result.atsScore >= 80 ? '✅ Excellent parsing' : result.atsScore >= 60 ? '⚠️ Good formatting' : '❌ Needs formatting'}</p>
                            </div>
                        </GlassCard>

                        {/* AI Robotic Detection */}
                        <GlassCard delay={0.2} className={`bg-gradient-to-br ${aiScoreStyle.bg} border ${aiScoreStyle.border} p-4 sm:p-5`}>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs sm:text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1">
                                        <Cpu size={14} /> AI Detection
                                    </span>
                                    <span className={`text-2xl sm:text-3xl font-black ${aiScoreStyle.text}`}>{result.aiSpeakScore}%</span>
                                </div>
                                <div className="w-full bg-gray-700/30 rounded-full h-1.5 sm:h-2">
                                    <div 
                                        className={`h-full rounded-full ${result.aiSpeakScore > 70 ? 'bg-red-500' : result.aiSpeakScore > 50 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                                        style={{ width: `${result.aiSpeakScore}%` }}
                                    />
                                </div>
                                <p className={`text-[10px] sm:text-xs ${aiScoreStyle.text}`}>{aiScoreStyle.label}</p>
                            </div>
                        </GlassCard>
                    </div>

                    {/* FEATURE C: AI Detection Warning */}
                    {result.aiSpeakScore > 50 && result.aiDetectionWarning && (
                        <GlassCard delay={0.25} className="bg-gradient-to-br from-orange-900/20 to-slate-900 border-orange-500/30 p-4 sm:p-5">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="p-2.5 sm:p-3 rounded-full bg-orange-500/20 text-orange-400 flex-shrink-0 mt-0.5">
                                    <AlertOctagon size={18} className="sm:w-5 sm:h-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-orange-300 text-sm sm:text-base mb-1">⚡ ChatGPT Detection Alert</h4>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{result.aiDetectionWarning}</p>
                                </div>
                            </div>
                        </GlassCard>
                    )}

                    {/* FEATURE D: Recruiter's 6-Second Glance */}
                    {result.sectionAnalysis && (
                        <GlassCard delay={0.3} className="bg-gradient-to-br from-purple-900/20 to-slate-900 border-purple-500/30 p-4 sm:p-5">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="p-2.5 sm:p-3 rounded-full bg-purple-500/20 text-purple-400 flex-shrink-0">
                                    <Zap size={18} className="sm:w-5 sm:h-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-purple-300 text-sm sm:text-base mb-2">🎯 First 6 Seconds (Recruiter Focus)</h4>
                                    <div className="space-y-2">
                                        <p className="text-xs sm:text-sm text-gray-300"><span className="font-semibold text-purple-300">Most Viewed:</span> {result.sectionAnalysis.mostViewed}</p>
                                        <p className="text-xs sm:text-sm text-gray-400 italic">{result.sectionAnalysis.insight}</p>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    )}

                    {/* FEATURE B: Smart Role Recommendations */}
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                            <Briefcase size={20} className="text-indigo-400" />
                            Recommended Roles & Openings
                        </h3>
                        <div className="grid gap-3 sm:gap-4">
                            {result.recommendedJobs?.map((job, idx) => (
                                <GlassCard key={idx} delay={0.35 + idx * 0.05} className="bg-white/5 border-white/5 hover:border-blue-500/30 transition-colors p-4 sm:p-5">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className="text-base sm:text-lg font-bold text-white leading-tight">{job.role}</h4>
                                                <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                                                    job.matchConfidence >= 85 ? 'bg-emerald-500/20 text-emerald-300' : 
                                                    job.matchConfidence >= 70 ? 'bg-yellow-500/20 text-yellow-300' : 
                                                    'bg-red-500/20 text-red-300'
                                                }`}>
                                                    {job.matchConfidence}% Match
                                                </span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{job.reason}</p>
                                            <div className="flex items-center gap-4 pt-2">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Expected Salary</p>
                                                    <p className="text-sm sm:text-base font-bold text-emerald-400">{job.avgSalary}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Platform Buttons */}
                                        <div className="flex flex-wrap gap-2">
                                            {job.applyOn?.includes('LinkedIn') && (
                                                <a href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.role)}`} target="_blank" rel="noopener noreferrer" 
                                                   className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#0077b5]/10 text-[#0077b5] border border-[#0077b5]/20 hover:bg-[#0077b5]/20 rounded-lg text-[10px] sm:text-xs font-bold transition-all">
                                                    <ExternalLink size={12} /> LinkedIn
                                                </a>
                                            )}
                                            {job.applyOn?.includes('Naukri') && (
                                                <a href={`https://www.naukri.com/${encodeURIComponent(job.role.toLowerCase().replace(/ /g, '-'))}-jobs`} target="_blank" rel="noopener noreferrer" 
                                                   className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#4a90e2]/10 text-[#4a90e2] border border-[#4a90e2]/20 hover:bg-[#4a90e2]/20 rounded-lg text-[10px] sm:text-xs font-bold transition-all">
                                                    <ExternalLink size={12} /> Naukri
                                                </a>
                                            )}
                                            {job.applyOn?.includes('Indeed') && (
                                                <a href={`https://in.indeed.com/jobs?q=${encodeURIComponent(job.role)}`} target="_blank" rel="noopener noreferrer" 
                                                   className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#2164f3]/10 text-[#2164f3] border border-[#2164f3]/20 hover:bg-[#2164f3]/20 rounded-lg text-[10px] sm:text-xs font-bold transition-all">
                                                    <ExternalLink size={12} /> Indeed
                                                </a>
                                            )}
                                            {job.applyOn?.includes('AngelList') && (
                                                <a href={`https://wellfound.com/jobs?query=${encodeURIComponent(job.role)}`} target="_blank" rel="noopener noreferrer" 
                                                   className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#000000]/10 text-white border border-white/20 hover:bg-[#000000]/20 rounded-lg text-[10px] sm:text-xs font-bold transition-all">
                                                    <ExternalLink size={12} /> AngelList
                                                </a>
                                            )}
                                            {job.applyOn?.includes('Instahyre') && (
                                                <a href={`https://www.instahyre.com/search-jobs/?q=${encodeURIComponent(job.role)}`} target="_blank" rel="noopener noreferrer" 
                                                   className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#28a745]/10 text-[#28a745] border border-[#28a745]/20 hover:bg-[#28a745]/20 rounded-lg text-[10px] sm:text-xs font-bold transition-all">
                                                    <ExternalLink size={12} /> Instahyre
                                                </a>
                                            )}
                                            {job.applyOn?.includes('Glassdoor') && (
                                                <a href={`https://www.glassdoor.co.in/Job/jobs.htm?sc.keyword=${encodeURIComponent(job.role)}`} target="_blank" rel="noopener noreferrer" 
                                                   className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#0caa41]/10 text-[#0caa41] border border-[#0caa41]/20 hover:bg-[#0caa41]/20 rounded-lg text-[10px] sm:text-xs font-bold transition-all">
                                                    <ExternalLink size={12} /> Glassdoor
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    </div>

                    {/* Skills Detection */}
                    {result.detectedSkills && (
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                                <Zap size={20} className="text-yellow-400" />
                                Your Detected Skills
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                {/* Technical Skills */}
                                <GlassCard delay={0.5} className="bg-gradient-to-br from-blue-900/20 to-slate-900 border-blue-500/30 p-4 sm:p-5">
                                    <h4 className="text-sm font-bold text-blue-300 uppercase tracking-wider mb-3">Technical Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {result.detectedSkills.technical?.map((skill, idx) => (
                                            <span key={idx} className="text-xs px-2.5 py-1.5 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </GlassCard>

                                {/* Soft Skills */}
                                <GlassCard delay={0.55} className="bg-gradient-to-br from-cyan-900/20 to-slate-900 border-cyan-500/30 p-4 sm:p-5">
                                    <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider mb-3">Soft Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {result.detectedSkills.soft?.map((skill, idx) => (
                                            <span key={idx} className="text-xs px-2.5 py-1.5 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </GlassCard>
                            </div>
                        </div>
                    )}

                    {/* Improvements Section */}
                    {result.improvements && result.improvements.length > 0 && (
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                                <AlertTriangle size={20} className="text-yellow-400" />
                                Quick Wins to Boost Your Profile
                            </h3>
                            <div className="space-y-2 sm:space-y-3">
                                {result.improvements.map((improvement, idx) => (
                                    <GlassCard key={idx} delay={0.6 + idx * 0.03} className="bg-gradient-to-br from-yellow-900/10 to-slate-900 border-yellow-500/20 p-3 sm:p-4 flex items-start gap-3">
                                        <div className="p-1.5 rounded-full bg-yellow-500/20 text-yellow-400 flex-shrink-0 mt-0.5">
                                            <Zap size={14} className="sm:w-4 sm:h-4" />
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{improvement}</p>
                                    </GlassCard>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResumeAudit;
