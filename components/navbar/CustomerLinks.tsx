import { links } from "@/utils/links";
import Link from "next/link";
import Container from "../global/Container";

export default function CustomerLinks() {
  return (
    <Container className="flex gap-3">
      {links.map(link => {
        const { href, label } = link;
        return (
          <Link
            className="font-semibold"
            href={href}
            key={label}>
            {label.toUpperCase()}
          </Link>
        );
      })}
    </Container>
  );
}
