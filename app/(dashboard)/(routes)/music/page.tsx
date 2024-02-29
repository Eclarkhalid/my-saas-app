"use client"

import * as z from "zod"

import Heading from "@/components/heading";
import { MessageSquare, Music } from "lucide-react";
import { useForm } from "react-hook-form";

import { formSchema } from "./constants";
import axios from "axios";

import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import OpenAI from "openai";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { useProModal } from "@/hooks/use-pro-modal";

const MusicPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const router = useRouter();
  const proModal = useProModal();

  const [music, setMusic] = useState<string>()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setMusic(undefined);
      const response = await axios.post("/api/music", values);
      setMusic(response.data.audio);

      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      }
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  function formatTextForReadability(content: string | null) {
    // Check if content is not null before applying formatting
    if (content !== null) {
      // Add your custom formatting logic here
      // For example, insert line breaks after each full stop
      return content.replace(/\.\s/g, '.\n');
    }

    // If content is null, return an empty string or handle it accordingly
    return '';
  }


  return <>
    <Heading title="Music Generation"
      description="Turn your prompt into music!"
      icon={Music}
      iconColor="text-emerald-500"
      bgColour="bg-emerald-500/50"
    />

    <div className="px-4 lg:px-8">
      <div className="sticky top-16 z-50 bg-white ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-lg border border-emerald-500/30 w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
            <FormField name="prompt" render={({ field }) => (
              <FormItem className="col-span-12 lg:col-span-10">
                <FormControl className="m-0 p-0">
                  <Input className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading} placeholder="Enter your prompt here" {...field} />
                </FormControl>
              </FormItem>
            )} />
            <Button type="submit" className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>Generate</Button>
          </form>
        </Form>
      </div>
      <div className="space-y-4 mt-4">

        {!music && !isLoading && (
          <Empty label="No generated yet" />
        )}
        {music && (
          <audio src={music} controls className="w-full mt-8" />
        )}

        {isLoading && (
          <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
            <Loader />
          </div>
        )}
      </div>
    </div>
  </>;
}

export default MusicPage;