import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Soul Sounds" },
      { name: "description", content: "Read the Soul Sounds Privacy Policy." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="bg-background relative min-h-screen overflow-hidden">
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-24 sm:py-32">
        <h1 className="font-display text-4xl text-foreground sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Last Updated: June 19, 2026
        </p>

        <div className="mt-16 space-y-10 text-[15px] leading-relaxed text-foreground/80">
          <section>
            <h2 className="font-display mb-3 text-2xl text-foreground">1. Introduction</h2>
            <p>
              Soul Sounds (“we,” “our,” or “us”) respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you visit our website and use our services.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-foreground">2. Information We Collect</h2>
            <p className="mb-2">We collect the following types of information:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-foreground">Quiz Responses:</strong> Your answers to the Soul Sounds quiz are used to generate a personalized archetype and instrumental composition.
              </li>
              <li>
                <strong className="text-foreground">Email Address:</strong> If you provide your email address, we use it to deliver your Soul Sound and send transactional updates.
              </li>
              <li>
                <strong className="text-foreground">Payment Information:</strong> We do not store your payment card details. All payments are processed securely by Stripe, Inc.
              </li>
              <li>
                <strong className="text-foreground">Usage Data:</strong> We collect anonymized data about how you interact with our website, including pages visited and features used.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-foreground">3. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar technologies to improve your experience and analyze traffic. Specifically, we use:
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                <strong className="text-foreground">Google Analytics</strong> — to understand site usage and improve performance.
              </li>
              <li>
                <strong className="text-foreground">Microsoft Clarity</strong> — to analyze user behavior and enhance usability.
              </li>
              <li>
                <strong className="text-foreground">Meta Pixel</strong> — to measure advertising effectiveness and deliver relevant marketing.
              </li>
            </ul>
            <p className="mt-2">
              You can manage cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-foreground">4. How We Use Your Information</h2>
            <p className="mb-2">We use the information we collect to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Generate and deliver your personalized Soul Sound and archetype result.</li>
              <li>Process transactions and send order confirmations.</li>
              <li>Send transactional emails (e.g., delivery of your Soul Sound) via Resend.</li>
              <li>Analyze usage trends and improve our website and services.</li>
              <li>Detect and prevent fraud or abuse.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-foreground">5. Third-Party Services</h2>
            <p className="mb-2">
              We rely on trusted third-party providers to operate our service:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-foreground">Supabase</strong> — for secure database and storage infrastructure.
              </li>
              <li>
                <strong className="text-foreground">Stripe</strong> — for payment processing.
              </li>
              <li>
                <strong className="text-foreground">Resend</strong> — for email delivery.
              </li>
              <li>
                <strong className="text-foreground">Google, Microsoft, and Meta</strong> — for analytics and advertising measurement as described above.
              </li>
            </ul>
            <p className="mt-2">
              Each third party operates under its own privacy policy. We encourage you to review their policies for more information.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-foreground">6. Data Security</h2>
            <p>
              We implement reasonable technical and organizational measures to protect your data. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-foreground">7. Data Retention</h2>
            <p>
              We retain your quiz results and email address for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. You may request deletion of your data by contacting us.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-foreground">8. Your Rights</h2>
            <p>
              Depending on your jurisdiction, you may have rights to access, correct, or delete your personal information. To exercise these rights, please contact us at the email address below.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-foreground">9. Children’s Privacy</h2>
            <p>
              Soul Sounds is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-foreground">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page with an updated “Last Updated” date.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-foreground">11. Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy, please contact us at{" "}
              <a
                href="mailto:hello@getsoulsounds.com"
                className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
              >
                hello@getsoulsounds.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
