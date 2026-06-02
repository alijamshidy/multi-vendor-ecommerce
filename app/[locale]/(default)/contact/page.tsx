import CheckoutField from "@/components/commerce/CheckoutField";
import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        description="Questions about orders, sellers, or partnerships? Send us a message."
      />
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle>Send a message</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <CheckoutField
              label="Full name"
              name="name"
              placeholder="Your name"
            />
            <CheckoutField
              label="Email"
              name="email"
              placeholder="you@example.com"
              type="email"
            />
            <CheckoutField
              label="Subject"
              name="subject"
              placeholder="How can we help?"
            />
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                className="min-h-32 resize-none"
                placeholder="Write your message here"
              />
            </div>
            <Button className="sm:col-span-2">Send message</Button>
          </CardContent>
        </Card>

        <Card className="rounded-md">
          <CardHeader>
            <CardTitle>Contact details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>+98 918 123 4986</span>
            </p>
            <p className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>support@storefront.demo</span>
            </p>
            <p className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>Tehran, Iran — Mon–Sat, 9:00–18:00</span>
            </p>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}
