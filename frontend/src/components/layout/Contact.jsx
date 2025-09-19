import React from "react";

const Contact = () => {
    return (
        <section id="contact" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                {/* Heading */}
                <div className="text-center mb-16">
                    <h2
                        className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
                        style={{ fontFamily: '"Playfair Display", serif' }}
                    >
                        Visit Our Salon
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Find us in the heart of downtown, where luxury meets convenience.
                        We're here to serve you with excellence.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div>
                        <div className="bg-white rounded-xl p-8 shadow-lg">
                            <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                                Get In Touch
                            </h3>
                            <div className="space-y-6">
                                {/* Address */}
                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                        <i className="ri-map-pin-line text-xl text-rose-600"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                                        <p className="text-gray-600">
                                            Near NIT, Aadityapur
                                            <br />
                                            Jamshedpur, Jharkhand - 831014
                                        </p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                        <i className="ri-phone-line text-xl text-rose-600"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                                        <p className="text-gray-600">+91 9876543210</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                        <i className="ri-mail-line text-xl text-rose-600"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                                        <p className="text-gray-600">royal@salonspa.com</p>
                                    </div>
                                </div>

                                {/* Hours */}
                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                        <i className="ri-time-line text-xl text-rose-600"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Hours</h4>
                                        <div className="text-gray-600 space-y-1">
                                            <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
                                            <p>Saturday: 7:00 AM - 10:00 PM</p>
                                            <p>Sunday: 7:00 AM - 10:00 PM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <h4 className="font-semibold text-gray-900 mb-4">Follow Us</h4>
                                <div className="flex space-x-4">
                                    <a
                                        href="#"
                                        className="w-10 h-10 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center transition-colors"
                                    >
                                        <i className="ri-facebook-fill text-lg"></i>
                                    </a>
                                    <a
                                        href="#"
                                        className="w-10 h-10 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center transition-colors"
                                    >
                                        <i className="ri-instagram-line text-lg"></i>
                                    </a>
                                    <a
                                        href="#"
                                        className="w-10 h-10 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center transition-colors"
                                    >
                                        <i className="ri-twitter-fill text-lg"></i>
                                    </a>
                                    <a
                                        href="#"
                                        className="w-10 h-10 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center transition-colors"
                                    >
                                        <i className="ri-youtube-fill text-lg"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Google Map */}
                    <div>
                        <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1355.4457619928223!2d86.14428741275279!3d22.770932680296884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f5e500640f9e11%3A0xac71327e89565f2c!2sAsangi!5e0!3m2!1sen!2sin!4v1757351706774!5m2!1sen!2sin"
                                className="w-full h-full min-h-[400px]"
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Royal Salon & Spa Center Location"
                                style={{ border: 0 }}
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;

