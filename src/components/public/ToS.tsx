import Link from "next/link";

export default function ToS() {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800">
        Terms of Service (ToS) for SocietyEaseHub
      </h1>
      <h2 className="text-2xl">1. Introduction</h2>
      <p className="ml-4">
        Welcome to SocietyEaseHub! These Terms of Service ("Terms") govern your
        access to and use of our web application,{" "}
        <Link href="/" className="text-blue-500 hover:underline">
          https://societyeasehub.vercel.app/
        </Link>
        (the "Service"), provided by SocietyEaseHub ("we," "us," or "our"). By
        accessing or using the Service, you agree to comply with these Terms. If
        you do not agree with these Terms, you may not use the Service.
      </p>
      <p>
        <h2 className="text-2xl">2. Access and Use</h2>
      </p>
      <p className="ml-4">
        <h3 className="text-xl"> 2.1 Eligibility: </h3> You must be at least 18
        years old and have the legal capacity to enter into these Terms to use
        the Service. By using the Service, you represent and warrant that you
        meet these eligibility requirements.
      </p>
      <p className="ml-4">
        <h3 className="text-xl">2.2 Account Creation: </h3> To access certain
        features of the Service, you may need to create an account. You are
        responsible for maintaining the confidentiality of your account
        credentials and for all activities that occur under your account.
      </p>
      <p className="ml-4">
        <h3 className="text-xl">2.3 Subscription: </h3> Access to the Service
        requires a subscription. You agree to pay the applicable subscription
        fees in advance before using the Service.
      </p>
      <p className="ml-4">
        <h3 className="text-xl"> 2.4 Cancelable Subscription: </h3>
        Subscriptions are non-refundable. Once you subscribe to the Service and
        pay the applicable fees, you are obligated to fulfill the entire
        subscription term and pay all associated fees, regardless of your actual
        usage of the Service. If you cancel, you will the able to access the
        service till the end of current tenure
      </p>
      <p>
        <h2 className="text-2xl">3. Intellectual Property</h2>
      </p>
      <p className="ml-4">
        <h3 className="text-xl">3.1 Ownership :</h3> The Service and its
        original content, features, and functionality are owned by
        SocietyEaseHub and are protected by copyright, trademark, and other
        intellectual property laws.
      </p>
      <p className="ml-4">
        <h3 className="text-xl">3.2 License:</h3> Subject to these Terms, we
        grant you a limited, non-exclusive, non-transferable license to access
        and use the Service for your personal or internal business purposes.
      </p>
      <h2 className="text-2xl">4. Privacy</h2>
      <p className="ml-4">
        Our Privacy Policy governs the collection, use, and disclosure of your
        personal information. By using the Service, you consent to the terms of
        our Privacy Policy.
      </p>
      <h2 className="text-2xl">5. Modifications to the Service</h2>
      <p className="ml-4">
        We reserve the right to modify or discontinue, temporarily or
        permanently, the Service or any part thereof with or without notice. You
        agree that we will not be liable to you or any third party for any
        modification, suspension, or discontinuance of the Service.
      </p>
      <h2 className="text-2xl">6. Limitation of Liability</h2>
      <p className="ml-4">
        To the fullest extent permitted by applicable law, we disclaim all
        warranties, express or implied, including, but not limited to, implied
        warranties of merchantability, fitness for a particular purpose, and
        non-infringement. In no event shall we be liable for any indirect,
        incidental, special, consequential, or punitive damages, including, but
        not limited to, damages for lost profits or revenue, arising out of or
        in connection with your use of the Service.
      </p>
      <h2 className="text-2xl">7. Governing Law</h2>
      <p className="ml-4">
        These Terms shall be governed by and construed in accordance with the
        laws of India, without regard to its conflict of law provisions.
      </p>
      <h2 className="text-2xl">8. Contact Us</h2>
      <p className="ml-4">
        If you have any questions about these Terms, please contact us at{" "}
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
