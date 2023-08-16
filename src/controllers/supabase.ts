import supabase from "../utils/db";

export const readAIData = async (aid: string) => {
  try {
    const { data, error } = await supabase
      .from("ai_character")
      .select("name, bio")
      .eq("id", aid);

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

export const updateAIWithEmbedding = async ({
  embedding,
  aid,
}: {
  embedding: number[];
  aid: string;
}) => {
  try {
    const { error } = await supabase
      .from("ai_character")
      .update({ vector: JSON.stringify(embedding) })
      .eq("id", aid);

    if (error) throw new Error(error.message);
  } catch (error) {
    throw new Error(
      `Error occurred adding embedding for AID: ${aid}. Error: ${error}`
    );
  }
};
