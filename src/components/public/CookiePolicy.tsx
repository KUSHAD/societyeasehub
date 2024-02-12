import Link from "next/link";

export default function CookiePolicy() {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800">
        Cookie Policy for SocietyEaseHub
      </h1>
      <h2 className="text-2xl">1. Introduction</h2>
      <p className="ml-4">
        Welcome to SocietyEaseHub! This Cookie Policy ("Policy") explains how we
        use cookies and similar tracking technologies on our web application,{" "}
        <Link href="/" className="text-blue-500 hover:underline">
          https://societyeasehub.vercel.app/
        </Link>{" "}
        , which utilizes NextAuth.js for authentication. By accessing or using
        our web app, you consent to the use of cookies as described in this
        Policy.
      </p>
      <h2 className="text-2xl">2. What Are Cookies?</h2>
      <p className="ml-4">
        Cookies are small text files that are placed on your device when you
        visit a website or use an application. They are commonly used to store
        information about your preferences, settings, and interactions with the
        website or application.
      </p>
      <h2 className="text-2xl">3. How We Use Cookies</h2>
      <p className="ml-4">
        We use cookies and similar tracking technologies for the following
        purposes:
        <p>
          <h3 className="text-xl"> Authentication:</h3> We use cookies to
          authenticate users and maintain user sessions across pages.
        </p>
        <p>
          <h3 className="text-xl"> Security:</h3> We use cookies to detect and
          prevent fraudulent activity and enhance the security of our web app.
        </p>
        <p>
          <h3 className="text-xl"> Preferences: </h3>We use cookies to remember
          your preferences and settings, such as language preferences and
          accessibility settings.
        </p>
        <p>
          <h3 className="text-xl"> Analytics: </h3> We use cookies to collect
          information about how you interact with our web app, including pages
          visited, time spent on each page, and other usage statistics. This
          helps us analyze and improve the performance and usability of our web
          app.
        </p>
      </p>
      <h2 className="text-2xl">4. Your Cookie Choices</h2>
      <p className="ml-4">
        You can choose to accept or decline cookies through your browser
        settings. Most web browsers automatically accept cookies, but you can
        usually modify your browser settings to decline cookies if you prefer.
        However, this may prevent you from taking full advantage of our web app.
      </p>
      <h2 className="text-2xl">5. Third-Party Services</h2>
      <p className="ml-4">
        Our web app may contain links to third-party websites or services that
        are not owned or controlled by us. These third-party services may also
        use cookies and similar tracking technologies, and their use of cookies
        is governed by their own privacy policies.
      </p>
      <h2 className="text-2xl">6. Changes to This Policy</h2>
      <p className="ml-4">
        We may update this Cookie Policy from time to time to reflect changes in
        our practices or legal requirements. We will notify you of any material
        changes by posting the updated Policy on this page.
      </p>
      <h2 className="text-2xl">7. Contact Us</h2>
      <p className="ml-4">
        If you have any questions or concerns about this Cookie Policy, please
        contact us at{" "}
        <Link
          className="text-blue-500 hover:underline"
          href="mailto:kushad.chakraborty@gmail.com"
        >
          kushad.chakraborty@gmail.com
        </Link>{" "}
        .
      </p>
    </>
  );
}
