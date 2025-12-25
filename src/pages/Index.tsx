import { Helmet } from "react-helmet-async";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import TechStack from "@/components/landing/TechStack";
import UseCases from "@/components/landing/UseCases";
import Security from "@/components/landing/Security";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Nano File Exchange System - Fast & Secure File Sharing</title>
        <meta 
          name="description" 
          content="Upload, download, and share large files with resumable uploads and hybrid storage. Perfect for students, teams, and organizations." 
        />
        <meta name="keywords" content="file sharing, file transfer, cloud storage, resumable uploads, group chat, collaboration" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <HowItWorks />
          <TechStack />
          <UseCases />
          <Security />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
