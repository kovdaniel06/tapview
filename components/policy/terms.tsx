import PolicyLayout from "./PolicyLayout";

export default function TermsOfServiceSection() {
  return (
    <PolicyLayout
      title="Terms of Service"
      lastUpdated="August 25, 2026"
      sections={[
        {
          id: "agreement",
          title: "Agreement to Terms",
          content: (
            <p>
              By accessing or purchasing from Tapview, you agree to be
              bound by these Terms of Service. If you do not agree to these
              terms, please do not order our products or use our services.
            </p>
          ),
        },
        {
          id: "products-payment",
          title: "Products & One-Time Payment",
          content: (
            <>
              <p>Tapview sells physical NFC Review Stands and Cards.</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  All purchases are one-time payments with no recurring
                  subscription fees.
                </li>
                <li>
                  Devices come pre-programmed or easily configurable to
                  direct customers to your specified Google Review page.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "google-disclaimer",
          title: "Disclaimer Regarding Google Services",
          content: (
            <>
              <p>
                Tapview is an independent entity and is not affiliated,
                endorsed, or sponsored by Google LLC or Alphabet Inc.
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  We do not guarantee a specific number of reviews, star
                  ratings, or business ranking improvements.
                </li>
                <li>
                  We do not write, manipulate, or fake Google reviews. All
                  reviews must be left authentically by your actual end
                  customers.
                </li>
                <li>
                  You are responsible for ensuring your Google Business
                  account complies with Google&apos;s guidelines.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "shipping-delivery",
          title: "Shipping & Delivery",
          content: (
            <p>
              Orders within Hungary are dispatched promptly and typically
              delivered within 1–2 business days. Shipping costs and
              delivery times for international locations are calculated at
              checkout.
            </p>
          ),
        },
        {
          id: "warranty",
          title: "Warranty & Replacement",
          content: (
            <p>
              Our physical NFC devices are built to be durable and
              long-lasting. If your device arrives defective or
              non-functional, contact us within 14 days of receipt for a
              free replacement.
            </p>
          ),
        },
      ]}
    />
  );
}