import type {
  ApiShopContact,
  ApiShopFaq,
  ApiShopHeader,
  ApiShopRecommendation,
  ApiShopSlider,
} from "@/lib/api-types";
import { getApiErrorMessage, unwrapList } from "@/lib/api-utils";
import api from "@/lib/axios";
import {
  mapContact,
  mapFaq,
  mapHeader,
  mapRecommendation,
  mapSliderSlides,
  type ContactView,
  type FaqView,
  type HeaderView,
  type RecommendationView,
  type SlideView,
} from "@/lib/mappers";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";
import { createStoreLoadingState, setStoreLoading } from "./store-utils";

type ContentAction =
  | "fetchFaqs"
  | "fetchHeaders"
  | "fetchSliders"
  | "fetchContact"
  | "fetchRecommendations"
  | "fetchAll";

type ContentState = {
  faqs: FaqView[];
  headers: HeaderView[];
  slides: SlideView[];
  contact: ContactView;
  recommendations: RecommendationView[];
  contentLocale: string | null;
  faqsFetched: boolean;
  headersFetched: boolean;
  slidersFetched: boolean;
  contactFetched: boolean;
  recommendationsFetched: boolean;
  errorMessage: string;
  loading: Record<ContentAction, boolean>;
  fetchFaqs: () => Promise<void>;
  fetchHeaders: (locale: string) => Promise<void>;
  fetchSliders: (locale: string) => Promise<void>;
  fetchContact: () => Promise<void>;
  fetchRecommendations: (locale: string) => Promise<void>;
  fetchAll: (locale: string) => Promise<void>;
  invalidatePublicCache: () => void;
  clearError: () => void;
};

const emptyContact: ContactView = { phones: [] };

const useContentStore = create<ContentState>()(
  devtools(
    (set, get) => ({
      faqs: [],
      headers: [],
      slides: [],
      contact: emptyContact,
      recommendations: [],
      contentLocale: null,
      faqsFetched: false,
      headersFetched: false,
      slidersFetched: false,
      contactFetched: false,
      recommendationsFetched: false,
      errorMessage: "",
      loading: createStoreLoadingState([
        "fetchFaqs",
        "fetchHeaders",
        "fetchSliders",
        "fetchContact",
        "fetchRecommendations",
        "fetchAll",
      ] as const),

      clearError: () => set({ errorMessage: "" }),

      invalidatePublicCache: () =>
        set({
          faqsFetched: false,
          headersFetched: false,
          slidersFetched: false,
          contactFetched: false,
          recommendationsFetched: false,
        }),

      fetchFaqs: async () => {
        const state = get();
        if (state.loading.fetchFaqs || state.faqsFetched) return;

        setStoreLoading(set, "fetchFaqs", true, { errorMessage: "" });

        try {
          const { data } = await api.get("/faq/", { skipAuth: true });
          set({
            faqs: unwrapList<ApiShopFaq>(data).map(mapFaq),
            faqsFetched: true,
          });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Failed to load FAQs"),
            faqs: [],
          });
        } finally {
          setStoreLoading(set, "fetchFaqs", false);
        }
      },

      fetchHeaders: async locale => {
        const state = get();
        if (
          state.loading.fetchHeaders ||
          (state.headersFetched && state.contentLocale === locale)
        ) {
          return;
        }

        setStoreLoading(set, "fetchHeaders", true, { errorMessage: "" });

        try {
          const { data } = await api.get("/header/", { skipAuth: true });
          set({
            headers: unwrapList<ApiShopHeader>(data).map(item =>
              mapHeader(item, locale),
            ),
            headersFetched: true,
            contentLocale: locale,
          });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Failed to load header"),
            headers: [],
          });
        } finally {
          setStoreLoading(set, "fetchHeaders", false);
        }
      },

      fetchSliders: async locale => {
        const state = get();
        if (
          state.loading.fetchSliders ||
          (state.slidersFetched && state.contentLocale === locale)
        ) {
          return;
        }

        setStoreLoading(set, "fetchSliders", true, { errorMessage: "" });

        try {
          const { data } = await api.get("/slider/", { skipAuth: true });
          set({
            slides: mapSliderSlides(
              unwrapList<ApiShopSlider>(data),
              locale,
            ),
            slidersFetched: true,
            contentLocale: locale,
          });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Failed to load slider"),
            slides: [],
          });
        } finally {
          setStoreLoading(set, "fetchSliders", false);
        }
      },

      fetchContact: async () => {
        const state = get();
        if (state.loading.fetchContact || state.contactFetched) return;

        setStoreLoading(set, "fetchContact", true, { errorMessage: "" });

        try {
          const { data } = await api.get<ApiShopContact>("/contact/", {
            skipAuth: true,
          });
          set({ contact: mapContact(data), contactFetched: true });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Failed to load contact"),
            contact: emptyContact,
          });
        } finally {
          setStoreLoading(set, "fetchContact", false);
        }
      },

      fetchRecommendations: async locale => {
        const state = get();
        if (
          state.loading.fetchRecommendations ||
          (state.recommendationsFetched && state.contentLocale === locale)
        ) {
          return;
        }

        setStoreLoading(set, "fetchRecommendations", true, {
          errorMessage: "",
        });

        try {
          const { data } = await api.get("/recommendations/", {
            skipAuth: true,
          });
          set({
            recommendations: unwrapList<ApiShopRecommendation>(data).map(
              item => mapRecommendation(item, locale),
            ),
            recommendationsFetched: true,
            contentLocale: locale,
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

      fetchAll: async locale => {
        const state = get();
        if (state.loading.fetchAll) return;

        const needsRefresh =
          !state.faqsFetched ||
          !state.headersFetched ||
          !state.slidersFetched ||
          !state.contactFetched ||
          !state.recommendationsFetched ||
          state.contentLocale !== locale;

        if (!needsRefresh) return;

        setStoreLoading(set, "fetchAll", true, { errorMessage: "" });

        try {
          await Promise.all([
            get().fetchFaqs(),
            get().fetchHeaders(locale),
            get().fetchSliders(locale),
            get().fetchContact(),
            get().fetchRecommendations(locale),
          ]);
          set({ contentLocale: locale });
        } finally {
          setStoreLoading(set, "fetchAll", false);
        }
      },
    }),
    withStoreDevtools("content"),
  ),
);

export default useContentStore;
