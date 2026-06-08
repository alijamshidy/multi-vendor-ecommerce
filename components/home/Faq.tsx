"use client";

import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useContentStore from "@/store/contentStore";
import { useTranslations } from "next-intl";

const FALLBACK_FAQ_KEYS = [
  "faq1",
  "faq2",
  "faq3",
  "faq4",
  "faq5",
  "faq6",
] as const;

export default function Faq() {
  const t = useTranslations("home");
  const faqs = useContentStore(state => state.faqs);
  const isLoading = useContentStore(state => state.loading.fetchFaqs);

  const items =
    faqs.length > 0
      ? faqs.map(faq => ({
          value: faq.id,
          question: faq.question,
          answer: faq.answer,
        }))
      : FALLBACK_FAQ_KEYS.map(key => ({
          value: key,
          question: t(`${key}Question`),
          answer: t(`${key}Answer`),
        }));

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("faqEyebrow")}
        title={t("faqTitle")}
        description={t("faqDescription")}
      />
      {isLoading && faqs.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("faqLoading")}</p>
      ) : (
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-3xl">
          {items.map(item => (
            <AccordionItem
              key={item.value}
              value={item.value}>
              <AccordionTrigger className="text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-7">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </PageShell>
  );
}
