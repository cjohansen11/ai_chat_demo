import { CreateChatCompletionRequestMessage } from "openai/resources/chat";
import openai from "../utils/openai";

export const createEmbeddings = async ({
  input,
  uid,
}: {
  input: string;
  uid: string;
}) => {
  try {
    const { data } = await openai.embeddings.create({
      input,
      model: process.env.OPENAI_EMBEDDING_MODEL as string,
      user: uid,
    });

    return data[0].embedding;
  } catch (error) {
    throw new Error(
      `Error occured creating embedding: ${(error as Error).message}`
    );
  }
};

export const createChatCompletion = async ({
  messages,
}: {
  messages: CreateChatCompletionRequestMessage[];
}) => {
  try {
    console.log({ messages });
    const { choices } = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k-0613",
      messages,
    });

    const content = choices[0].message.content;

    if (!content) throw new Error(`No content received`);

    return content;
  } catch (error) {
    throw new Error(`Error occurred creating chat completion: ${error}`);
  }
};
