import { MetadataRoute } from 'next';
import { SUBJECTS_DATA } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://prepcuet.com'; // Replace with your actual domain

    // Static routes
    const staticRoutes = [
        '',
        '/about',
        '/contact',
        '/courses/online',
        '/test-series',
        '/resources',
        '/toppers',
        '/login',
        '/signup',
        '/privacy',
        '/terms',
        '/faq',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic routes from SUBJECTS_DATA
    const subjectRoutes = SUBJECTS_DATA.map((subject) => ({
        url: `${baseUrl}/subjects/${subject.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [...staticRoutes, ...subjectRoutes];
}
