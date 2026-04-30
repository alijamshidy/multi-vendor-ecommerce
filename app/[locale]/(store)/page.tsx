import Container from "@/components/Global/Container";
import Navbar from "@/components/Global/Navbar";
import Banner from "@/components/Home/Banner";
import FeaturedProducts from "@/components/Home/FeaturedProducts";

export default function HomePage() {
  return (
    <div className="w-full pt-36">
      <Container className="flex flex-col justify-center items-center gap-y-5">
        <Navbar />

        <Banner />

        <FeaturedProducts />
      </Container>
    </div>
  );
}
