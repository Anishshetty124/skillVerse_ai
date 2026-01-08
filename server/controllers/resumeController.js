import { GoogleGenerativeAI } from "@google/generative-ai";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

// Get all API keys for rotation
const getApiKeys = () => {
    const raw = process.env.GEMINI_API_KEY || "";
    return raw.split(',').map(k => k.trim()).filter(k => k.length > 0);
};

// Helper: Clean JSON response from AI
const cleanJSON = (text) => {
    return text.replace(/```json/g, "").replace(/```/g, "").trim();
};

// Helper: Validate if text is a resume (not random content)
const isValidResume = (text) => {
    if (!text || text.trim().length < 100) return false;
    
    const lowerText = text.toLowerCase();
    
    // Common resume indicators
    const resumeKeywords = [
        'experience', 'skills', 'education', 'work', 'project', 'employment',
        'qualification', 'technical', 'professional', 'background', 'summary',
        'about', 'contact', 'email', 'phone', 'achievement', 'responsibility',
        'university', 'degree', 'certificate', 'course', 'programming', 'language',
        'worked', 'developed', 'designed', 'implemented', 'managed', 'led',
        'github', 'linkedin', 'portfolio', 'project', 'award', 'certification'
    ];
    
    // Count how many resume keywords appear
    let keywordCount = 0;
    resumeKeywords.forEach(keyword => {
        if (lowerText.includes(keyword)) keywordCount++;
    });
    
    // Must have at least 4 resume-related keywords
    if (keywordCount < 4) {
        return false;
    }
    
    // Check for non-resume patterns (book excerpts, articles, etc.)
    const nonResumePatterns = [
        /^chapter\s+\d+/i,
        /^the\s+following\s+is\s+an\s+excerpt/i,
        /^this\s+article\s+discusses/i,
        /^lorem\s+ipsum/i,
        /©\s*\d{4}/,  // Copyright notices
    ];
    
    for (const pattern of nonResumePatterns) {
        if (pattern.test(lowerText.substring(0, 200))) {
            return false;
        }
    }
    
    return true;
};

// --- PAGE 1: The "Career Strategist" (General Audit) ---
export const auditResume = async (req, res) => {
    try {
        console.log("Resume upload received. File:", req.file ? `${req.file.originalname} (${req.file.size} bytes)` : "None");
        
        if (!req.file) {
            console.error("No file in request");
            return res.status(400).json({ error: "No file uploaded" });
        }

        if (!req.file.buffer) {
            console.error("No buffer in file");
            return res.status(400).json({ error: "File upload failed - no data received" });
        }

        let resumeText = "";

        // 1. Extract Text from PDF or DOCX
        try {
            const buffer = req.file.buffer;

            if (req.file.originalname.endsWith('.pdf')) {
                const parser = new PDFParse({ data: buffer });
                await parser.load();
                const text = await parser.getText();
                // getText() returns an array of text objects, join them
                resumeText = Array.isArray(text) ? text.map(t => t.text || t).join(' ') : (text?.text || text || "");
            } else if (req.file.originalname.endsWith('.docx')) {
                const result = await mammoth.extractRawText({ buffer });
                resumeText = result.value || "";
            } else if (req.file.originalname.endsWith('.doc')) {
                return res.status(400).json({ error: "Please upload a PDF or DOCX file. Legacy .doc format is not supported." });
            } else {
                return res.status(400).json({ error: "Please upload a PDF or DOCX file" });
            }
        } catch (extractError) {
            console.error("File extraction error details:", {
                message: extractError.message,
                code: extractError.code,
                errno: extractError.errno,
                stack: extractError.stack,
                fileName: req.file?.originalname,
                bufferSize: req.file?.buffer?.length
            });
            
            return res.status(400).json({ 
                error: `Failed to process file: ${extractError.message}. Please ensure it's a valid PDF or DOCX file.`
            });
        }

        if (!resumeText || resumeText.trim().length < 50) {
            return res.status(400).json({ error: "Resume text is too short or empty. Please upload a valid resume." });
        }

        // 2. Validate that it's actually a resume
        if (!isValidResume(resumeText)) {
            return res.status(400).json({ 
                error: "The uploaded file doesn't appear to be a resume. Please upload a valid resume with experience, skills, education, or work history." 
            });
        }
        const prompt = `
            Act as a Senior Tech Recruiter and Career Advisor. Conduct a comprehensive analysis of this resume:
            
            "${resumeText.slice(0, 4000)}"

            Return ONLY a valid JSON object with EXACTLY this structure (no markdown, no extra text):
            {
                "profileSummary": "A 2-3 sentence professional summary",
                "detectedRole": "e.g. Junior MERN Stack Developer",
                "experienceLevel": "Entry Level",
                "atsScore": 75,
                "aiSpeakScore": 30,
                "aiDetectionWarning": null,
                "sectionAnalysis": {
                    "mostViewed": "Projects",
                    "insight": "Your Projects section is getting strong attention"
                },
                "recommendedJobs": [
                    { 
                        "role": "Junior Frontend Engineer", 
                        "matchConfidence": 85, 
                        "avgSalary": "₹4L - ₹8L", 
                        "reason": "Strong React skills", 
                        "applyOn": ["LinkedIn", "Naukri", "Indeed"]
                    },
                    { 
                        "role": "Full Stack Developer", 
                        "matchConfidence": 78, 
                        "avgSalary": "₹5L - ₹10L", 
                        "reason": "Good MERN stack experience", 
                        "applyOn": ["AngelList", "Instahyre", "Naukri"]
                    },
                    { 
                        "role": "Backend Developer", 
                        "matchConfidence": 72, 
                        "avgSalary": "₹6L - ₹12L", 
                        "reason": "API development experience", 
                        "applyOn": ["LinkedIn", "Glassdoor", "Indeed"]
                    }
                ],
                "improvements": ["Add metrics", "Link GitHub", "Add certifications"],
                "detectedSkills": {
                    "technical": ["React", "Node.js"],
                    "soft": ["Problem Solving", "Communication"]
                }
            }
        `;

        try {
            console.log("Sending to Gemini AI for analysis...");
            
            // Try each API key until one works (handle quota limits)
            const apiKeys = getApiKeys();
            if (apiKeys.length === 0) {
                throw new Error("No API keys configured");
            }

            let lastError = null;
            for (const apiKey of apiKeys) {
                try {
                    const genAI = new GoogleGenerativeAI(apiKey);
                    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite-preview-09-2025" });
                    
                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    const responseText = response.text();
                    console.log("AI Response (first 200 chars):", responseText.substring(0, 200));
                    
                    const jsonResponse = JSON.parse(cleanJSON(responseText));
                    console.log("Successfully parsed JSON response");
                    
                    // Include the extracted text in the response for saving to store
                    return res.json({ success: true, data: jsonResponse, extractedText: resumeText });
                } catch (keyError) {
                    console.log(`API key failed, trying next... Error: ${keyError.message.substring(0, 100)}`);
                    lastError = keyError;
                    continue;
                }
            }
            
            // If we get here, all keys failed
            throw lastError || new Error("All API keys exhausted");
        } catch (aiError) {
            console.error("AI processing error:", {
                message: aiError.message,
                stack: aiError.stack
            });
            return res.status(500).json({ 
                error: `AI analysis failed: ${aiError.message}. Please try again or contact support.` 
            });
        }

    } catch (error) {
        console.error("Resume audit error:", {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ 
            error: `Resume analysis failed: ${error.message}. Please try again or contact support.` 
        });
    }
};

