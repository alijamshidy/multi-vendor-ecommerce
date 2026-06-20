import type {
  ApiShopContact,
  ApiShopFaq,
  ApiShopHeader,
  ApiShopRecommendation,
  ApiShopSlider,
} from "@/lib/api-types";
import { getApiErrorMessage } from "@/lib/api-utils";
import api from "@/lib/axios";
import { apiEndpoints } from "@/lib/endpoints";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";
import { createStoreLoadingState, setStoreLoading } from "./store-utils";

type ManageAction =
  | "fetchFaqs"
  | "saveFaq"
  | "deleteFaq"
  | "fetchHeaders"
  | "saveHeader"
  | "deleteHeader"
  | "uploadHeaderImage"
  | "fetchSliders"
  | "saveSlider"
  | "deleteSlider"
  | "uploadSliderImage"
  | "fetchContacts"
  | "saveContact"
  | "deleteContact"
  | "fetchRecommendations"
  | "saveRecommendation"
  | "deleteRecommendation"
  | "uploadRecommendationImage";

type ContentManagementState = {
  faqs: ApiShopFaq[];
  headers: ApiShopHeader[];
  sliders: ApiShopSlider[];
  contacts: ApiShopContact[];
  recommendations: ApiShopRecommendation[];
  errorMessage: string;
  successMessage: string;
  loading: Record<ManageAction, boolean>;
  fetchFaqs: () => Promise<void>;
  createFaq: (payload: { question: string; answer: string }) => Promise<void>;
  updateFaq: (
    id: string,
    payload: { question: string; answer: string },
  ) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;
  fetchHeaders: () => Promise<void>;
  createHeader: (payload: {
    text?: string;
    color?: string;
  }) => Promise<string | null>;
  updateHeader: (
    id: string,
    payload: { text?: string; color?: string },
  ) => Promise<void>;
  deleteHeader: (id: string) => Promise<void>;
  uploadHeaderImage: (
    id: string,
    payload: { image: File; related_link?: string },
  ) => Promise<void>;
  fetchSliders: () => Promise<void>;
  createSlider: (payload: { text?: string; color?: string }) => Promise<string | null>;
  updateSlider: (
    id: string,
    payload: { text?: string; color?: string },
  ) => Promise<void>;
  deleteSlider: (id: string) => Promise<void>;
  uploadSliderImage: (
    id: string,
    payload: { image: File; related_link?: string; text?: string },
  ) => Promise<void>;
  fetchContacts: () => Promise<void>;
  createContact: (payload: Record<string, unknown>) => Promise<void>;
  updateContact: (
    id: string,
    payload: Record<string, unknown>,
  ) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  fetchRecommendations: () => Promise<void>;
  createRecommendation: (payload: Record<string, unknown>) => Promise<string | null>;
  updateRecommendation: (
    id: string,
    payload: Record<string, unknown>,
  ) => Promise<void>;
  deleteRecommendation: (id: string) => Promise<void>;
  uploadRecommendationImage: (
    id: string,
    payload: { image: File; related_link?: string },
  ) => Promise<void>;
  clearMessages: () => void;
};

function mapFaqItem(item: Record<string, unknown>): ApiShopFaq {
  return {
    id: String(item.id ?? item._id ?? ""),
    question: String(item.question ?? ""),
    answer: String(item.answer ?? ""),
  };
}

function mapHeaderItem(item: Record<string, unknown>): ApiShopHeader {
  return {
    id: String(item.id ?? item._id ?? ""),
    text: typeof item.text === "string" ? item.text : undefined,
    color: typeof item.color === "string" ? item.color : undefined,
    image:
      typeof item.image === "string"
        ? { image: item.image, related_link: item.related_link ?? null }
        : undefined,
  };
}

function mapSliderItem(item: Record<string, unknown>): ApiShopSlider {
  return {
    id: String(item.id ?? item._id ?? ""),
    text: typeof item.text === "string" ? item.text : undefined,
    color: typeof item.color === "string" ? item.color : undefined,
    position: typeof item.position === "number" ? item.position : undefined,
    images: Array.isArray(item.images)
      ? (item.images as ApiShopSlider["images"])
      : [],
  };
}

