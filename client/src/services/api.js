/**
 * @file api.js
 * @description Centralized Axios Service.
 * Handles all HTTP communication with the Backend.
 */

import axios from 'axios';

// Configuration
// Use relative URL to leverage Vite proxy in development
// In Production, this would be an environment variable (import.meta.env.VITE_API_URL)
const API_BASE_URL = '/api';

// Create Axios Instance with Defaults
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30s timeout for AI operations
});

export const api = {
    /**
     * GitHub Intelligence
     * @param {string} username 
     */
    scanGithub: (username) => apiClient.post('/github', { username }),

    /**
     * ATS Resume Audit
     * Note: We don't manually set Content-Type here; Axios sets it automatically for FormData
     * @param {FormData} formData - Keys: 'resume', 'jobDescription'
     */
    scanAts: (formData) => apiClient.post('/ats', formData),

    /**
     * LinkedIn Vision Analysis
     * @param {FormData} formData - Keys: 'screenshot'
     */
    analyzeLinkedin: (formData) => apiClient.post('/linkedin', formData),

    /**
     * Career Roadmap Generation
     * @param {string} skill - e.g. "Docker"
     * @param {string} currentLevel - e.g. "Beginner"
     */
    generateRoadmap: (skill, currentLevel = 'Beginner') => apiClient.post('/roadmap', { skill, currentLevel }),
};
