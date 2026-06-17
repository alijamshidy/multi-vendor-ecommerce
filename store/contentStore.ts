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
        if (get().faqsFetched) return;
        set({ faqs: [], faqsFetched: true });
      },

      fetchHeaders: async locale => {
        if (get().headersFetched && get().contentLocale === locale) return;
        set({
          headers: [mapHeader(null, locale)],
          headersFetched: true,
          contentLocale: locale,
        });
      },

      fetchSliders: async locale => {
        if (get().slidersFetched && get().contentLocale === locale) return;
        set({
          slides: mapSliderSlides([], locale),
          slidersFetched: true,
          contentLocale: locale,
        });
      },

      fetchContact: async () => {
        if (get().contactFetched) return;
        set({ contact: mapContact(null), contactFetched: true });
      },

      fetchRecommendations: async locale => {
        if (get().recommendationsFetched && get().contentLocale === locale) {
          return;
        }
        set({
          recommendations: [mapRecommendation(null, locale)],
          recommendationsFetched: true,
          contentLocale: locale,
        });
      },

      fetchAll: async locale => {
        await Promise.all([
          get().fetchFaqs(),
          get().fetchHeaders(locale),
          get().fetchSliders(locale),
          get().fetchContact(),
          get().fetchRecommendations(locale),
        ]);
        set({ contentLocale: locale });
      },
    }),
    withStoreDevtools("content"),
  ),
);

export default useContentStore;
