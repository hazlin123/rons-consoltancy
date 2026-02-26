import { GlassSlider } from "@/components/landing/GlassSlider";
import { RedesignedHero } from "@/components/landing/RedesignedHero";
import { RedesignedAbout } from "@/components/landing/RedesignedAbout";
import { RedesignedServices } from "@/components/landing/RedesignedServices";
import { RedesignedVisa } from "@/components/landing/RedesignedVisa";
import { AustralianSchools } from "@/components/landing/AustralianSchools";
import { RegistrationSteps } from "@/components/landing/RegistrationSteps";
import { RedesignedContact } from "@/components/landing/RedesignedContact";
import { SeoHead } from "@/components/shared/SeoHead";

const Index = () => {
  return (
    <div className="bg-[#0f172a] min-h-screen">
      <SeoHead
        title="IELTS Eldoret | Official Training & Registration Agency"
        description="Official British Council IELTS partner agency in Eldoret, Kenya. Expert training, registration support, and guaranteed success for your global journey."
      />

      <GlassSlider>
        <RedesignedHero />
        <RedesignedAbout />
        <RedesignedServices />
        <RedesignedVisa />
        <AustralianSchools />
        <RegistrationSteps />
        <RedesignedContact />
      </GlassSlider>
    </div>
  );
};

export default Index;
