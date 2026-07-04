import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Ticker from '@/components/Ticker';
import WhyAYF from '@/components/WhyAYF';
import EventCategories from '@/components/EventCategories';
import Journey from '@/components/Journey';

import VolunteerSection from '@/components/VolunteerSection';
import Gallery from '@/components/Gallery';
import Instagram from '@/components/Instagram';
import StatsCounter from '@/components/StatsCounter';
import Testimonials from '@/components/Testimonials';
import Partners from '@/components/Partners';
import FAQSection from '@/components/FAQ';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <div className="cursor-dot" id="cursorDot" />

      <Navbar />

      <main id="top">
        <Hero />
        <Ticker />
        <EventCategories />
        <WhyAYF />
        <Journey />
        <CTA />
        <VolunteerSection />
        <Gallery />
        <Instagram />
        <StatsCounter />
        <Testimonials />
        <Partners />
        <FAQSection />
      </main>

      <Footer />

      <div className="toast">Frontend demo: saved locally</div>
    </>
  );
}
