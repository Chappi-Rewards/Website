
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const AccountDeletionPage = () => {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the deletion request to your backend
    console.log('Account deletion request submitted for:', email);
    console.log('Reason:', reason);
    console.log('Feedback:', feedback);
    setSubmitted(true);
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Request Account Deletion</h1>
        {submitted ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Thank you!</strong>
            <span className="block sm:inline"> Your account deletion request has been received. We will process it within 72 hours.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="mb-4">
              To request the deletion of your account and associated data, please fill out the form below.
              Please note that account deletion is permanent and cannot be undone.
            </p>
            <p className="mb-4">
              Upon successful deletion of your account, the following data will be permanently removed:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>Your profile information (name, email, etc.)</li>
              <li>Your transaction history</li>
              <li>Any content you have created or uploaded</li>
            </ul>
            <p className="mb-4">
              For legal and security reasons, we may retain some anonymized data for a limited period.
              For more information, please see our Privacy Policy.
            </p>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="reason" className="block text-gray-700 text-sm font-bold mb-2">
                Reason for deletion
              </label>
              <select
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Please select a reason</option>
                <option value="privacy">Privacy concerns</option>
                <option value="not-using">I'm not using the service anymore</option>
                <option value="bad-experience">I had a bad experience</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="feedback" className="block text-gray-700 text-sm font-bold mb-2">
                Feedback (optional)
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="4"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Request Deletion
              </button>
            </div>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AccountDeletionPage;
