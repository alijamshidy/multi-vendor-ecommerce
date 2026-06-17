"use client";

import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStoreInit } from "@/hooks/use-store-init";
import { resolveMediaUrl } from "@/lib/api-utils";
import useAuthStore from "@/store/authStore";
import usePaymentStore from "@/store/paymentStore";
import useUserStore from "@/store/userStore";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function ProfilePageContent() {
  const t = useTranslations("profile");
  const user = useAuthStore(state => state.user);
  const profile = useUserStore(state => state.profile);
  const fetchProfile = useUserStore(state => state.fetchProfile);
  const updateProfile = useUserStore(state => state.updateProfile);
  const uploadProfileImage = useUserStore(state => state.uploadProfileImage);
  const createStripeConnect = usePaymentStore(state => state.createStripeConnect);
  const isUpdating = useUserStore(state => state.loading.updateProfile);
  const isUploading = useUserStore(state => state.loading.uploadImage);
  const isStripeLoading = usePaymentStore(
    state => state.loading.createStripeConnect,
  );
  const [shopName, setShopName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useStoreInit(async () => {
    await fetchProfile();
    const currentShop = useUserStore.getState().profile?.shopName;
    if (currentShop) setShopName(currentShop);
  });

  const displayName =
    profile?.full_name ?? profile?.name ?? user?.name ?? t("guest");
  const displayEmail = profile?.email ?? user?.email ?? "";
  const imageUrl = resolveMediaUrl(profile?.image);
  const isSeller = user?.role === "seller";

  const handleProfileSave = async () => {
    if (!isSeller) return;

    try {
      await updateProfile({ shopName });
      toast.success(t("profileUpdated"));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("profileUpdateFailed"),
      );
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      await uploadProfileImage(file);
      toast.success(t("imageUploaded"));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("imageUploadFailed"),
      );
    }
  };

  const handleStripeConnect = async () => {
    try {
      const url = await createStripeConnect();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("stripeConnectFailed"),
      );
    }
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle>{t("accountInfo")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarImage
                  src={imageUrl}
                  alt={displayName}
                />
                <AvatarFallback>{displayName.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{displayName}</p>
                <p className="text-sm text-muted-foreground">{displayEmail}</p>
                {user?.role ? (
                  <p className="text-sm capitalize text-muted-foreground">
                    {user.role}
                  </p>
                ) : null}
              </div>
            </div>

            {isSeller ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shopName">{t("shopName")}</Label>
                  <Input
                    id="shopName"
                    value={shopName}
                    onChange={event => setShopName(event.target.value)}
                    placeholder={t("shopNamePlaceholder")}
                  />
                </div>
                <Button
                  disabled={isUpdating}
                  onClick={() => void handleProfileSave()}>
                  {isUpdating ? t("saving") : t("saveProfile")}
                </Button>

                <div className="space-y-2">
                  <Label htmlFor="profileImage">{t("profileImage")}</Label>
                  <Input
                    id="profileImage"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={event => {
                      const file = event.target.files?.[0];
                      if (file) void handleImageUpload(file);
                    }}
                  />
                  {isUploading ? (
                    <p className="text-sm text-muted-foreground">
                      {t("uploading")}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {isSeller ? (
          <Card className="rounded-md">
            <CardHeader>
              <CardTitle>{t("payments")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t("paymentsDescription")}
              </p>
              <Button
                disabled={isStripeLoading}
                onClick={() => void handleStripeConnect()}>
                {isStripeLoading ? t("connecting") : t("connectStripe")}
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </PageShell>
  );
}
