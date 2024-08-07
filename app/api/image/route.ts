import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { ChatCompletion, ChatCompletionMessage } from "openai/resources/index.mjs";

import { increaseApiLimit, checkApiLimit  } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export async function POST(
  req: Request,
): Promise<NextResponse>  {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = 512 * 512 } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai) {
      return new NextResponse("Open AI is not configured", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("No prompt provided", { status: 400 });
    }
    if (!amount) {
      return new NextResponse("No amount provided", { status: 400 });
    }
    if (!resolution) {
      return new NextResponse("No resolution provided", { status: 400 });
    }
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired", { status: 403 });
    }

    const response = await openai.images.generate({
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });
    if (!isPro) {
      await increaseApiLimit();
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}