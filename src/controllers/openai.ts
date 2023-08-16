import openai from "../utils/openai";

export const createEmbeddings = async ({
  input,
  uid,
}: {
  input: string;
  uid: string;
}) => {
  try {
    console.log({ input });

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
