/**
 * @file linkedinController.js
 * @description Analyzes LinkedIn profile screenshots using Gemini Vision (Multi-modal).
 * @author Senior Architect
 */

import fs from 'fs';
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { getRawClient } from '../utils/gemini.js';

/**
 * @desc    Analyze a LinkedIn Screenshot for Branding & Professionalism
 * @route   POST /api/linkedin
 * @access  Public
 */
export const analyzeLinkedin = async (req, res) => {
    // 1. Validation
    if (!req.file) {
        return res.status(400).json({ 
            success: false, 
            error: { code: 'NO_FILE', message: "Image screenshot is required." } 
        });
    }

    const filePath = req.file.path;

    try {
        console.log(`[Vision API] Processing file: ${req.file.originalname}`);

        // 2. Get Rotated Client (Grab next available API Key)
        const genAI = getRawClient();
        
        // Note: FileManager also needs the API Key. 
        // We extract the key from the genAI instance we just created.
        const apiKey = genAI.apiKey; 
        const fileManager = new GoogleAIFileManager(apiKey);

        // 3. Upload to Google's Temporary File Store
        const uploadResponse = await fileManager.uploadFile(filePath, {
            mimeType: req.file.mimetype,
            displayName: `User Upload ${Date.now()}`,
        });

        // 4. Generate Content using Vision Model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite-preview-09-2025" });
        
        const result = await model.generateContent([
            {
                fileData: {
                    mimeType: uploadResponse.file.mimeType,
                    fileUri: uploadResponse.file.uri
                }
            },
            { text: `
                You are a Personal Branding Consultant for Tech Professionals.
                Analyze this LinkedIn profile screenshot strictly on visual and content hierarchy.

                **Evaluation Criteria:**
                1. **Headshot:** Is it high-quality? Professional lighting? (Pass/Fail)
                2. **Banner:** Is it default/blank? Does it showcase skills/code?
                3. **Headline:** Is it generic (e.g., "Student at XYZ")? It should be value-driven (e.g., "Full Stack Dev | Building Scalable Apps").

                **Return strictly JSON:**
                {
                    "visual_score": 75,
                    "critique": "Banner is wasted space. It's just a generic color.",
                    "headline_suggestion": "Change 'Student' to 'Aspiring Software Engineer | React & Node.js Specialist'",
                    "action_items": ["Upload a custom banner", "Zoom in on profile photo", "Add 'Open to Work' frame"]
                }
            `}
        ]);

        // 5. Parse Response
        const responseText = result.response.text();
        const cleanText = responseText.replace(/```json|```/g, '').trim();
        const data = JSON.parse(cleanText);

        res.status(200).json({ success: true, data });

    } catch (error) {
        console.error(`[LinkedIn Controller] Error: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            error: { code: 'VISION_ERROR', message: "Failed to analyze image." } 
        });

    } finally {
        // 6. Cleanup (Critical for Disk Space)
        // Always delete the local file, success or failure
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`[System] Cleaned up temp file: ${filePath}`);
        }
    }
};
