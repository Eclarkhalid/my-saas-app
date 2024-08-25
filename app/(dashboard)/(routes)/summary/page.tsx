"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from 'react-hot-toast';
import { ScaleLoader } from 'react-spinners';
import { useLazyGetSummaryQuery } from "@/services/article";
import { copy, linkIcon, tick } from '@/public/assets';
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MessageSquare } from "lucide-react";
import Heading from "@/components/heading";

interface Article {
  url: string;
  summary: string;
}

const formSchema = z.object({
  url: z.string().url().nonempty(),
});

const Body: React.FC = () => {
  const [article, setArticle] = useState<Article>({ url: '', summary: '' });
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  useEffect(() => {
    const articlesFromLocalStorage = localStorage.getItem('articles');
    if (articlesFromLocalStorage) {
      setAllArticles(JSON.parse(articlesFromLocalStorage));
    }
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { data } = await getSummary({ articleUrl: values.url });

    if (data?.summary) {
      const newArticle = { url: values.url, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];

      setArticle(newArticle);
      setAllArticles(updatedAllArticles);
      localStorage.setItem('articles', JSON.stringify(updatedAllArticles));
      toast.success('Summary Generated!!');
    }
  }

  const handleCopy = (copyText: string) => {
    navigator.clipboard.writeText(copyText);
    setCopied(copyText);
    setTimeout(() => setCopied(null), 4000);
  }

  const handleDelete = (index: number) => {
    const updatedArticles = [...allArticles];
    updatedArticles.splice(index, 1);
    setAllArticles(updatedArticles);
    localStorage.setItem('articles', JSON.stringify(updatedArticles));
  }

  return (
    <div className="px-4 lg:px-8">
      <Heading
        title="Article Summarizer"
        description="Enter a URL to get a quick summary of the article"
        icon={MessageSquare}
        iconColor="text-yellow-500"
        bgColour="bg-yellow-500/10"
      />

      <div className="px-4 lg:px-8">
        <div className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-12 gap-2">
              <FormField
                name="url"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isFetching}
                        placeholder="Enter a URL for the article"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="col-span-12 lg:col-span-2 w-full" disabled={isFetching}>
                Summarize
              </Button>
            </form>
          </Form>
        </div>
      </div>

      <div className="space-y-4 mt-4">
        {isFetching && (
          <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
            <ScaleLoader color="#36d7b7" />
          </div>
        )}

        {error && (
          <div className="p-8 rounded-lg w-full flex items-center justify-center bg-red-100 text-red-800">
            <p>Sorry, an error occurred. Please try again.</p>
          </div>
        )}

        {article.summary && (
          <div className="p-8 rounded-lg w-full bg-white border border-black/10">
            <h2 className="text-xl font-bold mb-2">Summary</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{article.summary}</p>
          </div>
        )}

        {allArticles.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">History</h2>
            <div className="space-y-2">
              {allArticles.map((item, index) => (
                <div 
                  key={`link-${index}`} 
                  className="flex items-center gap-2 p-3 rounded-lg bg-white border border-black/10 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setArticle(item)}
                >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(index);
                    }} 
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-700 truncate">{item.url}</p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(item.summary);
                      }} 
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      {copied === item.summary ? "Copied!" : "Copy Summary"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Body;