// --- Audit Resume from Text (no file upload) ---
export const auditResumeText = async (req, res) => {
    try {
        const { resumeText } = req.body;

        if (!resumeText || resumeText.trim().length < 50) {
            return res.status(400).json({ error: "Resume text is too short or empty. Please provide at least 50 characters." });
        }

        // Validate that it's actually a resume
        if (!isValidResume(resumeText)) {
            return res.status(400).json({ 
                error: "The text doesn't appear to be a resume. Please provide a resume with experience, skills, education, or work history." 
            });
        }

        // 2. The Comprehensive Audit Prompt (same as auditResume)
        const prompt = `
            Act as a Senior Tech Recruiter and Career Advisor. Conduct a comprehensive analysis of this resume:
            
            "${resumeText.slice(0, 4000)}"

            Return ONLY a valid JSON object with EXACTLY this structure (no markdown, no extra text):
            {
                "profileSummary": "A 2-3 sentence professional summary",
                "detectedRole": "e.g. Junior MERN Stack Developer",
                "experienceLevel": "Entry Level",
                "atsScore": 82,
                "aiSpeakScore": 25,
                "aiDetectionWarning": null,
                "sectionAnalysis": {
                    "mostViewed": "Projects",
                    "insight": "Your Projects section is getting strong attention"
                },
                "recommendedJobs": [
                    { 
                        "role": "Junior Frontend Engineer", 
                        "matchConfidence": 85, 
                        "avgSalary": "₹4L - ₹8L", 
                        "reason": "Strong React skills", 
                        "applyOn": ["LinkedIn", "Naukri", "Indeed"]
                    },
                    { 
                        "role": "Full Stack Developer", 
                        "matchConfidence": 78, 
                        "avgSalary": "₹5L - ₹10L", 
                        "reason": "Good MERN stack experience", 
                        "applyOn": ["LinkedIn", "Naukri", "Indeed", "AngelList"]
                    }
                ],
                "detectedSkills": {
                    "technical": ["React", "Node.js", "MongoDB"],
                "soft": ["Team Collaboration", "Problem Solving"]
                },
                "actionableInsights": [
                    "Add quantifiable metrics to your project descriptions",
                    "Include more keywords related to cloud technologies"
                ]
            }

            IMPORTANT SCORING GUARDRAILS:
            - atsScore: 0-100, but for reasonably complete resumes aim for the 70-90 range.
              Only drop below 60 if the resume is extremely sparse or irrelevant.
            - aiSpeakScore: 0-100 (0=human, 100=AI-generated).
            - If aiSpeakScore > 70, set aiDetectionWarning to a warning message.
            - applyOn should contain 2-4 platforms from: LinkedIn, Naukri, Indeed, AngelList, Instahyre, Glassdoor.
        `;

        // 3. Try all API keys with rotation
        const apiKeys = getApiKeys();
        let lastError = null;

        for (let i = 0; i < apiKeys.length; i++) {
            try {
                console.log(`Trying API key ${i + 1}/${apiKeys.length}...`);
                const genAI = new GoogleGenerativeAI(apiKeys[i]);
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite-preview-09-2025" });
                
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const cleanedText = cleanJSON(response.text());
                console.log("Successfully parsed JSON response");
                const jsonResponse = JSON.parse(cleanedText);

                return res.json({ success: true, data: jsonResponse, extractedText: resumeText });
            } catch (keyError) {
                console.log(`API key ${i + 1} failed:`, keyError.message);
                lastError = keyError;
                // Continue to next key
            }
        }

        // If we get here, all keys failed
        throw lastError || new Error("All API keys exhausted");

    } catch (error) {
        console.error("Resume text audit error:", {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ 
            error: `Resume analysis failed: ${error.message}. Please try again or contact support.` 
        });
    }
};

