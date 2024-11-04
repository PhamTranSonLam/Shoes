const Contact = require('../models/Contact');

// Handle contact form submission
exports.submitContactForm = async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        const contact = new Contact({
            name,
            email,
            subject,
            message
        });

        await contact.save();

        res.status(201).json({ message: 'Contact form submitted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error submitting contact form', error: err.message });
    }
};

// Get all contact form submissions (for admin use)
exports.getContactForms = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving contact forms', error: err.message });
    }
};

// Get a single contact form submission by ID
exports.getContactFormById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact form not found' });
        }
        res.json(contact);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving contact form', error: err.message });
    }
};

// Delete a contact form submission by ID (for admin use)
exports.deleteContactForm = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact form not found' });
        }
        res.json({ message: 'Contact form deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting contact form', error: err.message });
    }
};
