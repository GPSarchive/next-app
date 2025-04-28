'use client';

import { useState } from 'react';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  number: string;
  message: string;
  privacyConsent: boolean;              // <-- new
};

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    number: '',
    message: '',
    privacyConsent: false,               // <-- new
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error || 'Failed to send message.');
      }

      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        number: '',
        message: '',
        privacyConsent: false,           // reset checkbox
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      <div className="flex gap-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="flex-1 p-2 border rounded"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
          className="flex-1 p-2 border rounded"
        />
      </div>

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <input
        type="tel"
        name="number"
        placeholder="Phone Number"
        value={formData.number}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <textarea
        name="message"
        placeholder="Your message"
        value={formData.message}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded h-32"
      />

      <div className="flex items-center">
        <input
          id="privacyConsent"
          type="checkbox"
          name="privacyConsent"
          checked={formData.privacyConsent}
          onChange={handleChange}
          required
          className="mr-2"
        />
        <label htmlFor="privacyConsent" className="text-sm">
          I have read and agree to the{' '}
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Privacy Policy
          </a>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>

      {success && <p className="text-green-600 text-center">Message sent successfully!</p>}
      {error && <p className="text-red-600 text-center">Error: {error}</p>}
    </form>
  );
}
