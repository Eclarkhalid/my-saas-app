"use client"

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface SummaryResponse {
  summary: string;
}

interface GetSummaryParams {
  articleUrl: string;
}

export const articleApi = createApi({
  reducerPath: 'articleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://article-extractor-and-summarizer.p.rapidapi.com/',
    prepareHeaders: (headers) => {
      const rapidApiKey = process.env.NEXT_PUBLIC_RAPID_API_KEY;
      if (!rapidApiKey) {
        throw new Error('RAPID_API_KEY is not defined in .env.local');
      }
      headers.set('X-RapidAPI-Key', rapidApiKey);
      headers.set('X-RapidAPI-Host', 'article-extractor-and-summarizer.p.rapidapi.com');
      return headers;
    }
  }),
  endpoints: (builder) => ({
    getSummary: builder.query<SummaryResponse, GetSummaryParams>({
      query: (params) => `/summarize?url=${encodeURIComponent(params.articleUrl)}&length=3`
    })
  })
});

export const { useLazyGetSummaryQuery } = articleApi;