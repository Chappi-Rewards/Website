
import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const PrivacyPolicyPage = () => {
  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy for Chappi</h1>
        <p className="mb-4"><strong>Effective Date:</strong> 01/07/2025</p>

        <h2 className="text-2xl font-bold mt-6 mb-2">1. Introduction</h2>
        <p>
          Welcome to Chappi. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application. We are based in Nigeria and this policy is designed to be compliant with the California Online Privacy Protection Act (CalOPPA), the General Data Protection Regulation (GDPR), and the California Consumer Privacy Act (CCPA).
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">2. Information We Collect</h2>
        <p>We may collect information about you in a variety of ways. The information we may collect via the Application includes:</p>
        <ul className="list-disc list-inside ml-4">
          <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and password.</li>
          <li><strong>Demographic Information:</strong> Information such as your city, state, and country.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-2">3. How We Use Your Information</h2>
        <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:</p>
        <ul className="list-disc list-inside ml-4">
          <li>Create and manage your account.</li>
          <li>Email you regarding your account or order.</li>
          <li>Enable user-to-user communications.</li>
          {/* <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Application.</li> */}
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-2">4. Data Storage and Security</h2>
        <p>
          We use administrative, technical, and physical security measures to help protect your personal information. Your data is stored locally on your device. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">5. Camera Access</h2>
        <p>
          Our application requests access to your device's camera. This access is required for features within the app to function correctly, such as taking profile pictures or scanning QR codes. We do not store or share any photos or videos from your camera without your explicit permission.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">6. Your Data Protection Rights (GDPR & CCPA)</h2>
        <p>Depending on your location, you may have the following rights regarding your personal data:</p>
        <ul className="list-disc list-inside ml-4">
          <li>The right to access – You have the right to request copies of your personal data.</li>
          <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate.</li>
          <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
          <li>The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
          <li>The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.</li>
          <li>The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
        </ul>
        <p className="mt-2">
          If you are a California resident, you have the right to request information from us regarding the manner in which we share certain categories of your personal information with third parties for their direct marketing purposes. To make such a request, please contact us at the email below.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">7. CalOPPA Compliance</h2>
        <p>We comply with CalOPPA. We agree to the following:</p>
        <ul className="list-disc list-inside ml-4">
          <li>Users can visit our site anonymously.</li>
          <li>We will add a link to this Privacy Policy on our home page.</li>
          <li>Users will be notified of any privacy policy changes on our Privacy Policy Page.</li>
          <li>Users are able to change their personal information by emailing us or by logging into their account.</li>
        </ul>
        <p className="mt-2">
          <strong>Do Not Track Signals:</strong> We honor Do Not Track signals and do not track, plant cookies, or use advertising when a Do Not Track (DNT) browser mechanism is in place.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">8. Children's Privacy</h2>
        <p>
          We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">9. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">10. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:chappigit@gmail.com" className="text-blue-500">chappigit@gmail.com</a>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
