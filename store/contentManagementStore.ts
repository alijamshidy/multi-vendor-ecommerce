import type {
  ApiShopContact,
  ApiShopFaq,
  ApiShopHeader,
  ApiShopRecommendation,
  ApiShopSlider,
} from "@/lib/api-types";
import {
  extractCreatedResourceId,
  getApiErrorMessage,
  unwrapList,
} from "@/lib/api-utils";
import api from "@/lib/axios";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import useContentStore from "./contentStore";
import { withStoreDevtools } from "./devtools";
import { createStoreLoadingState, setStoreLoading } from "./store-utils";

const BASE = "/managements/contents";

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

type ContentImagePayload = {
  image: File;
  related_link?: string;
  text?: string;
  color?: string;
};

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
    payload: ContentImagePayload,
  ) => Promise<void>;
  fetchSliders: () => Promise<void>;
  createSlider: (payload: {
    text?: string;
    color?: string;
    position?: number;
  }) => Promise<string | null>;
  updateSlider: (
    id: string,
    payload: { text?: string; color?: string; position?: number },
  ) => Promise<void>;
  deleteSlider: (id: string) => Promise<void>;
  uploadSliderImage: (
    id: string,
    payload: ContentImagePayload,
  ) => Promise<void>;
  fetchContacts: () => Promise<void>;
  createContact: (payload: Partial<ApiShopContact>) => Promise<void>;
  updateContact: (id: string, payload: Partial<ApiShopContact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  fetchRecommendations: () => Promise<void>;
  createRecommendation: (payload: {
    text?: string;
    color?: string;
    related_link?: string;
  }) => Promise<string | null>;
  updateRecommendation: (
    id: string,
    payload: { text?: string; color?: string; related_link?: string },
  ) => Promise<void>;
  deleteRecommendation: (id: string) => Promise<void>;
  uploadRecommendationImage: (
    id: string,
    payload: ContentImagePayload,
  ) => Promise<void>;
  clearMessages: () => void;
};

function invalidateStorefrontContent() {
  useContentStore.getState().invalidatePublicCache();
}

