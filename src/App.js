
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Camera, User, Mail, Send, ArrowRight, CheckCircle, XCircle, Instagram, Linkedin, Twitter } from 'lucide-react';

// --- MOCK DATA ---
const navLinks = [
    { href: '#projects', label: 'Projects' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
];

const projectsData = [
    { id: 1, title: 'Urban Elegance', category: 'Fashion', imageUrl: 'https://images.pexels.com/photos/1036627/pexels-photo-1036627.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { id: 2, title: 'Coastal Serenity', category: 'Landscape', imageUrl: 'https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { id: 3, title: 'Timeless Vows', category: 'Wedding', imageUrl: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { id: 4, title: 'Metropolis at Night', category: 'Cityscape', imageUrl: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { id: 5, title: 'Candid Moments', category: 'Portrait', imageUrl: 'https://images.pexels.com/photos/1382734/pexels-photo-1382734.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { id: 6, title: 'Wild Horizons', category: 'Nature', imageUrl: 'https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
];

const specializations = [
    { name: 'Portrait', icon: User },
    { name: 'Landscape', icon: Camera },
    { name: 'Wedding', icon: CheckCircle },
    { name: 'Fashion', icon: Mail }
];

const socialLinks = [
    { href: '#', icon: Instagram },
    { href: '#', icon: Twitter },
    { href: '#', icon: Linkedin },
];

// --- CUSTOM HOOK FOR FORM HANDLING ---
const useForm = (initialState, validate) => {
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle', 'success', 'error'

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    }, [errors]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const validationErrors = validate(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsSubmitting(true);
            setSubmitStatus('idle');
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));
                setSubmitStatus('success');
                setFormData(initialState);
            } catch (error) {
                setSubmitStatus('error');
            } finally {
                setIsSubmitting(false);
            }
        }
    }, [formData, validate, initialState]);

    return { formData, errors, isSubmitting, submitStatus, handleChange, handleSubmit };
};

// --- VALIDATION LOGIC ---
const validateContactForm = (data) => {
    let errors = {};
    if (!data.name.trim()) errors.name = 'Name is required.';
    if (!data.email) {
        errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = 'Email address is invalid.';
    }
    if (!data.message.trim()) {
        errors.message = 'Message is required.';
    } else if (data.message.length < 10) {
        errors.message = 'Message must be at least 10 characters long.';
    }
    return errors;
};

// --- HELPER COMPONENTS ---
const Section = ({ id, children, className = '' }) => (
    <section id={id} className={`w-full py-20 md:py-32 px-6 md:px-12 lg:px-24 ${className}`}>
        {children}
    </section>
);

const SectionTitle = ({ children }) => (
    <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-12 text-center">
        {children}
    </h2>
);