function mapContactItem(item: Record<string, unknown>): ApiShopContact {
  return {
    id: String(item.id ?? item._id ?? ""),
    instagram_channel:
      typeof item.instagram_channel === "string"
        ? item.instagram_channel
        : null,
    telegram_channel:
      typeof item.telegram_channel === "string" ? item.telegram_channel : null,
    contact_number:
      typeof item.contact_number === "string" ? item.contact_number : null,
    contact_number_2:
      typeof item.contact_number_2 === "string" ? item.contact_number_2 : null,
  };
}

function mapRecommendationItem(
  item: Record<string, unknown>,
): ApiShopRecommendation {
  return {
    id: item.id ?? item._id,
    text: typeof item.text === "string" ? item.text : undefined,
    color: typeof item.color === "string" ? item.color : undefined,
    related_link:
      typeof item.related_link === "string" ? item.related_link : null,
    image: typeof item.image === "string" ? item.image : undefined,
  };
}

const useContentManagementStore = create<ContentManagementState>()(
  devtools(
    (set, get) => ({
      faqs: [],
      headers: [],
      sliders: [],
      contacts: [],
      recommendations: [],
      errorMessage: "",
      successMessage: "",
      loading: createStoreLoadingState([
        "fetchFaqs",
        "saveFaq",
        "deleteFaq",
        "fetchHeaders",
        "saveHeader",
        "deleteHeader",
        "uploadHeaderImage",
        "fetchSliders",
        "saveSlider",
        "deleteSlider",
        "uploadSliderImage",
        "fetchContacts",
        "saveContact",
        "deleteContact",
        "fetchRecommendations",
        "saveRecommendation",
        "deleteRecommendation",
        "uploadRecommendationImage",
      ] as const),

      clearMessages: () => set({ errorMessage: "", successMessage: "" }),

      fetchFaqs: async () => {
        setStoreLoading(set, "fetchFaqs", true, { errorMessage: "" });
        try {
          const { data } = await api.get<{ faqs?: Array<Record<string, unknown>> }>(
            apiEndpoints.content.manageFaq,
          );
          set({ faqs: (data.faqs ?? []).map(mapFaqItem) });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Failed to load FAQs"),
            faqs: [],
          });
        } finally {
          setStoreLoading(set, "fetchFaqs", false);
        }
      },

      createFaq: async payload => {
        setStoreLoading(set, "saveFaq", true, { errorMessage: "" });
        try {
          await api.post(apiEndpoints.content.manageFaq, payload);
          set({ successMessage: "FAQ created" });
          await get().fetchFaqs();
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to create FAQ");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "saveFaq", false);
        }
      },

      updateFaq: async (id, payload) => {
        setStoreLoading(set, "saveFaq", true, { errorMessage: "" });
        try {
          await api.patch(apiEndpoints.content.manageFaqById(id), payload);
          set({ successMessage: "FAQ updated" });
          await get().fetchFaqs();
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to update FAQ");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "saveFaq", false);
        }
      },

      deleteFaq: async id => {
        setStoreLoading(set, "deleteFaq", true, { errorMessage: "" });
        try {
          await api.delete(apiEndpoints.content.manageFaqById(id));
          set({ successMessage: "FAQ deleted" });
          await get().fetchFaqs();
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to delete FAQ");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "deleteFaq", false);
        }
      },

      fetchHeaders: async () => {
        setStoreLoading(set, "fetchHeaders", true, { errorMessage: "" });
        try {
          const { data } = await api.get<{ headers?: Array<Record<string, unknown>> }>(
            apiEndpoints.content.manageHeader,
          );
          set({ headers: (data.headers ?? []).map(mapHeaderItem) });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Failed to load headers"),
            headers: [],
          });
        } finally {
          setStoreLoading(set, "fetchHeaders", false);
        }
      },

      createHeader: async payload => {
        setStoreLoading(set, "saveHeader", true, { errorMessage: "" });
        try {
          const { data } = await api.post<{ header?: Record<string, unknown> }>(
            apiEndpoints.content.manageHeader,
            payload,
          );
          set({ successMessage: "Header created" });
          await get().fetchHeaders();
          return data.header
            ? String(data.header.id ?? data.header._id ?? "")
            : null;
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to create header");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "saveHeader", false);
        }
      },

      updateHeader: async (id, payload) => {
        setStoreLoading(set, "saveHeader", true, { errorMessage: "" });
        try {
          await api.patch(apiEndpoints.content.manageHeaderById(id), payload);
          set({ successMessage: "Header updated" });
          await get().fetchHeaders();
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to update header");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "saveHeader", false);
        }
      },

      deleteHeader: async id => {
        setStoreLoading(set, "deleteHeader", true, { errorMessage: "" });
        try {
          await api.delete(apiEndpoints.content.manageHeaderById(id));
          set({ successMessage: "Header deleted" });
          await get().fetchHeaders();
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to delete header");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "deleteHeader", false);
        }
      },

      uploadHeaderImage: async (id, payload) => {
        setStoreLoading(set, "uploadHeaderImage", true, { errorMessage: "" });
        try {
          const formData = new FormData();
          formData.append("image", payload.image);
          if (payload.related_link) {
            formData.append("related_link", payload.related_link);
          }
          await api.post(apiEndpoints.content.manageHeaderImage(id), formData);
          set({ successMessage: "Header image uploaded" });
          await get().fetchHeaders();
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to upload image");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "uploadHeaderImage", false);
        }
      },

      fetchSliders: async () => {
        setStoreLoading(set, "fetchSliders", true, { errorMessage: "" });
        try {
          const { data } = await api.get<{ sliders?: Array<Record<string, unknown>> }>(
            apiEndpoints.content.manageSlider,
          );
          set({ sliders: (data.sliders ?? []).map(mapSliderItem) });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Failed to load sliders"),
            sliders: [],
          });
        } finally {
          setStoreLoading(set, "fetchSliders", false);
        }
      },

      createSlider: async payload => {
        setStoreLoading(set, "saveSlider", true, { errorMessage: "" });
        try {
          const { data } = await api.post<{ slider?: Record<string, unknown> }>(
            apiEndpoints.content.manageSlider,
            payload,
          );
          set({ successMessage: "Slider created" });
          await get().fetchSliders();
          return data.slider
            ? String(data.slider.id ?? data.slider._id ?? "")
            : null;
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to create slider");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "saveSlider", false);
        }
      },

      updateSlider: async (id, payload) => {
        setStoreLoading(set, "saveSlider", true, { errorMessage: "" });
        try {
          await api.patch(apiEndpoints.content.manageSliderById(id), payload);
          set({ successMessage: "Slider updated" });
          await get().fetchSliders();
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to update slider");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "saveSlider", false);
        }
      },

      deleteSlider: async id => {
        setStoreLoading(set, "deleteSlider", true, { errorMessage: "" });
        try {
          await api.delete(apiEndpoints.content.manageSliderById(id));
          set({ successMessage: "Slider deleted" });
          await get().fetchSliders();
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to delete slider");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "deleteSlider", false);
        }
      },

      uploadSliderImage: async (id, payload) => {
        setStoreLoading(set, "uploadSliderImage", true, { errorMessage: "" });
        try {
          const formData = new FormData();
          formData.append("image", payload.image);
          if (payload.related_link) formData.append("related_link", payload.related_link);
          if (payload.text) formData.append("text", payload.text);
          await api.post(apiEndpoints.content.manageSliderImage(id), formData);
          set({ successMessage: "Slider image uploaded" });
          await get().fetchSliders();
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to upload image");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "uploadSliderImage", false);
        }
      },

      fetchContacts: async () => {
        setStoreLoading(set, "fetchContacts", true, { errorMessage: "" });
        try {
          const { data } = await api.get<{ contacts?: Array<Record<string, unknown>> }>(
            apiEndpoints.content.manageContact,
          );
          set({ contacts: (data.contacts ?? []).map(mapContactItem) });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Failed to load contacts"),
            contacts: [],
          });
        } finally {
          setStoreLoading(set, "fetchContacts", false);
        }
      },

      createContact: async payload => {
        setStoreLoading(set, "saveContact", true, { errorMessage: "" });
        try {
          await api.post(apiEndpoints.content.manageContact, payload);
          set({ successMessage: "Contact created" });
          await get().fetchContacts();
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to create contact");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "saveContact", false);
        }
      },

      updateContact: async (id, payload) => {
        setStoreLoading(set, "saveContact", true, { errorMessage: "" });
        try {
          await api.patch(apiEndpoints.content.manageContactById(id), payload);
          set({ successMessage: "Contact updated" });
          await get().fetchContacts();
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to update contact");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "saveContact", false);
        }
      },

      deleteContact: async id => {
        setStoreLoading(set, "deleteContact", true, { errorMessage: "" });
        try {
          await api.delete(apiEndpoints.content.manageContactById(id));
          set({ successMessage: "Contact deleted" });
          await get().fetchContacts();
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to delete contact");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "deleteContact", false);
        }
      },

      fetchRecommendations: async () => {
        setStoreLoading(set, "fetchRecommendations", true, { errorMessage: "" });
        try {
          const { data } = await api.get<{
            recommendations?: Array<Record<string, unknown>>;
          }>(apiEndpoints.content.manageRecommendation);
          set({
            recommendations: (data.recommendations ?? []).map(mapRecommendationItem),
          });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(
              error,
              "Failed to load recommendations",
            ),
            recommendations: [],
          });
        } finally {
          setStoreLoading(set, "fetchRecommendations", false);
        }
      },

      createRecommendation: async payload => {
        setStoreLoading(set, "saveRecommendation", true, { errorMessage: "" });
        try {
          const { data } = await api.post<{ recommendation?: Record<string, unknown> }>(
            apiEndpoints.content.manageRecommendation,
            payload,
          );
          set({ successMessage: "Recommendation created" });
          await get().fetchRecommendations();
          return data.recommendation
            ? String(data.recommendation.id ?? data.recommendation._id ?? "")
            : null;
        } catch (error) {
          const message = getApiErrorMessage(
            error,
            "Failed to create recommendation",
          );
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "saveRecommendation", false);
        }
      },

      updateRecommendation: async (id, payload) => {
        setStoreLoading(set, "saveRecommendation", true, { errorMessage: "" });
        try {
          await api.patch(
            apiEndpoints.content.manageRecommendationById(id),
            payload,
          );
          set({ successMessage: "Recommendation updated" });
          await get().fetchRecommendations();
        } catch (error) {
          const message = getApiErrorMessage(
            error,
            "Failed to update recommendation",
          );
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "saveRecommendation", false);
        }
      },

      deleteRecommendation: async id => {
        setStoreLoading(set, "deleteRecommendation", true, { errorMessage: "" });
        try {
          await api.delete(apiEndpoints.content.manageRecommendationById(id));
          set({ successMessage: "Recommendation deleted" });
          await get().fetchRecommendations();
        } catch (error) {
          const message = getApiErrorMessage(
            error,
            "Failed to delete recommendation",
          );
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "deleteRecommendation", false);
        }
      },

      uploadRecommendationImage: async (id, payload) => {
        setStoreLoading(set, "uploadRecommendationImage", true, {
          errorMessage: "",
        });
        try {
          const formData = new FormData();
          formData.append("image", payload.image);
          if (payload.related_link) {
            formData.append("related_link", payload.related_link);
          }
          await api.post(
            apiEndpoints.content.manageRecommendationImage(id),
            formData,
          );
          set({ successMessage: "Recommendation image uploaded" });
          await get().fetchRecommendations();
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to upload image");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "uploadRecommendationImage", false);
        }
      },
    }),
    withStoreDevtools("contentManagement"),
  ),
);

export default useContentManagementStore;