function appendImageForm(formData: FormData, payload: ContentImagePayload) {
  formData.append("image", payload.image);
  if (payload.related_link) {
    formData.append("related_link", payload.related_link);
  }
  if (payload.text) {
    formData.append("text", payload.text);
  }
  if (payload.color) {
    formData.append("color", payload.color);
  }
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
          const { data } = await api.get(`${BASE}/faq/`);
          set({ faqs: unwrapList<ApiShopFaq>(data) });
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
        setStoreLoading(set, "saveFaq", true, {
          errorMessage: "",
          successMessage: "",
        });
        try {
          await api.post(`${BASE}/faq/`, payload);
          set({ successMessage: "FAQ created" });
          invalidateStorefrontContent();
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
        setStoreLoading(set, "saveFaq", true, {
          errorMessage: "",
          successMessage: "",
        });
        try {
          await api.patch(`${BASE}/faq/${id}/`, payload);
          set({ successMessage: "FAQ updated" });
          invalidateStorefrontContent();
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
          await api.delete(`${BASE}/faq/${id}/`);
          invalidateStorefrontContent();
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
          const { data } = await api.get(`${BASE}/header/`);
          set({ headers: unwrapList<ApiShopHeader>(data) });
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
        setStoreLoading(set, "saveHeader", true, {
          errorMessage: "",
          successMessage: "",
        });
        try {
          const { data } = await api.post(`${BASE}/header/`, payload);
          const id = extractCreatedResourceId(data);
          set({ successMessage: "Header created" });
          invalidateStorefrontContent();
          await get().fetchHeaders();
          return id;
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to create header");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "saveHeader", false);
        }
      },

      updateHeader: async (id, payload) => {
        setStoreLoading(set, "saveHeader", true, {
          errorMessage: "",
          successMessage: "",
        });
        try {
          await api.patch(`${BASE}/header/${id}/`, payload);
          set({ successMessage: "Header updated" });
          invalidateStorefrontContent();
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
          await api.delete(`${BASE}/header/${id}/`);
          invalidateStorefrontContent();
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
          appendImageForm(formData, payload);
          await api.post(`${BASE}/header/${id}/images/`, formData);
          set({ successMessage: "Header image uploaded" });
          invalidateStorefrontContent();
          await get().fetchHeaders();
        } catch (error) {
          const message = getApiErrorMessage(
            error,
            "Failed to upload header image",
          );
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "uploadHeaderImage", false);
        }
      },

      fetchSliders: async () => {
        setStoreLoading(set, "fetchSliders", true, { errorMessage: "" });
        try {
          const { data } = await api.get(`${BASE}/slider/`);
          set({ sliders: unwrapList<ApiShopSlider>(data) });
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
        setStoreLoading(set, "saveSlider", true, {
          errorMessage: "",
          successMessage: "",
        });
        try {
          const { data } = await api.post(`${BASE}/slider/`, {
            position: payload.position ?? 5,
            ...payload,
          });
          const id = extractCreatedResourceId(data);
          set({ successMessage: "Slider created" });
          invalidateStorefrontContent();
          await get().fetchSliders();
          return id;
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to create slider");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "saveSlider", false);
        }
      },

      updateSlider: async (id, payload) => {
        setStoreLoading(set, "saveSlider", true, {
          errorMessage: "",
          successMessage: "",
        });
        try {
          await api.patch(`${BASE}/slider/${id}/`, payload);
          set({ successMessage: "Slider updated" });
          invalidateStorefrontContent();
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
          await api.delete(`${BASE}/slider/${id}/`);
          invalidateStorefrontContent();
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
          appendImageForm(formData, payload);
          await api.post(`${BASE}/slider/${id}/images/`, formData);
          set({ successMessage: "Slider image uploaded" });
          invalidateStorefrontContent();
          await get().fetchSliders();
        } catch (error) {
          const message = getApiErrorMessage(
            error,
            "Failed to upload slider image",
          );
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "uploadSliderImage", false);
        }
      },

      fetchContacts: async () => {
        setStoreLoading(set, "fetchContacts", true, { errorMessage: "" });
        try {
          const { data } = await api.get(`${BASE}/contacts/`);
          set({ contacts: unwrapList<ApiShopContact>(data) });
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
        setStoreLoading(set, "saveContact", true, {
          errorMessage: "",
          successMessage: "",
        });
        try {
          await api.post(`${BASE}/contacts/`, payload);
          set({ successMessage: "Contact saved" });
          invalidateStorefrontContent();
          await get().fetchContacts();
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to save contact");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "saveContact", false);
        }
      },

      updateContact: async (id, payload) => {
        setStoreLoading(set, "saveContact", true, {
          errorMessage: "",
          successMessage: "",
        });
        try {
          await api.patch(`${BASE}/contacts/${id}/`, payload);
          set({ successMessage: "Contact updated" });
          invalidateStorefrontContent();
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
          await api.delete(`${BASE}/contacts/${id}/`);
          invalidateStorefrontContent();
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
          const { data } = await api.get(`${BASE}/recommendation/`);
          set({ recommendations: unwrapList<ApiShopRecommendation>(data) });
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
        setStoreLoading(set, "saveRecommendation", true, {
          errorMessage: "",
          successMessage: "",
        });
        try {
          const { data } = await api.post(`${BASE}/recommendation/`, payload);
          const id = extractCreatedResourceId(data);
          set({ successMessage: "Recommendation created" });
          invalidateStorefrontContent();
          await get().fetchRecommendations();
          return id;
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
        setStoreLoading(set, "saveRecommendation", true, {
          errorMessage: "",
          successMessage: "",
        });
        try {
          await api.patch(`${BASE}/recommendation/${id}/`, payload);
          set({ successMessage: "Recommendation updated" });
          invalidateStorefrontContent();
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
        setStoreLoading(set, "deleteRecommendation", true, {
          errorMessage: "",
        });
        try {
          await api.delete(`${BASE}/recommendation/${id}/`);
          invalidateStorefrontContent();
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
          appendImageForm(formData, payload);
          await api.post(`${BASE}/recommendation/${id}/images/`, formData);
          set({ successMessage: "Recommendation image uploaded" });
          invalidateStorefrontContent();
          await get().fetchRecommendations();
        } catch (error) {
          const message = getApiErrorMessage(
            error,
            "Failed to upload recommendation image",
          );
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
