"use client";

import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import CheckoutField from "@/components/commerce/CheckoutField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStoreInitOnce } from "@/hooks/use-store-init";
import useContentStore from "@/store/contentStore";
import { Instagram, Mail, MapPin, Phone, Send } from "lucide-react";
import { useTranslations } from "next-intl";

const FALLBACK_PHONES = ["+98 918 123 4986"];
const FALLBACK_EMAIL = "support@storefront.demo";

export default function ContactPageContent() {
  const t = useTranslations("contact");
  const contact = useContentStore(state => state.contact);
  const fetchContact = useContentStore(state => state.fetchContact);
  const isLoading = useContentStore(state => state.loading.fetchContact);

  useStoreInitOnce(() => fetchContact(), [fetchContact]);

  const phones =
    contact.phones.length > 0 ? contact.phones : FALLBACK_PHONES;

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle>{t("sendMessage")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <CheckoutField
              label={t("fullName")}
              name="name"
              placeholder={t("fullNamePlaceholder")}
            />
            <CheckoutField
              label={t("email")}
              name="email"
              placeholder={t("emailPlaceholder")}
              type="email"
            />
            <CheckoutField
              label={t("subject")}
              name="subject"
              placeholder={t("subjectPlaceholder")}
            />
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="message">{t("message")}</Label>
              <Textarea
                id="message"
                name="message"
                className="min-h-32 resize-none"
                placeholder={t("messagePlaceholder")}
              />
            </div>
            <Button className="sm:col-span-2">{t("submit")}</Button>
          </CardContent>
        </Card>

        <Card className="rounded-md">
          <CardHeader>
            <CardTitle>{t("contactDetails")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            {isLoading ? (
              <p>{t("loading")}</p>
            ) : (
              <>
                {phones.map(phone => (
                  <p
                    key={phone}
                    className="flex items-start gap-3">
                    <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                    <a
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      dir="ltr"
                      className="hover:text-primary">
                      {phone}
                    </a>
                  </p>
                ))}
                <p className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{FALLBACK_EMAIL}</span>
                </p>
                {contact.instagram ? (
                  <p className="flex items-start gap-3">
                    <Instagram className="mt-0.5 size-4 shrink-0 text-primary" />
                    <a
                      href={contact.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary">
                      Instagram
                    </a>
                  </p>
                ) : null}
                {contact.telegram ? (
                  <p className="flex items-start gap-3">
                    <Send className="mt-0.5 size-4 shrink-0 text-primary" />
                    <a
                      href={contact.telegram}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary">
                      Telegram
                    </a>
                  </p>
                ) : null}
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{t("address")}</span>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}
