
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutHeroSection from "@/components/about/AboutHeroSection";
import ProjectHistorySection from "@/components/about/ProjectHistorySection";
import ServerFeaturesSection from "@/components/about/ServerFeaturesSection";
import TeamSection from "@/components/about/TeamSection";
import ServerRulesSection from "@/components/about/ServerRulesSection";
import FaqSection from "@/components/about/FaqSection";
import ContactSection from "@/components/about/ContactSection";
import { 
  teamMembers, 
  serverFeatures, 
  serverRules,
  faqItems 
} from "@/data/aboutPageData";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <AboutHeroSection />
      
      <ProjectHistorySection />
      
      <ServerFeaturesSection features={serverFeatures} />
      
      <TeamSection members={teamMembers} />
      
      <ServerRulesSection rules={serverRules} />
      
      <FaqSection items={faqItems} />
      
      <ContactSection />
      
      <Footer />
    </div>
  );
};

export default About;
