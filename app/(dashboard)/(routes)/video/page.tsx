"use client"

import * as z from "zod"

import Heading from "@/components/heading";
import { MessageSquare, Music, Video } from "lucide-react";
import { useForm } from "react-hook-form";

import { formSchema } from "./constants";
import axios from "axios";

import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { useProModal } from "@/hooks/use-pro-modal";

const VideoPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const router = useRouter();
  const proModal = useProModal();

  const [video, setVideo] = useState<string>()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setVideo(undefined);
      const response = await axios.post("/api/video", values);
      setVideo(response.data[0]);

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


  return <>
    <Heading title="Video Generation"
      description="Turn your prompt into video in minutes!"
      icon={Video}
      iconColor="text-orange-700"
      bgColour="bg-orange-700/50"
    />

    <div className="px-4 lg:px-8">
      <div className="sticky top-16 z-50 bg-white ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-lg border border-orange-500/30 w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
            <FormField name="prompt" render={({ field }) => (
              <FormItem className="col-span-12 lg:col-span-10">
                <FormControl className="m-0 p-0">
                  <Input className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading} placeholder="Enter your prompt here..." {...field} />
                </FormControl>
              </FormItem>
            )} />
            <Button type="submit" className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>Generate</Button>
          </form>
        </Form>
      </div>
      <div className="space-y-4 mt-4">

        {!video && !isLoading && (
          <Empty label="No Video generated yet" />
        )}
        {video && (
          <video src={video} controls className="w-full mt-8 rounded-lg border aspect-video bg-black">
            <source src={video} />
          </video>
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

export default VideoPage;