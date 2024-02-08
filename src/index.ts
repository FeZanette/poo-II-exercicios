import express, { Request, Response } from "express";
import cors from "cors";
// import { db } from "./database/knex";
import { Video } from "./database/models/Video";
import { TVideoDB } from "./database/types";
import { VideoDatabase } from "./database/VideoDatabase";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`);
});

app.get("/ping", async (req: Request, res: Response) => {
  try {
    res.status(200).send({ message: "Pong!" });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.get("/videos", async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;

    // let videosDB: TVideoDB[] = [];

    // if (q) {
    //   videosDB = await db("videos").select().where("title", "LIKE", `%${q}%`);
    // } else {
    //   videosDB = await db("videos").select();
    // }

    const videoDatabase = new VideoDatabase();
    const videoDB = await videoDatabase.findVideos(q);

    const videos: Video[] = [];

    for (let videoDBItem of videoDB) {
      const video = new Video(
        videoDBItem.id,
        videoDBItem.title,
        videoDBItem.duration,
        videoDBItem.uploaded_at
      );
      videos.push(video);
    }

    res.status(200).send(videos);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.post("/videos", async (req: Request, res: Response) => {
  try {
    const { id, title, duration } = req.body;

    if (typeof id !== "string") {
      res.status(400);
      throw new Error("'id' dever ser string");
    }

    if (typeof title !== "string") {
      res.status(400);
      throw new Error("'title' dever ser string");
    }

    if (typeof duration !== "number") {
      res.status(400);
      throw new Error("'duration' dever ser string");
    }

    // const [videoDBExists]: TVideoDB[] = await db("videos").where({ id });

    const videoDatabase = new VideoDatabase();
    const videoDBExists = await videoDatabase.findVideoById(id);

    if (videoDBExists) {
      res.status(400);
      throw new Error("'id' já existe");
    }

    const newVideo = new Video(id, title, duration, new Date().toISOString());

    const newVideoDB: TVideoDB = {
      id: newVideo.getId(),
      title: newVideo.getTitle(),
      duration: newVideo.getDuration(),
      uploaded_at: newVideo.getUploadedAt(),
    };

    // await db("videos").insert(newVideoDB);

    await videoDatabase.insertVideo(newVideoDB);

    res.status(200).send(newVideo);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.put("/videos/:id", async (req: Request, res: Response) => {
  try {
    const idToEdit = req.params.id;
    const id = req.body.id;
    const title = req.body.title;
    const duration = req.body.duration;
    const uploadedAt = req.body.uploadedAt;

    if (id !== undefined) {
      if (typeof id !== "string") {
        res.status(400);
        throw new Error("'id' dever ser string");
      }
    }

    if (title !== undefined) {
      if (typeof title !== "string") {
        res.status(400);
        throw new Error("'title' dever ser string");
      }
    }

    if (duration !== undefined) {
      if (typeof duration !== "number") {
        res.status(400);
        throw new Error("'duration' dever ser string");
      }
    }

    if (uploadedAt !== undefined) {
      if (typeof uploadedAt !== "string") {
        res.status(400);
        throw new Error("'uploadedAt' dever ser string");
      }
    }

    // const [videoDB]: TVideoDB[] = await db("videos").where({ id: idToEdit });

    const videoDatabase = new VideoDatabase();
    const videoDB = await videoDatabase.findVideoById(idToEdit);

    if (!videoDB) {
      res.status(404);
      throw new Error("'id' não encontrado");
    }

    const video = new Video(
      videoDB.id,
      videoDB.title,
      videoDB.duration,
      videoDB.uploaded_at
    );

    id && video.setId(id);
    title && video.setTitle(title);
    duration && video.setDuration(duration);
    uploadedAt && video.setUploadedAt(uploadedAt);

    const updatedVideoDB: TVideoDB = {
      id: video.getId(),
      title: video.getTitle(),
      duration: video.getDuration(),
      uploaded_at: video.getUploadedAt(),
    };

    // await db("videos").update(updatedVideoDB).where({ id: idToEdit })

    await videoDatabase.updateVideo(idToEdit, updatedVideoDB);

    res.status(200).send(video);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.delete("/videos/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // const [videoDB]: TVideoDB[] = await db("videos").where({ id });

    const videoDatabase = new VideoDatabase();
    const videoDB = await videoDatabase.findVideoById(id);

    if (!videoDB) {
      res.status(404);
      throw new Error("'id' não encontrado");
    }

    const video = new Video(
      videoDB.id,
      videoDB.title,
      videoDB.duration,
      videoDB.uploaded_at
    );

    // await db("videos").delete().where({id: video.getId()});

    await videoDatabase.deleteVideo(id);

    res.status(200).end();
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});