// --- PAGE 2: The "Job Assassin" (Tailor to JD) ---
export const tailorResume = async (req, res) => {
    try {
        const { jobDescription, existingResumeText } = req.body;

        if (!jobDescription?.trim() || !existingResumeText?.trim()) {
            return res.status(400).json({ error: "Resume and JD both required" });
        }

        const prompt = `
            Act as an ATS Specialist and Elite Hiring Manager. Perform a detailed JD-to-Resume comparison.
            
            Resume: "${existingResumeText.slice(0, 3000)}"
            Job Description: "${jobDescription.slice(0, 3000)}"

            Return a strictly valid JSON object with EXACTLY this structure:
            {
                "matchScore": 72 (0-100 number),
                "hiringVerdict": "High Risk / Medium Risk / Low Risk",
                "verdict_explanation": "You lack 2-3 'Must-Have' skills that appear in the JD.",
                "keywordGapMatrix": {
                    "matched": ["React", "Node.js", "MongoDB", "REST APIs"],
                    "missing": ["Redux", "Unit Testing", "AWS Lambda", "CI/CD Pipelines"],
                    "preferredButNotCritical": ["TypeScript", "GraphQL"]
                },
                "bulletPointFixes": [
                    {
                        "original": "Worked on a team to build a website.",
                        "improved": "Collaborated with a cross-functional team of 4 to architect and deploy a MERN-stack e-commerce platform, reducing page load time by 20% and increasing user retention by 15%—directly aligning with the JD's requirement for 'performance optimization expertise'.",
                        "suggestion": "This rewrite adds metrics, technology specifics, and JD alignment."
                    }
                ],
                "missingKeywordsSuggestions": [
                    { "skill": "Redux", "suggestion": "Add to your 'E-commerce Project' description: 'Managed complex state using Redux'." },
                    { "skill": "Unit Testing", "suggestion": "Mention Jest testing in your project experience." },
                    { "skill": "AWS Lambda", "suggestion": "If applicable, add serverless deployment experience." }
                ],
                "similarRolesAtOtherCompanies": "If this is a Google SDE role requiring MERN + AWS + CI/CD, similar roles exist at Uber (SDE-1), Razorpay (Backend), and Flipkart (Full Stack). Search these companies for positions with the same tech stack.",
                "detectedJobTitle": "Senior Full Stack Engineer (React + Node.js)",
                "requiredSkills": ["React", "Node.js", "AWS", "Unit Testing"],
                "yaltoScore": 45 (0-100, 100 = you are an exact match, consider age/level too)
            }
        `;

        // Try all API keys with rotation
        const apiKeys = getApiKeys();
        let lastError = null;

        for (let i = 0; i < apiKeys.length; i++) {
            try {
                console.log(`Trying API key ${i + 1}/${apiKeys.length}...`);
                const genAI = new GoogleGenerativeAI(apiKeys[i]);
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite-preview-09-2025" });
                
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const cleanedText = cleanJSON(response.text());
                const jsonResponse = JSON.parse(cleanedText);

                return res.json({ success: true, data: jsonResponse });
            } catch (keyError) {
                console.log(`API key ${i + 1} failed:`, keyError.message);
                lastError = keyError;
                // Continue to next key
            }
        }

        // If we get here, all keys failed
        throw lastError || new Error("All API keys exhausted");

    } catch (error) {
        console.error("Resume tailoring error:", {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ 
            error: `Resume tailoring failed: ${error.message}. Please try again or contact support.` 
        });
    }
};

