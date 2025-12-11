import React from "react";
import NavBar from "../Components/LandingPageNavBar";
import { HeroSection } from "../Components/HeroSection";
import { ProblemSolution } from "../Components/ProblemAndSolutionSection";
import { Features } from "../Components/Features";
import { HowItWorks } from "../Components/HowItWorks";
import { Footer } from "../Components/Footer";

const LandingPage = () => {
  return (
    <>
      <NavBar />
      <HeroSection />
      <ProblemSolution />
      <Features />
      <HowItWorks />
      <Footer />
    </>
  );
};

export default LandingPage;
