import Container from "@/components/global/Container";
import Banner from "@/components/home/Banner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TopCategory from "@/components/home/TopCategory";

export default function page() {
  return (
    <Container className="flex flex-col items-center justify-center">
      <Banner />
      <TopCategory />
      <FeaturedProducts />
    </Container>
  );
}
