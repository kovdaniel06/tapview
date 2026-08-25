import PolicyLayout from "./PolicyLayout";

export default function PrivacyPolicySection() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      lastUpdated="August 25, 2026"
      sections={[
        {
          id: "overview",
          title: "Overview",
          content: (
            <p>
              Tapview (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;)
              respects your privacy and is committed to protecting your
              personal data. This Privacy Policy explains how we collect,
              use, and protect your information when you visit our website
              (https://tapview.hu) or purchase our physical NFC & QR Review products.
            </p>
          ),
        },
        {
          id: "information-we-collect",
          title: "Information We Collect",
          content: (
            <>
              <p>
                We collect personal information that you voluntarily provide
                to us when placing an order or contacting customer support:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong className="text-white">Contact Information:</strong>{" "}
                  Full name, email address, phone number.
                </li>
                <li>
                  <strong className="text-white">
                    Shipping & Billing Details:
                  </strong>{" "}
                  Delivery address, billing address, business name.
                </li>
                <li>
                  <strong className="text-white">Google Business Link:</strong>{" "}
                  The Google Maps / Business Review URL associated with your
                  device configuration.
                </li>
                <li>
                  <strong className="text-white">Payment Information:</strong>{" "}
                  Processed securely via third-party payment gateways (e.g.,
                  Stripe). We do not store raw credit card details on our
                  servers.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "how-devices-operate",
          title: "How NFC & QR Devices Operate",
          content: (
            <>
              <p>
                Our physical NFC Stands and Cards strictly act as physical
                shortcuts to your official Google Business Profile. When a
                customer taps or scans an NFC/QR device:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  No personal data is collected or tracked from the tapping
                  customer.
                </li>
                <li>
                  The user is redirected directly to Google&apos;s review
                  interface in their standard browser.
                </li>
                <li>
                  All reviews are submitted through and governed by
                  Google&apos;s Privacy Policy and Terms of Service.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "data-sharing",
          title: "Data Sharing & Third Parties",
          content: (
            <>
              <p>
                We do not sell, rent, or trade your personal information. We
                only share necessary order details with trusted service
                providers strictly to fulfill your purchase:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Courier and shipping providers for order fulfillment.</li>
                <li>Payment processors for transaction handling.</li>
              </ul>
            </>
          ),
        },
        {
          id: "your-rights",
          title: "Your Rights (GDPR)",
          content: (
            <p>
              Under GDPR and applicable laws, you have the right to request
              access to, correction of, or deletion of your personal data
              stored with us. To exercise any of these rights, contact us at{" "}
              <a
                href="mailto:info@tapview.hu"
                className="text-[#7BAAF7] underline underline-offset-2 hover:text-white"
              >
                info@tapview.hu
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  );
}