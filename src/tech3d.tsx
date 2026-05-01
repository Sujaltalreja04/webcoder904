import React from 'react';
import ReactDOM from 'react-dom/client';
import { Tech3DGalleryStandalone } from './components/3d/Tech3DGalleryStandalone';
import './index.css';

// Hide loading screen after React loads
setTimeout(() => {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.add('hide');
        setTimeout(() => loading.remove(), 500);
    }
}, 1000);

// Weblancer project data
const weblancerProject = {
    title: 'Weblancer Tech',
    description: 'Full stack freelance platform with modern UI, 3D visualizations and seamless user experience',
    image: 'https://i.ibb.co/PGbNfkCH/Screenshot-2025-11-02-150357.png',
    tags: ['React.js', 'Next.js', 'Three.js', 'TypeScript', 'Tailwind CSS'],
    projectUrl: 'https://weblancer-ai.vercel.app/',
    githubUrl: 'https://github.com/Sujaltalreja04/Weblacer_AI?tab=readme-ov-file',
};

// Update document title
document.title = `${weblancerProject.title} - 3D Tech Gallery`;

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Tech3DGalleryStandalone project={weblancerProject} />
    </React.StrictMode>
);
