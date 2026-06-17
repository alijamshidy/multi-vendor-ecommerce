import type {
  ApiShopContact,
  ApiShopFaq,
  ApiShopHeader,
  ApiShopRecommendation,
  ApiShopSlider,
} from "@/lib/api-types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";
import { createStoreLoadingState } from "./store-utils";

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

const cmsError = () => {
  throw new Error("CMS content management is not supported by the marketplace API");
};

const useContentManagementStore = create<ContentManagementState>()(
  devtools(
    set => ({
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

      fetchFaqs: async () => set({ faqs: [] }),
      createFaq: cmsError,
      updateFaq: cmsError,
      deleteFaq: cmsError,
      fetchHeaders: async () => set({ headers: [] }),
      createHeader: async () => cmsError(),
      updateHeader: cmsError,
      deleteHeader: cmsError,
      uploadHeaderImage: cmsError,
      fetchSliders: async () => set({ sliders: [] }),
      createSlider: async () => cmsError(),
      updateSlider: cmsError,
      deleteSlider: cmsError,
      uploadSliderImage: cmsError,
      fetchContacts: async () => set({ contacts: [] }),
      createContact: cmsError,
      updateContact: cmsError,
      deleteContact: cmsError,
      fetchRecommendations: async () => set({ recommendations: [] }),
      createRecommendation: async () => cmsError(),
      updateRecommendation: cmsError,
      deleteRecommendation: cmsError,
      uploadRecommendationImage: cmsError,
    }),
    withStoreDevtools("contentManagement"),
  ),
);

export default useContentManagementStore;
