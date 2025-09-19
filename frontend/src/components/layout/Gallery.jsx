import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HairTransformationImg from "../../assets/HairTransformation.png";
import SpaTreatmentImg from "../../assets/SpaTreatment.png";
import NailArtImg from "../../assets/NailArts.png";
import MakeupArtistryImg from "../../assets/MakeupArtistry.png";
import SalonInteriorImg from "../../assets/SalonInterior.png";
import HairStylingImg from "../../assets/HairStyling.png";
import FacialTreatmentImg from "../../assets/FacialTreatment.png";
import ColorServicesImg from "../../assets/ColorServices.png";

const galleryItems = [
    {
        title: "Hair Transformation",
        img: HairTransformationImg,
    },
    {
        title: "Spa Treatment",
        img: SpaTreatmentImg,
    },
    {
        title: "Nail Art",
        img: NailArtImg,
    },
    {
        title: "Makeup Artistry",
        img: MakeupArtistryImg,
    },
    {
        title: "Salon Interior",
        img: SalonInteriorImg,
    },
    {
        title: "Hair Styling",
        img: HairStylingImg,
    },
    {
        title: "Facial Treatment",
        img: FacialTreatmentImg,
    },
    {
        title: "Color Services",
        img: ColorServicesImg,
    },
];


const Gallery = () => {
    const [selected, setSelected] = useState(null);

    return (
        <section id="gallery" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Heading */}
                <div className="text-center mb-16">
                    <h2
                        className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
                        style={{ fontFamily: '"Playfair Display", serif' }}
                    >
                        Our Gallery
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Take a look at our beautiful work and the transformations we've
                        created for our valued clients
                    </p>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryItems.map((item, index) => (
                        <div
                            key={index}
                            className="relative overflow-hidden rounded-lg cursor-pointer group"
                            onClick={() => setSelected(item)}
                        >
                            <img
                                src={item.img}
                                alt={item.title}
                                className="w-full h-64 object-cover object-top transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <i className="ri-eye-line text-2xl"></i>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                <h3 className="text-white font-semibold">{item.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Animated Modal */}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelected(null)}
                    >
                        <motion.div
                            className="relative max-w-4xl max-h-full"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="absolute -top-12 right-0 text-white hover:text-gray-300 cursor-pointer"
                                onClick={() => setSelected(null)}
                            >
                                <i className="ri-close-line text-3xl"></i>
                            </button>
                            <img
                                src={selected.img}
                                alt={selected.title}
                                className="max-w-full max-h-full object-contain rounded-lg"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Gallery;
