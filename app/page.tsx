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
  title: 'PrepCUET - #1 Platform for CUET & Subject Preparation',
  description: 'Start your journey to your dream university with PrepCUET. Access thousands of practice questions, mock tests, and subject-wise study material designed for CUET success.',
  alternates: {
    canonical: 'https://prepcuet.com',
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
