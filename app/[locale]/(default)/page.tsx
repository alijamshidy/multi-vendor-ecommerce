import Container from "@/components/Global/Container";
import Navbar from "@/components/Global/Navbar";
import About from "@/components/Home/About";
import Banner from "@/components/Home/Banner";
import Faq from "@/components/Home/Faq";
import FeaturedProducts from "@/components/Home/FeaturedProducts";
import HomeContentInit from "@/components/Home/HomeContentInit";
import Recommendations from "@/components/Home/Recommendations";
import ShopPromo from "@/components/Home/ShopPromo";
import TopCategory from "@/components/Home/TopCategory";
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
      <Recommendations />
      <About />
      <Faq />
    </Container>
  );
}
