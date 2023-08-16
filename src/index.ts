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

      const { name: aiName, bio: aiBio } = await supabaseController.readAIData(
        aid
      );

      const gamertag = await supabaseController.readUserData(uid);

      const input = `[USER: ${uid}] [AID: ${aid}] ${message}`;

      const embedding = await openaiController.createEmbeddings({ input, uid });

      await supabaseController.queryEmbeddings({ embedding });

      await supabaseController.insertEmbedding({ aid, embedding });

      res.status(200).send({});
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  }
);

app.listen(3000, () => console.log(`Server is listening on port 3000`));
