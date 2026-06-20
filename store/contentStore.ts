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
import { getApiErrorMessage } from "@/lib/api-utils";
import api from "@/lib/axios";
import { apiEndpoints } from "@/lib/endpoints";
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
        if (get().faqsFetched) return;
        setStoreLoading(set, "fetchFaqs", true, { errorMessage: "" });

        try {
          const { data } = await api.get<{
            faqs?: Array<{ id?: string; _id?: string; question: string; answer: string }>;
          }>(apiEndpoints.content.faq, { skipAuth: true });
          const faqs = (data.faqs ?? []).map(item =>
            mapFaq({
              id: String(item.id ?? item._id ?? ""),
              question: item.question,
              answer: item.answer,
            }),
          );
          set({ faqs, faqsFetched: true, errorMessage: "" });
        } catch (error) {
          set({
            faqs: [],
            faqsFetched: true,
            errorMessage: getApiErrorMessage(error, "Failed to load FAQs"),
          });
        } finally {
          setStoreLoading(set, "fetchFaqs", false);
        }
      },

      fetchHeaders: async locale => {
        if (get().headersFetched && get().contentLocale === locale) return;
        setStoreLoading(set, "fetchHeaders", true, { errorMessage: "" });

        try {
          const { data } = await api.get<{
            headers?: Array<Record<string, unknown>>;
          }>(apiEndpoints.content.header, { skipAuth: true });
          const headers = (data.headers ?? []).map(item =>
            mapHeader(item, locale),
          );
          set({
            headers: headers.length > 0 ? headers : [mapHeader(null, locale)],
            headersFetched: true,
            contentLocale: locale,
            errorMessage: "",
          });
        } catch (error) {
          set({
            headers: [mapHeader(null, locale)],
            headersFetched: true,
            contentLocale: locale,
            errorMessage: getApiErrorMessage(error, "Failed to load headers"),
          });
        } finally {
          setStoreLoading(set, "fetchHeaders", false);
        }
      },

      fetchSliders: async locale => {
        if (get().slidersFetched && get().contentLocale === locale) return;
        setStoreLoading(set, "fetchSliders", true, { errorMessage: "" });

        try {
          const { data } = await api.get<{
            sliders?: Array<Record<string, unknown>>;
          }>(apiEndpoints.content.slider, { skipAuth: true });
          const slides = mapSliderSlides(data.sliders ?? [], locale);
          set({
            slides,
            slidersFetched: true,
            contentLocale: locale,
            errorMessage: "",
          });
        } catch (error) {
          set({
            slides: mapSliderSlides([], locale),
            slidersFetched: true,
            contentLocale: locale,
            errorMessage: getApiErrorMessage(error, "Failed to load sliders"),
          });
        } finally {
          setStoreLoading(set, "fetchSliders", false);
        }
      },

      fetchContact: async () => {
        if (get().contactFetched) return;
        setStoreLoading(set, "fetchContact", true, { errorMessage: "" });

        try {
          const { data } = await api.get<{ contact?: Record<string, unknown> | null }>(
            apiEndpoints.content.contact,
            { skipAuth: true },
          );
          set({
            contact: mapContact(data.contact),
            contactFetched: true,
            errorMessage: "",
          });
        } catch (error) {
          set({
            contact: mapContact(null),
            contactFetched: true,
            errorMessage: getApiErrorMessage(error, "Failed to load contact"),
          });
        } finally {
          setStoreLoading(set, "fetchContact", false);
        }
      },

      fetchRecommendations: async locale => {
        if (get().recommendationsFetched && get().contentLocale === locale) {
          return;
        }
        setStoreLoading(set, "fetchRecommendations", true, { errorMessage: "" });

        try {
          const { data } = await api.get<{
            recommendations?: Array<Record<string, unknown>>;
          }>(apiEndpoints.content.recommendations, { skipAuth: true });
          const recommendations = (data.recommendations ?? []).map(item =>
            mapRecommendation(item, locale),
          );
          set({
            recommendations:
              recommendations.length > 0
                ? recommendations
                : [mapRecommendation(null, locale)],
            recommendationsFetched: true,
            contentLocale: locale,
            errorMessage: "",
          });
        } catch (error) {
          set({
            recommendations: [mapRecommendation(null, locale)],
            recommendationsFetched: true,
            contentLocale: locale,
            errorMessage: getApiErrorMessage(
              error,
              "Failed to load recommendations",
            ),
          });
        } finally {
          setStoreLoading(set, "fetchRecommendations", false);
        }
      },

      fetchAll: async locale => {
        setStoreLoading(set, "fetchAll", true);
        await Promise.all([
          get().fetchFaqs(),
          get().fetchHeaders(locale),
          get().fetchSliders(locale),
          get().fetchContact(),
          get().fetchRecommendations(locale),
        ]);
        set({ contentLocale: locale });
        setStoreLoading(set, "fetchAll", false);
      },
    }),
    withStoreDevtools("content"),
  ),
);

export default useContentStore;
