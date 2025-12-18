import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import Container from "../global/Container";
import CustomerLinks from "./CustomerLinks";
import NavSearch from "./NavSearch";

export default function Nav() {
  return (
    <>
      <section>
        <Container className="flex justify-between sm:flex-row sm:justify-between sm:items-center flex-wrap py-5 gap-4  max-w-full xl:max-w-full">
          <Link href={"/"}>
            <Image
              width={150}
              height={20}
              src={`/next.svg`}
              alt=""
              priority
            />
          </Link>
          <CustomerLinks />
        </Container>
      </section>
      <section>
        <Suspense>
          <NavSearch />
        </Suspense>
      </section>
    </>
  );
}
