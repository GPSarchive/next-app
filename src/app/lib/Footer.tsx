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
      <p className="text-xs text-gray-500 mt-4 text-right">
        Icon by <a className="link_pro" href="https://freeicons.io/city-elements-icon-set-14/bed-city-elements-bedroom-hotel-sleep-icon-769408">ColourByteDesigns</a>on <a href="https://freeicons.io">freeicons.io</a> 
      </p>
      
    </footer>
  );
}
