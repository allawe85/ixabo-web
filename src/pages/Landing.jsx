// Fixed imports (assuming this file is in src/pages/)
import Hero from "../components/home/Hero";
import PartnerSlider from "../components/home/PartnerSlider";
import CategoryGrid from "../components/home/CategoryGrid";
import OfferTicker from "../components/home/OfferTicker";
import iXaboButton from "@/components/ui/iXaboButton";


const Landing = () => {
  return (
    // FIX: Wrapped everything in a single parent div
    <div className="bg-ui-bg min-h-screen">
      <Hero />
      <PartnerSlider />
      <CategoryGrid />
      <OfferTicker />
      <iXaboButton>Click me</iXaboButton>
    </div>
  );
};

export default Landing;
