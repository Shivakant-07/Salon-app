import React from "react";
import ServicesImg from "../../assets/ServicesImg.png";


const ServiceCard = ({ image, icon, title, price, description, service, onBook }) => {
    // Use service object if provided, otherwise use individual props
    const serviceData = service || { image, icon, title, price, description };
    const displayTitle = serviceData.title || serviceData.name;
    const displayPrice = typeof serviceData.price === 'number'
        ? `₹${serviceData.price} · ${serviceData.duration}min.`
        : serviceData.price || 'Price on request';
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            {/* Image */}
            <div className="h-48 overflow-hidden">
                <img
                    src={serviceData.image || ServicesImg}
                    alt={displayTitle}
                    className="w-full h-full object-cover object-top"
                />
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mr-4">
                        <i className={`${serviceData.icon || 'ri-service-line'} text-2xl text-rose-600`} />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">{displayTitle}</h3>
                        <p className="text-rose-600 font-semibold">{displayPrice}</p>
                    </div>
                </div>
                <p className="text-gray-600 mb-4">{serviceData.description || 'Professional service'}</p>
                <button
                    onClick={() => onBook && onBook(serviceData)}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
                >
                    Book Now
                </button>
            </div>
        </div>
    );
};

export default ServiceCard;
