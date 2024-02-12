import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800">
        Privacy Policy for SocietyEaseHub
      </h1>
      <h2 className="text-2xl">1. Introduction</h2>
      <p className="ml-4">
        Welcome to SocietyEaseHub! This Privacy Policy ("Policy") outlines how
        we collect, use, and disclose personal information when you use our web
        application,{" "}
        <Link href="/" className="text-blue-500 hover:underline">
          https://societyeasehub.vercel.app/
        </Link>{" "}
        , which utilizes third-party authentication providers such as Google,
        GitHub, and Discord through NextAuth.js. By accessing or using our web
        app, you consent to the terms outlined in this Policy.
      </p>
      <h2 className="text-2xl">2. Information We Collect</h2>
      <p className="ml-4">
        <h3 className="text-xl">2.1 Personal Information:</h3> When you
        authenticate using third-party providers such as Google, GitHub, or
        Discord through NextAuth.js, we may collect certain personal information
        provided by those providers, including your name, email address, profile
        picture, and other information necessary for authentication.
      </p>
      <p className="ml-4">
        <h3 className="text-xl">2.2 Usage Information:</h3> We may also collect
        information about your interactions with our web app, such as pages
        visited, time spent on each page, and other usage statistics, to improve
        our services and user experience.
      </p>
      <h2 className="text-2xl">3. How We Use Your Information</h2>
      <p className="ml-4">
        We use the information collected for authentication purposes, to provide
        and improve our services, personalize your experience, and communicate
        with you about our services and updates.
      </p>
      <h2 className="text-2xl">4. Information Sharing</h2>
      <p className="ml-4">
        We may share your information with third-party authentication providers
        to facilitate the authentication process. Additionally, we may share
        your information with service providers who assist us in operating our
        web app and providing services to you.
      </p>
      <h2 className="text-2xl">5. Data Security</h2>
      <p className="ml-4">
        We take reasonable measures to protect your personal information from
        unauthorized access, disclosure, alteration, or destruction. However, no
        method of transmission over the internet or electronic storage is 100%
        secure.
      </p>
      <h2 className="text-2xl">6. Your Choices</h2>
      <p className="ml-4">
        You can choose to decline or disable cookies through your browser
        settings, but this may affect your ability to use certain features of
        our web app. You may also manage your account settings and preferences
        related to third-party authentication providers.
      </p>
      <h2 className="text-2xl">7. Third-Party Services</h2>
      <p className="ml-4">
        Our web app may contain links to third-party websites or services that
        are not owned or controlled by us. We are not responsible for the
        privacy practices or content of these third-party websites or services.
      </p>
      <h2 className="text-2xl">8. Changes to This Policy</h2>
      <p className="ml-4">
        We may update this Privacy Policy from time to time to reflect changes
        in our practices or legal requirements. We will notify you of any
        material changes by posting the updated Policy on this page.
      </p>
      <h2 className="text-2xl">9. Contact Us</h2>
      <p className="ml-4">
        If you have any questions or concerns about this Privacy Policy, please
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
