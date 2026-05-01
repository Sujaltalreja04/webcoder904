import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    ogImage?: string;
    ogType?: string;
}

export const SEO = ({ 
    title, 
    description, 
    canonicalUrl,
    ogImage = 'https://sktalreja.me/og-image.png',
    ogType = 'website'
}: SEOProps) => {
    const siteUrl = 'https://sktalreja.me';
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    const url = canonicalUrl || `${siteUrl}${currentPath === '/' ? '' : currentPath}`;
    
    // JSON-LD Schema for Person/Professional
    const personSchema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Sujal Talreja',
        alternateName: 'Sujal',
        jobTitle: 'AI & LLM Engineer | Data Analyst | Full-Stack Developer',
        url: siteUrl,
        sameAs: [
            'https://www.linkedin.com/in/sujal-talreja',
            'https://github.com/sktalreja',
            'https://twitter.com/sujal_codes'
        ],
        description: 'AI & LLM Engineer and Data Analyst specializing in Large Language Models, Agentic AI, RAG pipelines, GenAI and full-stack development',
        worksFor: {
            '@type': 'Organization',
            name: 'Sujal Talreja Portfolio'
        }
    };

    // JSON-LD Schema for Website
    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: siteUrl,
        name: 'Sujal Talreja - AI Portfolio',
        description: description || 'Professional AI Engineer Portfolio',
        author: {
            '@type': 'Person',
            name: 'Sujal Talreja'
        }
    };

    // JSON-LD Schema for breadcrumbs (if not on homepage)
    const breadcrumbSchema = currentPath !== '/' ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: siteUrl
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: currentPath.substring(1),
                item: url
            }
        ]
    } : null;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            {title && <title>{title}</title>}
            {description && <meta name="description" content={description} />}
            {description && <meta name="theme-description" content={description} />}
            
            {/* Canonical URL */}
            <link rel="canonical" href={url} />
            
            {/* Open Graph / Social Media Tags */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={url} />
            {title && <meta property="og:title" content={title} />}
            {description && <meta property="og:description" content={description} />}
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:alt" content={title || 'Sujal Talreja Portfolio'} />
            <meta property="og:site_name" content="Sujal Talreja Portfolio" />
            <meta property="og:locale" content="en_US" />
            
            {/* Twitter Card Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:creator" content="@sujal_codes" />
            {title && <meta name="twitter:title" content={title} />}
            {description && <meta name="twitter:description" content={description} />}
            <meta name="twitter:image" content={ogImage} />
            
            {/* Additional Meta Tags */}
            <meta name="author" content="Sujal Talreja" />
            <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
            <meta name="keywords" content="Sujal Talreja, AI Engineer, LLM Engineer, AI and LLM Engineer, Large Language Models, Agentic AI, RAG pipeline, GenAI, AI portfolio, LLM fine-tuning, AI agents, Prompt Engineering, Deep Learning, Data Analysis, Full-stack Developer, Next.js, Python, sktalreja" />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
            <meta name="color-scheme" content="dark" />
            
            {/* JSON-LD Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(personSchema)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(websiteSchema)}
            </script>
            {breadcrumbSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            )}
        </Helmet>
    );
};
