"use client";

import ContactPanel from "@/components/admin/content/ContactPanel";
import FaqPanel from "@/components/admin/content/FaqPanel";
import HeaderPanel from "@/components/admin/content/HeaderPanel";
import RecommendationPanel from "@/components/admin/content/RecommendationPanel";
import SliderPanel from "@/components/admin/content/SliderPanel";
import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useStoreInit } from "@/hooks/use-store-init";
import useContentManagementStore from "@/store/contentManagementStore";
import {
  HelpCircle,
  ImageIcon,
  Megaphone,
  Phone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

type ContentSectionId =
  | "faq"
  | "header"
  | "slider"
  | "contact"
  | "recommendations";

const SECTIONS: Array<{
  id: ContentSectionId;
  icon: LucideIcon;
  labelKey:
    | "tabFaq"
    | "tabHeader"
    | "tabSlider"
    | "tabContact"
    | "tabRecommendations";
  descKey:
    | "navFaqDesc"
    | "navHeaderDesc"
    | "navSliderDesc"
    | "navContactDesc"
    | "navRecommendationsDesc";
}> = [
  {
    id: "faq",
    icon: HelpCircle,
    labelKey: "tabFaq",
    descKey: "navFaqDesc",
  },
  {
    id: "header",
    icon: Megaphone,
    labelKey: "tabHeader",
    descKey: "navHeaderDesc",
  },
  {
    id: "slider",
    icon: ImageIcon,
    labelKey: "tabSlider",
    descKey: "navSliderDesc",
  },
  {
    id: "contact",
    icon: Phone,
    labelKey: "tabContact",
    descKey: "navContactDesc",
  },
  {
    id: "recommendations",
    icon: Sparkles,
    labelKey: "tabRecommendations",
    descKey: "navRecommendationsDesc",
  },
];

export default function AdminContentPageContent() {
  const t = useTranslations("adminContent");
  const tAdmin = useTranslations("admin");
  const [activeSection, setActiveSection] =
    useState<ContentSectionId>("faq");

  const faqs = useContentManagementStore(state => state.faqs);
  const headers = useContentManagementStore(state => state.headers);
  const sliders = useContentManagementStore(state => state.sliders);
  const contacts = useContentManagementStore(state => state.contacts);
  const recommendations = useContentManagementStore(
    state => state.recommendations,
  );
  const fetchFaqs = useContentManagementStore(state => state.fetchFaqs);
  const fetchHeaders = useContentManagementStore(state => state.fetchHeaders);
  const fetchSliders = useContentManagementStore(state => state.fetchSliders);
  const fetchContacts = useContentManagementStore(state => state.fetchContacts);
  const fetchRecommendations = useContentManagementStore(
    state => state.fetchRecommendations,
  );

  useStoreInit(() => {
    void fetchFaqs();
    void fetchHeaders();
    void fetchSliders();
    void fetchContacts();
    void fetchRecommendations();
  });

  const counts: Record<ContentSectionId, number> = {
    faq: faqs.length,
    header: headers.length,
    slider: sliders.length,
    contact: contacts.length,
    recommendations: recommendations.length,
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow={tAdmin("adminRole")}
        title={t("title")}
        description={t("description")}
      />

      <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
        {t("cmsUnavailable")}
      </p>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,17rem)_1fr]">
        <nav
          aria-label={t("navLabel")}
          className="flex flex-row gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {SECTIONS.map(section => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex min-w-[12rem] flex-col items-start gap-1 rounded-lg border p-3 text-start transition-colors lg:min-w-0 lg:w-full",
                  isActive
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-transparent bg-muted/40 hover:bg-muted/70",
                )}>
                <span className="flex w-full items-center justify-between gap-2">
                  <span className="flex items-center gap-2 font-medium">
                    <Icon
                      className={cn(
                        "size-4 shrink-0",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    {t(section.labelKey)}
                  </span>
                  <Badge
                    variant={isActive ? "default" : "secondary"}
                    className="shrink-0">
                    {counts[section.id]}
                  </Badge>
                </span>
                <span className="ps-6 text-xs text-muted-foreground">
                  {t(section.descKey)}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="min-w-0 rounded-lg border bg-card p-4 sm:p-6">
          {activeSection === "faq" ? <FaqPanel /> : null}
          {activeSection === "header" ? <HeaderPanel /> : null}
          {activeSection === "slider" ? <SliderPanel /> : null}
          {activeSection === "contact" ? <ContactPanel /> : null}
          {activeSection === "recommendations" ? (
            <RecommendationPanel />
          ) : null}
        </div>
      </div>
    </PageShell>
  );
}
