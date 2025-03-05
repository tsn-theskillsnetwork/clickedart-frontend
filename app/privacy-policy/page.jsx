import Link from "next/link";
import React from "react";

export default function TermsConditionsPage() {
  return (
    <div className="flex flex-col gap-4 mt-4 min-h-screen px-4 sm:px-8 md:px-16 lg:px-20 mb-10">
      <h1 className="text-2xl sm:text-4xl font-bold text-center">Privacy Policy</h1>
      <p className="text-base sm:text-paragraph font-semibold">Effective Date: 26 January 2025</p>
      <p className="text-base sm:text-paragraph font-medium">
        Welcome to ClickedArt.com. We are committed to safeguarding the privacy
        of our users, including both buyers and photographers. This Privacy
        Policy outlines how we collect, use, disclose, and protect your
        information.
      </p>
      <h2 className="text-xl sm:text-2xl font-bold">Information We Collect</h2>
      <ul className="list-disc list-inside">
        <li>
          Account Information: When you create an account, we collect your name,
          email address, password, postal address, and phone number.
        </li>
        <li>
          Photographer-Specific Information: Photographers may provide
          additional information, such as portfolio details, social media links,
          and payment information for transactions.
        </li>
        <li>
          Buyer-Specific Information: Buyers may provide payment details, order
          history, and preferences to facilitate purchases.
        </li>
        <li>
          Usage Data: We collect information about your interactions with our
          site, including IP addresses, browser types, device information,
          referral URLs, and pages visited.
        </li>
        <li>
          Cookies and Tracking Technologies: We use cookies, web beacons, and
          similar technologies to improve user experience and analyze website
          traffic.
        </li>
      </ul>
      <h2 className="text-xl sm:text-2xl font-bold">How We Use Your Information</h2>
      <ul className="list-disc list-inside">
        <li>
          Account Management: To create and manage your account, process
          transactions, and provide customer support.
        </li>
        <li>
          Communication: To send notifications, updates, and promotional
          materials, and to respond to inquiries.
        </li>
        <li>
          Personalization: To tailor content and advertisements to your
          interests and enhance your experience on our site.
        </li>
        <li>
          Personalization: To tailor content and advertisements to your
          interests and enhance your experience on our site.
        </li>
        <li>
          Legal Compliance: To comply with legal obligations and protect against
          fraudulent activities.
        </li>
      </ul>
      <h2 className="text-xl sm:text-2xl font-bold">Sharing Your Information</h2>
      <ul className="list-disc list-inside">
        <li>
          Service Providers: We share information with third-party vendors who
          assist with payment processing, data analysis, marketing, and customer
          service.
        </li>
        <li>
          Business Transfers: If we undergo a merger, acquisition, or asset
          sale, your information may be transferred.
        </li>
        <li>
          Legal Requirements: We may disclose information to comply with legal
          requests, protect our rights, and ensure user safety.
        </li>
        <li>
          Consent: We may share information for other purposes with your
          explicit consent.
        </li>
      </ul>
      <h2 className="text-xl sm:text-2xl font-bold">Data Security</h2>
      <p className="text-base sm:text-paragraph">
        We implement robust security measures to protect your information.
        However, no online platform is entirely secure, and we cannot guarantee
        absolute security.
      </p>
      <h2 className="text-xl sm:text-2xl font-bold">Your Privacy Rights</h2>
      <ul className="list-disc list-inside">
        <li>
          Access and Update: You can access and update your personal information
          through your account settings.
        </li>
        <li>
          Opt-Out: You can opt-out of receiving marketing communications by
          following the unsubscribe instructions in emails.
        </li>
        <li>
          Data Portability and Deletion: You may request a copy of your data or
          ask us to delete your information, subject to legal requirements.
        </li>
      </ul>
      <h2 className="text-xl sm:text-2xl font-bold">International Data Transfers</h2>
      <p className="text-base sm:text-paragraph">
        Your information may be transferred to and processed in countries other
        than your own. We ensure appropriate safeguards are in place to protect
        your data.
      </p>
      <h2 className="text-xl sm:text-2xl font-bold">Children's Privacy</h2>
      <p className="text-base sm:text-paragraph">
        Our service is not intended for individuals under 16. We do not
        knowingly collect information from children. If we become aware of such
        data, we will take steps to delete it.
      </p>
      <h2 className="text-xl sm:text-2xl font-bold">Third-Party Websites</h2>
      <p className="text-base sm:text-paragraph">
        Our website may contain links to external sites. We are not responsible
        for the privacy practices of these websites.
      </p>
      <h2 className="text-xl sm:text-2xl font-bold">Changes to this Privacy Policy</h2>
      <p className="text-base sm:text-paragraph">
        We may update this Privacy Policy periodically. We will notify you of
        significant changes via email and/or a prominent notice on our website.
      </p>
      <h2 className="text-xl sm:text-2xl font-bold">Contact Us</h2>
      <p className="text-base sm:text-paragraph">
        For questions or concerns about this Privacy Policy, please contact us
        at:{" "}
        <Link href={"mailto:support@clickedart.com"}>
          support@clickedart.com
        </Link>
      </p>
    </div>
  );
}
