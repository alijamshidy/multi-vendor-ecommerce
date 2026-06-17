"use client";

import { useTranslations } from "next-intl";
import {
  EmailIcon,
  EmailShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  XIcon,
  XShareButton,
} from "react-share";
import { Label } from "../ui/label";

export default function ShareButton({
  productSlug,
  name,
  locale,
}: {
  productSlug: string;
  name: string;
  locale: string;
}) {
  const url = process.env.NEXT_PUBLIC_WEBSITE_URL;
  const shareLink = `${url}/${locale}/products/${encodeURIComponent(productSlug)}`;
  const t = useTranslations("product");
  return (
    <div className="flex items-center gap-2">
      <Label>{t("shareOnSocialMedia")} : </Label>
      <XShareButton
        url={shareLink}
        title={name}>
        <XIcon
          size={32}
          round
        />
      </XShareButton>
      <LinkedinShareButton
        url={shareLink}
        title={name}>
        <LinkedinIcon
          size={32}
          round
        />
      </LinkedinShareButton>
      <EmailShareButton
        url={shareLink}
        title={name}>
        <EmailIcon
          size={32}
          round
        />
      </EmailShareButton>
      <TelegramShareButton
        url={shareLink}
        title={name}>
        <TelegramIcon
          size={32}
          round
        />
      </TelegramShareButton>
    </div>
  );
}
