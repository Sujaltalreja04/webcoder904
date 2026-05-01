import React from 'react';
import ReactDOM from 'react-dom/client';
import { Museum3DGalleryStandalone } from './components/3d/Museum3DGalleryStandalone';
import './index.css';

// Hide loading screen after React loads
setTimeout(() => {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.add('hide');
        setTimeout(() => loading.remove(), 500);
    }
}, 1000);

// Project data
const projects = {
    evolvex: {
        title: 'Evolvex AI',
        description: 'An AI Based Career Suggestion Platform using advanced machine learning algorithms to provide personalized career guidance',
        image: 'https://i.ibb.co/m5s51Xk0/Screenshot-2025-11-29-032008.png',
        tags: ['Streamlit', 'Llama', 'Gemini', 'XGBoost', 'NumPy', 'MongoDB'],
        projectUrl: 'https://sujaltalreja04-google-cloud-hackathon-2025-appmain-pnutz6.streamlit.app/',
        githubUrl: 'https://github.com/Sujaltalreja04/Evolvex-AI-',
        videoUrl: 'https://www.youtube.com/watch?v=GjT53JZFldg&pp=0gcJCQwKAYcqIYzv',
    },
    quickcourt: {
        title: 'QuickCourt',
        description: 'An AI Based Sports ground booking platform made in Odoo Hackathon 2025',
        image: 'https://raw.githubusercontent.com/Sujaltalreja04/Msc-Portfolio/refs/heads/main/Screenshot%202025-11-29%20171129.png',
        tags: ['React', 'TypeScript', 'Firebase', 'Llama'],
        projectUrl: 'https://quick-court-a-local-sports-booking.vercel.app',
        githubUrl: 'https://github.com/Sujaltalreja04/QuickCourt---A-Local-Sports-Booking-team-217-odoo-hackathon-2025',
    }
};

// Get project from URL params
const urlParams = new URLSearchParams(window.location.search);
const projectKey = urlParams.get('project') || 'evolvex';
const selectedProject = projects[projectKey as keyof typeof projects] || projects.evolvex;

// Update document title
document.title = `${selectedProject.title} - 3D Museum Gallery`;

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Museum3DGalleryStandalone project={selectedProject} />
    </React.StrictMode>
);
