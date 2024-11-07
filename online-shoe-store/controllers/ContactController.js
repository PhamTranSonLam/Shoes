const Contact = require('../models/Contact');

// Handle contact form submission
exports.submitContactForm = async (req, res) => {
    const { username, phone, content, } = req.body;

    try {
        // Create new contact document
        const contact = new Contact({
            username,
            phone,
            content,
        });

        // Save to database
        await contact.save();
        res.status(201).json({ success: true, message: 'Contact form submitted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error submitting contact form', error: err.message });
    }
};

// Get all contact form submissions (for admin use)
exports.getContactForms = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json({ success: true, contacts });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error retrieving contact forms', error: err.message });
    }
};

// Get a single contact form submission by ID
exports.getContactFormById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact form not found' });
        }
        res.json({ success: true, contact });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error retrieving contact form', error: err.message });
    }
};

// Delete a contact form submission by ID (for admin use)
exports.deleteContactForm = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact form not found' });
        }
        res.json({ success: true, message: 'Contact form deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error deleting contact form', error: err.message });
    }
};
