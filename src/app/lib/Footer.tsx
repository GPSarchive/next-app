import ContactForm from '@/app/lib/ContactForm';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#0a0a23] to-black text-white py-16 mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Contact Us
        </h2>
        <ContactForm />
        <p className="text-center text-gray-400 mt-12 text-sm">
          © {new Date().getFullYear()} Your Company Name. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
