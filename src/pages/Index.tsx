import { Hero } from "@/components/landing/Hero";
import { ScholarshipSearch } from "@/components/landing/ScholarshipSearch";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { Contact } from "@/components/landing/Contact";

const Index = () => {
  return (
    <div className="bg-background">
      <Hero />
      <ScholarshipSearch />
      <HowItWorks />
      <Testimonials />
      <Contact />
    </div>
  );
};

export default Index;
