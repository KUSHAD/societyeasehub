import Link from "next/link";

export default function RefundPolicy() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">
        Refund Policy For SocietyEaseHub
      </h1>
      <h2 className="text-2xl">1. Refund Eligibility:</h2>
      <p className="ml-4">
        <h3 className="text-xl">1.1 Subscription Fees:</h3> Subscription fees
        for accessing the SocietyEaseHub service are non-refundable, as stated
        in our Terms of Service. Once you subscribe to the service and pay the
        applicable fees, you are obligated to fulfill the entire subscription
        term and pay all associated fees, regardless of your actual usage of the
        service.
      </p>
      <h2 className="text-2xl">2. Cancelation and Termination:</h2>
      <p className="ml-4">
        <h3 className="text-xl">2.1 Cancelable Subscription:</h3> If you cancel
        your subscription, you will still be able to access the service until
        the end of the current subscription term. However, no refunds will be
        provided for the remaining subscription period.
      </p>
      <p className="ml-4">
        <h3 className="text-xl">2.2 Termination by SocietyEaseHub:</h3> We
        reserve the right to terminate or suspend your access to the service at
        any time, with or without cause, and without prior notice or liability.
      </p>
      <h2 className="text-2xl">3. Exceptions:</h2>
      <p className="ml-4">
        <h3 className="text-xl">3.1 Technical Issues:</h3> In the event of
        technical issues preventing you from accessing or using the service, we
        will work to resolve the issue promptly. If the issue persists and
        significantly affects your ability to use the service, you may be
        eligible for a refund.
      </p>
      <p className="ml-4">
        <h3 className="text-xl"> 3.2 Dissatisfaction:</h3> If you are
        unsatisfied with the service provided and can demonstrate that it does
        not meet your expectations or requirements, you may request a refund
        within 2 business days of the initial subscription purchase. Refund
        requests will be reviewed on a case-by-case basis.
      </p>
      <h2 className="text-2xl">4. Refund Process:</h2>
      <p className="ml-4">
        <h3 className="text-xl">4.1 Refund Request:</h3> To request a refund,
        please contact our customer support team at
        kushad.chakraborty@gmail.com, providing a valid reason for the refund
        request and any supporting documentation.
      </p>
      <p className="ml-4">
        <h3 className="text-xl">4.2 Refund Processing:</h3> Refund requests will
        be reviewed and processed within 2 business days of receipt. Refunds
        will be issued to the original payment method used for the subscription
        purchase.
      </p>
      <h2 className="text-2xl">5. Contact Us:</h2>
      <p className="ml-4">
        If you have any questions or concerns about our refund policy, please
        contact our customer support team at{" "}
        <Link
          className="text-blue-500 hover:underline"
          href="mailto:kushad.chakraborty@gmail.com"
        >
          kushad.chakraborty@gmail.com
        </Link>{" "}
        .
      </p>
    </div>
  );
}
