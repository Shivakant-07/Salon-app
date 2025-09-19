import User from "../models/User.js";

// ---------------- GET ALL STAFF ----------------
export const getStaff = async (req, res) => {
    try {
        // fetch all users whose role is staff
        const staff = await User.find({ role: "staff" });
        res.json(staff);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ---------------- ADD OR UPDATE STAFF ----------------
export const addStaff = async (req, res) => {
    try {
        const { name, email, skills, phone, exp, position } = req.body;

        // find user by name or email
        let user = await User.findOne({
            $or: [{ name }, { email }]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // update role to staff and add staff fields
        user.role = "staff";
        user.skills = skills || [];
        user.phone = phone || user.phone;
        user.exp = exp || "0 Year of Experience";
        user.position = position || "Staff Member";
        user.availableToday = false; // Default to not available

        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ---------------- REMOVE STAFF ROLE ----------------
export const deleteStaff = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // change role back to customer (or null)
        user.role = "customer";
        await user.save();
        res.json({ message: "Staff removed" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// ---------------- UPDATE STAFF ----------------
export const updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const { skills, availableToday, phone, exp, position } = req.body;

        const staff = await User.findById(id);
        if (!staff) return res.status(404).json({ message: "Staff not found" });

        if (skills) staff.skills = skills;
        if (phone !== undefined) staff.phone = phone;
        if (exp !== undefined) staff.exp = exp;
        if (position !== undefined) staff.position = position;
        if (availableToday !== undefined) staff.availableToday = availableToday;

        const updated = await staff.save();
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