const PhotographerPortfolioPage = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    const form = useForm({ name: '', email: '', message: '' }, validateContactForm);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e, href) => {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({
            behavior: 'smooth'
        });
    };

    const projectCards = useMemo(() => projectsData.map((project, index) => (
        <div
            key={project.id}
            className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
                <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                <p className="text-rose-300 text-sm">{project.category}</p>
            </div>
        </div>
    )), []);

    return (
        <div className="bg-slate-900 text-slate-300 font-sans antialiased">
            {/* --- Header --- */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/80 backdrop-blur-sm shadow-xl' : 'bg-transparent'}`}>
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <a href="#" className="text-2xl font-bold text-white flex items-center gap-2">
                        <Camera className="text-rose-500" />
                        <span>Photolio</span>
                    </a>
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map(link => (
                            <a key={link.label} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className="text-slate-200 hover:text-rose-400 transition-colors duration-300 font-medium">
                                {link.label}
                            </a>
                        ))}
                    </div>
                </nav>
            </header>

            <main>
                {/* --- Hero Section --- */}
                <section id="home" className="h-screen min-h-[700px] flex items-center justify-center bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('https://images.pexels.com/photos/221540/pexels-photo-221540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}>
                    <div className="absolute inset-0 bg-slate-900/60"></div>
                    <div className="relative text-center text-white px-4 animate-fade-in">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tight">Capturing Life's Moments</h1>
                        <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto mb-8">Professional photography that tells your story with passion and precision.</p>
                        <a href="#projects" onClick={(e) => handleNavClick(e, '#projects')} className="inline-flex items-center justify-center px-8 py-4 bg-rose-600 text-white font-bold text-lg rounded-md hover:bg-rose-700 transition-all duration-300 shadow-lg hover:shadow-rose-600/40 transform hover:-translate-y-1">
                            View My Work <ArrowRight className="ml-2 h-5 w-5" />
                        </a>
                    </div>
                </section>

                {/* --- Project Showcase Section --- */}
                <Section id="projects" className="bg-slate-950">
                    <SectionTitle>My Projects</SectionTitle>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projectCards}
                    </div>
                </Section>

                {/* --- About Section --- */}
                <Section id="about">
                    <SectionTitle>About Me</SectionTitle>
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
                        <div className="lg:col-span-2 animate-fade-in-right">
                            <div className="rounded-lg overflow-hidden shadow-2xl aspect-square">
                                <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Photographer" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="lg:col-span-3 animate-fade-in-left">
                            <h3 className="text-3xl font-bold text-rose-400 mb-4">Jane Doe - Visual Storyteller</h3>
                            <p className="text-lg mb-6 text-slate-300">
                                With over a decade of experience behind the lens, I specialize in capturing authentic moments that last a lifetime. My passion lies in finding the extraordinary in the ordinary, whether it's the subtle glance at a wedding or the majestic sweep of a mountain range. My camera is my tool, but my heart is my guide.
                            </p>
                            <div className="mt-8">
                                <h4 className="text-xl font-semibold text-white mb-4">Specializations</h4>
                                <div className="flex flex-wrap gap-4">
                                    {specializations.map(spec => (
                                        <div key={spec.name} className="flex items-center bg-slate-800/50 rounded-full px-4 py-2">
                                            <spec.icon className="h-5 w-5 text-rose-400 mr-2" />
                                            <span className="font-medium text-slate-200">{spec.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* --- Contact Section --- */}
                <Section id="contact" className="bg-slate-950">
                    <SectionTitle>Get In Touch</SectionTitle>
                    <div className="max-w-3xl mx-auto">
                        <form onSubmit={form.handleSubmit} noValidate className="space-y-6">
                            <div className="relative">
                                <label htmlFor="name" className="sr-only">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Your Name"
                                    value={form.formData.name}
                                    onChange={form.handleChange}
                                    aria-invalid={!!form.errors.name}
                                    aria-describedby="name-error"
                                    className={`w-full bg-slate-800 text-white placeholder-slate-400 border-2 rounded-md p-4 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-rose-500 ${form.errors.name ? 'border-red-500' : 'border-slate-700 focus:border-rose-500'}`}
                                />
                                <User className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                {form.errors.name && <p id="name-error" className="text-red-400 text-sm mt-1">{form.errors.name}</p>}
                            </div>
                            <div className="relative">
                                <label htmlFor="email" className="sr-only">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Your Email"
                                    value={form.formData.email}
                                    onChange={form.handleChange}
                                    aria-invalid={!!form.errors.email}
                                    aria-describedby="email-error"
                                    className={`w-full bg-slate-800 text-white placeholder-slate-400 border-2 rounded-md p-4 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-rose-500 ${form.errors.email ? 'border-red-500' : 'border-slate-700 focus:border-rose-500'}`}
                                />
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                {form.errors.email && <p id="email-error" className="text-red-400 text-sm mt-1">{form.errors.email}</p>}
                            </div>
                            <div>
                                <label htmlFor="message" className="sr-only">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    placeholder="Your Message"
                                    rows="5"
                                    value={form.formData.message}
                                    onChange={form.handleChange}
                                    aria-invalid={!!form.errors.message}
                                    aria-describedby="message-error"
                                    className={`w-full bg-slate-800 text-white placeholder-slate-400 border-2 rounded-md p-4 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-rose-500 ${form.errors.message ? 'border-red-500' : 'border-slate-700 focus:border-rose-500'}`}
                                ></textarea>
                                {form.errors.message && <p id="message-error" className="text-red-400 text-sm mt-1">{form.errors.message}</p>}
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    disabled={form.isSubmitting}
                                    className="w-full flex items-center justify-center px-8 py-4 bg-transparent border-2 border-rose-500 text-rose-400 font-bold text-lg rounded-md hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all duration-300 shadow-lg hover:shadow-rose-600/40 transform hover:-translate-y-1 disabled:bg-slate-800 disabled:border-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {form.isSubmitting ? 'Sending...' : 'Send Message'}
                                    {!form.isSubmitting && <Send className="ml-2 h-5 w-5" />}
                                </button>
                            </div>
                        </form>
                        {form.submitStatus === 'success' && (
                            <div className="mt-6 p-4 bg-emerald-900/50 border border-emerald-700 text-emerald-300 rounded-md flex items-center gap-3 animate-fade-in">
                                <CheckCircle className="h-6 w-6" />
                                <p>Thank you! Your message has been sent successfully.</p>
                            </div>
                        )}
                        {form.submitStatus === 'error' && (
                            <div className="mt-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-md flex items-center gap-3 animate-fade-in">
                                <XCircle className="h-6 w-6" />
                                <p>Something went wrong. Please try again later.</p>
                            </div>
                        )}
                    </div>
                </Section>
            </main>

            {/* --- Footer --- */}
            <footer className="bg-slate-950 border-t border-slate-800">
                <div className="container mx-auto px-6 py-8 text-center text-slate-400">
                    <div className="flex justify-center space-x-6 mb-4">
                        {socialLinks.map((social, index) => (
                            <a key={index} href={social.href} className="text-slate-400 hover:text-rose-400 transition-colors duration-300">
                                <social.icon className="h-6 w-6" />
                                <span className="sr-only">{social.icon.displayName}</span>
                            </a>
                        ))}
                    </div>
                    <p>&copy; {new Date().getFullYear()} Photolio. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default PhotographerPortfolioPage;
