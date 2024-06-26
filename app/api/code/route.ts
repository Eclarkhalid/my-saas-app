import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { ChatCompletion, ChatCompletionMessage } from "openai/resources/index.mjs";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const instructionMessage: ChatCompletionMessage = {
  role: "assistant",
  content: "You are a code generator. You must answer only in markdown code format. Use code comments for explanations."
}

export async function POST(
  req: Request,
): Promise<NextResponse> {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai) {
      return new NextResponse("Open AI is not configured", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("No messages provided", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired", { status: 403 });
    }


    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [instructionMessage, ...messages]
    });

    if (!isPro) {
      await increaseApiLimit();
    }

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
