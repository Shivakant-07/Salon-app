import React, { useState } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Services from "./Services";
import Gallery from "../components/layout/Gallery";
import Review from "../components/layout/Review";
import BookingCTA from "../components/layout/BookinCTA";
import Contact from "../components/layout/Contact";
import About from "../components/layout/About";
import Hero from "../components/layout/Hero";

export default function Home() {
    const [teamModalTrigger, setTeamModalTrigger] = useState(0);

    const handleTeamModalOpen = () => {
        setTeamModalTrigger(prev => prev + 1);
    };

    return (
        <>
            <header className="absolute top-0 left-0 w-full z-50 bg-transparent">
                <Navbar />
            </header>
            <Hero />
            <Services />
            <About onTeamModalOpen={teamModalTrigger} />
            <Gallery />
            <Review />
            <BookingCTA />
            <Contact />
            <Footer onTeamModalOpen={handleTeamModalOpen} />
        </>
    );
}