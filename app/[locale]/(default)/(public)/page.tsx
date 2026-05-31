import Container from "@/components/Global/Container";
import Navbar from "@/components/Global/Navbar";
import Banner from "@/components/Home/Banner";
import FeaturedProducts from "@/components/Home/FeaturedProducts";
import TopCategory from "@/components/Home/TopCategory";

export default async function HomePage() {
  return (
    <Container className="flex w-full flex-col gap-6 sm:gap-8">
      <Navbar />
      <Banner />
      <TopCategory />
      <FeaturedProducts />
    </Container>
  );
}
