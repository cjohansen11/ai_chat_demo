import supabase from "../utils/db";

export const readAIData = async (aid: string) => {
  try {
    const { data, error } = await supabase
      .from("ai_character")
      .select("name, bio")
      .eq("id", aid);

    if (data?.length === 0) throw new Error(`${aid} not found`);

    if (error) throw new Error(error.message);

    return data[0];
  } catch (error) {
    throw new Error(`Error occurred reading AID: ${aid}. Error: ${error}`);
  }
};

export const readUserData = async (uid: string) => {
  try {
    const { data, error } = await supabase
      .from("user")
      .select("gamertag")
      .eq("id", uid);

    if (error) throw new Error(error.message);

    return data[0].gamertag;
  } catch (error) {
    throw new Error(`Error occurred reading UID: ${uid}. Error: ${error}`);
  }
};

export const insertEmbedding = async ({
  embedding,
  aid,
  messageId,
}: {
  embedding: number[];
  aid: string;
  messageId: string;
}) => {
  try {
    const { error } = await supabase.from("embeddings").upsert({
      ai_character_id: +aid,
      vector: JSON.stringify(embedding),
      message_id: messageId,
    });

    if (error) throw new Error(error.message);
  } catch (error) {
    throw new Error(
      `Error occurred adding embedding for AID: ${aid}. Error: ${error}`
    );
  }
};

export const queryEmbeddings = async ({
  embedding,
}: {
  embedding: number[];
}) => {
  try {
    const { data, error } = await supabase.rpc("get_embeddings", {
      input_vector: JSON.stringify(embedding),
    });
    console.log({ data, error });
  } catch (error) {
    throw new Error(`Error occurred querying embeddings. Error: ${error}`);
  }
};

export const createMessage = async ({
  userId,
  aiId,
  message,
  sentByUser,
}: {
  userId: string;
  aiId: number;
  message: string;
  sentByUser: boolean;
}) => {
  try {
    const { data, error } = await supabase
      .from("message")
      .upsert({
        ai_id: aiId,
        message,
        sent_by_user: sentByUser,
        user_id: userId,
      })
      .select("id");
    console.log({ data });
    if (error) throw new Error(error.message);
  } catch (error) {
    throw new Error(`Error occurred creating a new message. Error: ${error}`);
  }
};
