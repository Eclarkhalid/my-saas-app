"use client"

import * as z from "zod"

import Heading from "@/components/heading";
import { MessageSquare } from "lucide-react";
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
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { useProModal } from "@/hooks/use-pro-modal";

const Conversation = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const router = useRouter();
  const proModal = useProModal();
  const [messages, setMessages] = useState<ChatCompletionMessage[]>([])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionMessage = {
        role: "user",
        content: values.prompt,
      };

      const newMessages = [...messages, userMessage];

      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      });
      setMessages((current) =>
        [...current, userMessage, response.data]
      );
      form.reset();
    } catch (error: any) {
      if(error?.response?.status === 403) {
        proModal.onOpen();
      }
      console.log("error")
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
    <Heading title="Conversation"
      description="Chat with Our most advanced AI model"
      icon={MessageSquare}
      iconColor="text-violet-500"
      bgColour="bg-violet-500/50"
    />

    <div className="px-4 lg:px-8">
  <div className="sticky top-16 z-50 bg-white ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-lg border border-violet-500/30 w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
            <FormField name="prompt" render={({ field }) => (
              <FormItem className="col-span-12 lg:col-span-10">
                <FormControl className="m-0 p-0">
                  <Input className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading} placeholder="Let's chat! Ask me anything..." {...field} />
                </FormControl>
              </FormItem>
            )} />
            <Button type="submit" className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>Generate</Button>
          </form>
        </Form>
      </div>
      <div className="space-y-4 mt-4">
        
        {messages.length === 0 && !isLoading && (
          <Empty label="No conversation started yet" />
        )}
        <div className="flex flex-col-reverse gap-y-4">
          {messages.slice().reverse().map((message) => (
            <div key={message.content}
              className={cn("p-8 w-full flex items-start gap-x-8 rounded-lg", message.role === "user" ? "bg-white border border-black/10" : "bg-muted")}
            >
              {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
              <p className="text-md whitespace-pre-wrap">
                {formatTextForReadability(message.content)}
              </p>

            </div>
          ))}
        </div>

        {isLoading && (
          <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
            <Loader />
          </div>
        )}
      </div>
    </div>
  </>;
}

export default Conversation;