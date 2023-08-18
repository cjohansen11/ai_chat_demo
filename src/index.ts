import express, { Request, Response, json } from "express";
import * as supabaseController from "./controllers/supabase";
import * as openaiController from "./controllers/openai";

const app = express();

app.use(json());

app.get("/", async (req, res) => {
  res.status(200).send("Online");
});

app.post(
  `/chat/:aid`,
  async (
    req: Request<
      { aiId: string },
      Record<string, unknown>,
      { message: string; userId: string }
    >,
    res: Response
  ) => {
    try {
      const { aiId } = req.params;
      const { message, userId } = req.body;
      const { bio: aiBio } = await supabaseController.readAIData(aiId);

      const userInput = `[USER: ${userId}] [AiID: ${aiId}] ${message}`;

      const embedding = await openaiController.createEmbeddings({
        input: userInput,
        userId,
      });

      const relatedMessages = await supabaseController.queryEmbeddings({
        embedding,
      });

      const latestMessages = await supabaseController.readLatestMessages({
        userId,
      });

      const messageId = await supabaseController.createMessage({
        userId,
        aiId: +aiId,
        message,
        sentByUser: true,
      });

      const embeddingId = await supabaseController.insertEmbedding({
        aiId: +aiId,
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
          ...relatedMessages,
          ...latestMessages,
          { role: "user", content: message },
        ],
      });

      const chatResponseEmbedding = await openaiController.createEmbeddings({
        input: `[USER: ${aiId}] [AiID: ${aiId}] ${response}`,
        userId,
      });

      const responseMessageId = await supabaseController.createMessage({
        userId,
        aiId: +aiId,
        message: response,
        sentByUser: false,
      });

      const responseEmbdeddingId = await supabaseController.insertEmbedding({
        embedding: chatResponseEmbedding,
        aiId: +aiId,
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

app.post(
  "/shared-knowledge",
  async (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      { info: string }
    >,
    res: Response
  ) => {
    try {
      const { info } = req.body;

      const infoEmbedding = await openaiController.createEmbeddings({
        input: info,
      });

      await supabaseController.insertEmbedding({ embedding: infoEmbedding });

      res.status(200).send("Successfully saved shared knowledge");
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  }
);

app.listen(3000, () => console.log(`Server is listening on port 3000`));
