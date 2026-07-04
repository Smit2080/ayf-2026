import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Ticker from '@/components/Ticker';
import WhyAYF from '@/components/WhyAYF';
import EventCategories from '@/components/EventCategories';
import Journey from '@/components/Journey';
import VolunteerSection from '@/components/VolunteerSection';
import Instagram from '@/components/Instagram';
import StatsCounter from '@/components/StatsCounter';
import Testimonials from '@/components/Testimonials';
import FAQSection from '@/components/FAQ';
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
        <VolunteerSection />
        <Instagram />
        <StatsCounter />
        <Testimonials />
        <FAQSection />
      </main>

      <Footer />
    </>
  );
}
