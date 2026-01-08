import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../../../store/useStore';
import { GlassCard } from '../../ui/GlassCard';
import { GradientButton } from '../../ui/GradientButton';
import { Target, CheckCircle, XCircle, Sparkles, AlertTriangle, Copy, Check, UploadCloud } from 'lucide-react';

const ResumeTailor = () => {
    const { resumeData, setResumeData } = useStore();
    const [jd, setJd] = useState("");
    const [resumeText, setResumeText] = useState(""); 
    const [file, setFile] = useState(null);
    const [uploadMode, setUploadMode] = useState("text"); // "text" or "file"
    const [tailorResult, setTailorResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [copiedIndex, setCopiedIndex] = useState(null);

    // Check if resume data exists in store on component mount
    useEffect(() => {
        if (resumeData) {
            if (resumeData.type === 'text') {
                setResumeText(resumeData.text);
                setUploadMode('text');
                setNotice('We saved your last pasted resume. You can reuse or edit it.');
            } else if (resumeData.type === 'file') {
                setUploadMode('file');
                setNotice(`Saved resume metadata: ${resumeData.fileName}. Re-upload or paste text to proceed.`);
            }
        }
    }, [resumeData]);

    const handleTailor = async () => {
        if (!jd.trim()) {
            setError("Please provide a job description");
            return;
        }

        let resumeTextToUse = "";

        // If file mode, extract text from PDF first
        if (uploadMode === "file") {
            if (!file) {
                setError("Please upload a resume file");
                return;
            }

            setLoading(true);
            setError("");

            try {
                // First, extract text from PDF using the audit endpoint
                const formData = new FormData();
                formData.append('resume', file);
                
                const { data: auditData } = await axios.post('/api/resume/audit', formData);
                
                // Extract the text from the audit result
                if (auditData.extractedText) {
                    resumeTextToUse = auditData.extractedText;
                    
                    // Save to store
                    setResumeData({ type: 'text', text: auditData.extractedText });
                } else {
                    setError("Failed to extract text from PDF. Please try text mode.");
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.error("PDF extraction error:", err);
                setError("Failed to process PDF. Please use text mode or try a different file.");
                setLoading(false);
                return;
            }
        } else {
            if (!resumeText.trim()) {
                setError("Please provide resume text");
                return;
            }
            resumeTextToUse = resumeText;
            
            setLoading(true);
            setError("");
            
            // Save text to store
            setResumeData({ type: 'text', text: resumeText });
        }

        try {
            const { data } = await axios.post('/api/resume/tailor', {
                jobDescription: jd,
                existingResumeText: resumeTextToUse
            });
            setTailorResult(data.data);
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.error || err.message || "Tailoring failed. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return "text-emerald-400";
        if (score >= 60) return "text-yellow-400";
        return "text-red-400";
    };

    const getVerdictColor = (verdict) => {
        if (verdict.includes("Low")) return "text-emerald-400";
        if (verdict.includes("Medium")) return "text-yellow-400";
        return "text-red-400";
    };

    const handleCopyBullet = (improvedBullet, index) => {
        navigator.clipboard.writeText(improvedBullet);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 animate-fade-in-up px-1 sm:px-0">
            
            {/* Left: Inputs */}
            <div className="space-y-4 sm:space-y-6">
                <div className="text-center lg:text-left space-y-3">
                    <GlassCard className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-purple-500/30 bg-purple-500/10">
                        <Target size={14} className="text-purple-400 sm:w-4 sm:h-4" />
                        <span className="text-[10px] sm:text-xs font-bold text-purple-300 uppercase tracking-widest">Job Assassin</span>
                    </GlassCard>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                        Target <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">This Job</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-400">
                        AI-powered keyword matching and bullet point optimization
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Toggle between File and Text */}
                    <div className="flex gap-2 border-b border-white/10">
                        <button
                            onClick={() => setUploadMode("file")}
                            className={`px-4 py-2 font-bold transition-colors text-sm ${uploadMode === "file" ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
                        >
                            📄 Upload PDF
                        </button>
                        <button
                            onClick={() => setUploadMode("text")}
                            className={`px-4 py-2 font-bold transition-colors text-sm ${uploadMode === "text" ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
                        >
                            ✏️ Paste Text {resumeData?.type === 'text' && '(Saved)'}
                        </button>
                    </div>

                    {/* Resume Input: Text or File */}
                    {uploadMode === "file" ? (
                    <GlassCard className="group relative cursor-pointer hover:bg-white/15 transition-all border-dashed border-2 border-white/20 p-4 sm:p-6">
                        <input 
                            type="file" 
                            accept=".pdf,.docx,.doc"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                        <div className="flex flex-col items-center justify-center py-4 sm:py-6">
                            <div className={`p-2 sm:p-3 rounded-full mb-2 sm:mb-3 transition-colors ${file ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-purple-300'}`}>
                                {file ? <CheckCircle size={24} className="sm:w-7 sm:h-7" /> : <UploadCloud size={24} className="sm:w-7 sm:h-7" />}
                            </div>
                            <p className="text-sm sm:text-base font-bold text-white text-center">
                                {file ? file.name : "Drop your resume (PDF/DOCX)"}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">Max Size: 5MB</p>
                        </div>
                    </GlassCard>
                    ) : (
                    <div className="relative">
                        <div className="absolute top-2 sm:top-3 left-3 sm:left-4 text-[10px] sm:text-xs font-bold text-purple-300 uppercase tracking-wider bg-slate-900/80 px-2 rounded z-10">
                            Your Resume Text
                        </div>
                        <textarea 
                            className="w-full h-40 sm:h-48 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6 pt-7 sm:pt-8 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none text-xs sm:text-sm leading-relaxed"
                            placeholder="Paste your resume text here..."
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                        />
                    </div>
                    )}

                    <div className="relative">
                        <div className="absolute top-2 sm:top-3 left-3 sm:left-4 text-[10px] sm:text-xs font-bold text-indigo-300 uppercase tracking-wider bg-slate-900/80 px-2 rounded z-10">
                            Target Job Description
                        </div>
                        <textarea 
                            className="w-full h-40 sm:h-48 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6 pt-7 sm:pt-8 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none text-xs sm:text-sm leading-relaxed"
                            placeholder="Paste the Job Description here..."
                            value={jd}
                            onChange={(e) => setJd(e.target.value)}
                        />
                    </div>

                    <GradientButton 
                        onClick={handleTailor}
                        loading={loading}
                        disabled={!jd.trim() || (uploadMode === "text" ? !resumeText.trim() : !file)}
                        className="w-full text-sm sm:text-base py-3"
                    >
                        {loading ? "Analyzing Match..." : "🎯 Target This Job"}
                    </GradientButton>

                    {error && (
                        <p className="text-red-400 text-xs sm:text-sm text-center bg-red-900/20 py-2 px-4 rounded-lg border border-red-500/30 flex items-center justify-between gap-2">
                            <span className="flex items-center gap-2"><AlertTriangle size={14} /> {error}</span>
                            <button onClick={() => setError("")} className="text-red-200 hover:text-white">✕</button>
                        </p>
                    )}

                    {notice && (
                        <p className="text-amber-200 text-xs sm:text-sm text-center bg-amber-900/20 py-2 px-4 rounded-lg border border-amber-500/30 flex items-center justify-between gap-2">
                            <span className="flex items-center gap-2"><AlertTriangle size={14} className="text-amber-300" /> {notice}</span>
                            <button onClick={() => setNotice("")} className="text-amber-200 hover:text-white">✕</button>
                        </p>
                    )}
                </div>
            </div>

            {/* Right: Analysis */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6 max-h-none lg:max-h-[720px] lg:overflow-y-auto">
                {!tailorResult ? (
                    <div className="text-gray-400 text-center mt-20 space-y-3">
                        <Target size={48} className="mx-auto opacity-30 sm:w-16 sm:h-16" />
                        <p className="text-sm sm:text-base">Results will appear here...</p>
                    </div>
                ) : (
                    <div className="space-y-4 sm:space-y-6">
                        
                        {/* Score Card */}
                        <GlassCard delay={0.1} className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 p-4 sm:p-5">
                            <div className="text-center sm:text-left">
                                <h3 className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Match Score</h3>
                                <p className={`text-4xl sm:text-5xl font-black ${getScoreColor(tailorResult.matchScore)}`}>
                                    {tailorResult.matchScore}%
                                </p>
                            </div>
                            <div className="text-center sm:text-right">
                                <span className="block text-xs sm:text-sm text-gray-400 mb-1 uppercase tracking-wider">Hiring Verdict</span>
                                <span className={`text-lg sm:text-xl font-bold ${getVerdictColor(tailorResult.hiringVerdict)}`}>
                                    {tailorResult.hiringVerdict}
                                </span>
                            </div>
                        </GlassCard>

                        {/* Keyword Matrix */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <GlassCard delay={0.2} className="bg-emerald-900/10 border-emerald-500/20 p-3 sm:p-4">
                                <h4 className="font-bold text-emerald-400 text-xs sm:text-sm mb-3 flex items-center gap-2">
                                    <CheckCircle size={14} className="sm:w-4 sm:h-4" /> You Have
                                </h4>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {tailorResult.keywordGapMatrix.matched.map((skill, idx) => (
                                        <span key={idx} className="text-[10px] sm:text-xs bg-white/10 text-emerald-200 px-2 py-1 rounded shadow-sm border border-emerald-500/20">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </GlassCard>
                            
                            <GlassCard delay={0.3} className="bg-red-900/10 border-red-500/20 p-3 sm:p-4">
                                <h4 className="font-bold text-red-400 text-xs sm:text-sm mb-3 flex items-center gap-2">
                                    <XCircle size={14} className="sm:w-4 sm:h-4" /> You Need
                                </h4>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {tailorResult.keywordGapMatrix.missing.map((skill, idx) => (
                                        <span key={idx} className="text-[10px] sm:text-xs bg-white/10 text-red-200 px-2 py-1 rounded shadow-sm border border-red-500/20">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </GlassCard>
                        </div>

                        {/* Magic Fixes */}
                        <GlassCard delay={0.4} className="p-4 sm:p-5">
                            <h3 className="font-bold text-white mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                                <Sparkles size={16} className="text-purple-400 sm:w-5 sm:h-5" /> Magic Bullet Rewrites
                            </h3>
                            <div className="space-y-3 sm:space-y-4">
                                {tailorResult.bulletPointFixes.map((fix, i) => (
                                    <div key={i} className="bg-slate-800/40 p-3 sm:p-4 rounded-xl border-l-4 border-purple-500 shadow-sm">
                                        <p className="text-[10px] sm:text-xs text-gray-500 mb-2 line-through">
                                            Before: {fix.original}
                                        </p>
                                        <div className="flex items-start gap-2 sm:gap-3">
                                            <div className="flex-1">
                                                <p className="text-xs sm:text-sm font-semibold text-gray-200 leading-relaxed">
                                                    After: {fix.improved}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleCopyBullet(fix.improved, i)}
                                                className="flex-shrink-0 p-1.5 sm:p-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 rounded border border-purple-500/30 transition-all"
                                                title="Copy to clipboard"
                                            >
                                                {copiedIndex === i ? (
                                                    <Check size={14} className="sm:w-4 sm:h-4" />
                                                ) : (
                                                    <Copy size={14} className="sm:w-4 sm:h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>

                        {/* Similar Roles */}
                        {tailorResult.similarRolesSearchQuery && (
                            <GlassCard delay={0.5} className="bg-indigo-900/10 border-indigo-500/20 p-4 sm:p-5">
                                <h4 className="font-bold text-indigo-400 text-xs sm:text-sm mb-2">
                                    💡 Similar Roles to Explore
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-300">
                                    {tailorResult.similarRolesSearchQuery}
                                </p>
                            </GlassCard>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeTailor;
