import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Soul Sounds" },
      { name: "description", content: "Read the Soul Sounds Terms of Service." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="bg-background relative min-h-screen overflow-hidden">
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-24 sm:py-32">
        <h1 className="font-display text-4xl text-foreground sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Last Updated: June 19, 2026
        </p>

        <div className="mt-16 space-y-10 text-[15px] leading-relaxed text-foreground/80">
          <section>
            <h2 className="font-display mb-3 text-2xl text-foreground">1. Agreement to Terms</h2>
            <p>
              By accessing or using the Soul Sounds website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-foreground">2. Description of Service</h2>
            <p>
              Soul Sounds provides a personalized quiz experience that generates a unique instrumental composition based on your responses. The resulting digital audio file and archetype description are delivered electronically.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-foreground">3. Digital Purchases</h2>
            <p>
              All purchases are for digital goods. Upon successful payment processing via Stripe, you will receive access to your personalized Soul Sound. Prices are listed in U.S. Dollars and are subject to change with notice.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-foreground">4. Intellectual Property</h2>
            <p>
              All content on the Soul Sounds website, including but not limited to text, graphics, logos, and software, is the property of Soul Sounds or its licensors and is protected by intellectual property laws. The personalized Soul Sound delivered to you is licensed for your personal, non-commercial use. You may not redistribute, resell, or publicly perform the composition without prior written consent.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-foreground">5. User Conduct</h2>
            <p>
              You agree to use Soul Sounds only for lawful purposes. You may not attempt to reverse-engineer, interfere with, or disrupt the service or its underlying infrastructure.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-foreground">6. Disclaimer of Warranties</h2>
            <p>
              Soul Sounds is provided “as is” and “as available” without warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, error-free, or that the generated content will meet your specific expectations.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-foreground">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Soul Sounds and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of or inability to use the service. Our total liability shall not exceed the amount you paid for the specific transaction giving rise to the claim.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-foreground">8. Refund Policy</h2>
            <p>
              Because Soul Sounds delivers personalized digital goods that are created on demand, all sales are final. We do not offer refunds except where required by law or in the case of a verified technical failure on our end that prevents delivery.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-foreground">9. Governing Law</h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of the State of Tennessee, without regard to its conflict of law principles. Any disputes arising under these terms shall be resolved in the state or federal courts located in Tennessee.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-foreground">10. Changes to Terms</h2>
            <p>
              We may revise these Terms of Service at any time. The updated terms will be posted on this page with a revised “Last Updated” date. Your continued use of the service after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-foreground">11. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at{" "}
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
