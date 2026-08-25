import PolicyLayout from "./PolicyLayout";

export default function CookiePolicySection() {
  return (
    <PolicyLayout
      title="Cookie Policy"
      lastUpdated="August 4, 2026"
      sections={[
        {
          id: "what-are-cookies",
          title: "What Are Cookies?",
          content: (
            <p>
              Cookies are small text files stored on your browser or device
              when you visit websites. They help remember your preferences,
              keep your session active, and provide basic analytics.
            </p>
          ),
        },
        {
          id: "how-we-use-cookies",
          title: "How We Use Cookies",
          content: (
            <>
              <p>
                We use a minimal set of essential cookies to keep our
                landing page functional and secure:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong className="text-white">Essential Cookies:</strong>{" "}
                  Required for fundamental site functionality (e.g., shopping
                  cart memory, checkout processing).
                </li>
                <li>
                  <strong className="text-white">
                    Performance & Analytics:
                  </strong>{" "}
                  Anonymous usage data to help us understand page performance
                  and improve user experience.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "nfc-no-cookies",
          title: "NFC / QR Taps Do Not Use Cookies",
          content: (
            <p>
              When a customer taps your physical NFC Review Stand or scans
              the QR code,{" "}
              <strong className="text-white">
                no cookies are set or tracked by Project X99
              </strong>
              . The user&apos;s device opens the native Google browser URL
              directly.
            </p>
          ),
        },
        {
          id: "managing-cookies",
          title: "Managing Cookies",
          content: (
            <p>
              You can modify your cookie settings directly through your
              browser settings to decline or delete cookies at any time.
            </p>
          ),
        },
      ]}
    />
  );
}