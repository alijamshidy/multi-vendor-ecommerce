import Container from "@/components/global/Container";
import Navbar from "@/components/global/Navbar";
import About from "@/components/home/About";
import Banner from "@/components/home/Banner";
import Faq from "@/components/home/Faq";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HomeContentInit from "@/components/home/HomeContentInit";
import HomeProductSections from "@/components/home/HomeProductSections";
import Recommendations from "@/components/home/Recommendations";
import ShopPromo from "@/components/home/ShopPromo";
import TopCategory from "@/components/home/TopCategory";
import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });

  return buildPageMetadata({
    title: t("homeTitle"),
    description: t("homeDescription"),
    locale,
    path: "",
  });
}

export default async function HomePage() {
  return (
    <Container className="flex w-full flex-col gap-6 sm:gap-8 mt-7 lg:mt-0">
      <HomeContentInit />
      <Navbar />
      <ShopPromo />
      <Banner />
      <TopCategory />
      <FeaturedProducts />
      <HomeProductSections />
      <Recommendations />
      <About />
      <Faq />
    </Container>
  );
}
