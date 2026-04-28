"use client";
import Container from "@/components/Global/Container";
import Banner from "@/components/Home/Banner";
import FeaturedProducts from "@/components/Home/FeaturedProducts";
import { Label } from "@/components/ui/label";

export default function HomePage() {
  // const userInfo = homeStore(state => state.userInfo);
  // console.log(userInfo);
  return (
    <div className="w-full pt-36">
      <Container className="flex flex-col justify-center items-center gap-y-5">
        <Banner />
        <Label className="text-2xl">Featured Products</Label>
        <FeaturedProducts />
      </Container>
    </div>
  );
}
