import express, { Request, Response, json } from "express";
import supabase from "./utils/db";
import * as supabaseController from "./controllers/supabase";
import * as openaiController from "./controllers/openai";

const app = express();

app.use(json());

app.get("/", async (req, res) => {
  const { data, error } = await supabase.from("ai_character").select("*");

  if (error) {
    return res.status(500).send("Ooops, something went wrong");
  }
  res.status(200).send(data);
});

app.post(
  `/:aid`,
  async (
    req: Request<
      { aid: string },
      Record<string, unknown>,
      { message: string; uid: string }
    >,
    res: Response
  ) => {
    try {
      const { aid } = req.params;
      const { message, uid } = req.body;

      const { bio: aiBio } = await supabaseController.readAIData(aid);

      const userInput = `[USER: ${uid}] [AID: ${aid}] ${message}`;

      const embedding = await openaiController.createEmbeddings({
        input: userInput,
        uid,
      });

      // await supabaseController.queryEmbeddings({ embedding });

      const latestMessages = await supabaseController.readLatestMessages({
        userId: uid,
      });

      const messageId = await supabaseController.createMessage({
        userId: uid,
        aiId: +aid,
        message,
        sentByUser: true,
      });

      const embeddingId = await supabaseController.insertEmbedding({
        aid: +aid,
        embedding,
        messageId,
      });

      await supabaseController.updateMessage({ messageId, embeddingId });

      const response = await openaiController.createChatCompletion({
        messages: [
          {
            role: "system",
            // Adding context such as how the system should respond is important here. Possibly add it the bio.
            content:
              "Respond in the first person based on the provided bio: " + aiBio,
          },
          ...latestMessages,
          { role: "user", content: message },
        ],
      });

      const chatResponseEmbedding = await openaiController.createEmbeddings({
        input: `[USER: ${aid}] [AID: ${aid}] ${response}`,
        uid,
      });

      const responseMessageId = await supabaseController.createMessage({
        userId: uid,
        aiId: +aid,
        message: response,
        sentByUser: false,
      });

      const responseEmbdeddingId = await supabaseController.insertEmbedding({
        embedding: chatResponseEmbedding,
        aid: +aid,
        messageId: responseMessageId,
      });

      await supabaseController.updateMessage({
        messageId: responseMessageId,
        embeddingId: responseEmbdeddingId,
      });

      res.status(200).send(response);
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  }
);

app.listen(3000, () => console.log(`Server is listening on port 3000`));
