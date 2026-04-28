"use client";

import { LuShare2 } from "react-icons/lu";
import {
  EmailIcon,
  EmailShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function ShareButton({
  productId,
  name,
}: {
  productId: string;
  name: string;
}) {
  const url = process.env.NEXT_PUBLIC_WEBSITE_URL;
  const shareLink = `${url}/products/${productId}`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size={"icon"}
          className="p-2">
          <LuShare2 />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        sideOffset={10}
        className="flex items-center gap-x-2 justify-center w-full">
        <TwitterShareButton
          url={shareLink}
          title={name}>
          <TwitterIcon
            size={32}
            round
          />
        </TwitterShareButton>
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
      </PopoverContent>
    </Popover>
  );
}
