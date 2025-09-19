import Service from "../models/Service.js";

const createService = async (req, res) => {
    const { name, title, description, price, duration, staffRequired, category, image, icon } = req.body;
    try {
        const service = await Service.create({
            name: name || title, // Use title as name if name not provided
            title: title || name, // Use name as title if title not provided
            description,
            price,
            duration,
            staffRequired,
            category,
            image,
            icon
        });
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ message: "Service not found" });
        res.json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ message: "Service not found" });

        const { name, title, description, price, duration, staffRequired, category, image, icon } = req.body;
        service.name = name || service.name;
        service.title = title || service.title;
        service.description = description || service.description;
        service.price = price || service.price;
        service.duration = duration || service.duration;
        service.staffRequired = staffRequired ?? service.staffRequired;
        service.category = category || service.category;
        service.image = image || service.image;
        service.icon = icon || service.icon;

        const updatedService = await service.save();
        res.json(updatedService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ message: "Service not found" });

        await service.deleteOne();
        res.json({ message: "Service removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createService, getServices, getService, updateService, deleteService };
