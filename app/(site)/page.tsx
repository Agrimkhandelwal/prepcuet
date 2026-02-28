import HeroSlider from '@/components/HeroSlider';
import WhatIsCuet from '@/components/WhatIsCuet';
import QuickLinks from '@/components/QuickLinks';
import ContentFeed from '@/components/ContentFeed';
import Sidebar from '@/components/Sidebar';
import SubjectExplorer from '@/components/SubjectExplorer';
import StatsCounter from '@/components/StatsCounter';
import Testimonials from '@/components/Testimonials';
import WhyChooseUs from '@/components/WhyChooseUs';
import Newsletter from '@/components/Newsletter';
import FAQ from '@/components/FAQ';
import styles from './Home.module.css';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PrepCUET | #1 Best CUET Preparation & Mock Test Platform 2026',
  description: 'Start your journey to your dream university with PrepCUET. Access thousands of free CUET practice questions, chapter-wise mock tests, and expert study material designed for CUET UG success.',
  keywords: ['CUET', 'CUET preparation', 'CUET mock tests', 'CUET 2026', 'CUET study material', 'CUET syllabus', 'free CUET mock tests', 'Common University Entrance Test'],
  alternates: {
    canonical: 'https://www.preepcuet.in',
  },
};

export default function Home() {
  return (
    <>
      <HeroSlider />
      <StatsCounter />
      <WhatIsCuet />
      <QuickLinks />
      <WhyChooseUs />
      {/* LATEST UPDATES SECTION - HIDDEN (uncomment to show again) */}
      {/* <div className="container" style={{ marginTop: '3rem', marginBottom: '3rem' }}>
        <div className={styles.mainGrid}>
          <main>
            <ContentFeed />
          </main>
          <div className={styles.sidebarWrapper}>
            <Sidebar />
          </div>
        </div>
      </div> */}
      <SubjectExplorer />
      <Testimonials />
      <FAQ />
      <Newsletter />
    </>
  );
}
