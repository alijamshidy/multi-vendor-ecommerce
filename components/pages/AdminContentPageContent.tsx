"use client";

import ContactPanel from "@/components/admin/content/ContactPanel";
import FaqPanel from "@/components/admin/content/FaqPanel";
import HeaderPanel from "@/components/admin/content/HeaderPanel";
import RecommendationPanel from "@/components/admin/content/RecommendationPanel";
import SliderPanel from "@/components/admin/content/SliderPanel";
import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";

export default function AdminContentPageContent() {
  const t = useTranslations("adminContent");
  const tAdmin = useTranslations("admin");

  return (
    <PageShell>
      <PageHeader
        eyebrow={tAdmin("adminRole")}
        title={t("title")}
        description={t("description")}
      />
      <Tabs
        defaultValue="faq"
        className="w-full">
        <TabsList className="h-auto w-full flex-wrap">
          <TabsTrigger value="faq">{t("tabFaq")}</TabsTrigger>
          <TabsTrigger value="header">{t("tabHeader")}</TabsTrigger>
          <TabsTrigger value="slider">{t("tabSlider")}</TabsTrigger>
          <TabsTrigger value="contact">{t("tabContact")}</TabsTrigger>
          <TabsTrigger value="recommendations">
            {t("tabRecommendations")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="faq">
          <FaqPanel />
        </TabsContent>
        <TabsContent value="header">
          <HeaderPanel />
        </TabsContent>
        <TabsContent value="slider">
          <SliderPanel />
        </TabsContent>
        <TabsContent value="contact">
          <ContactPanel />
        </TabsContent>
        <TabsContent value="recommendations">
          <RecommendationPanel />
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
