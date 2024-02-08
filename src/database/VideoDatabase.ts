import { BaseDatabase } from "./BaseDatabase";
import { TVideoDB } from "./types";

export class VideoDatabase extends BaseDatabase {
  public static TABLE_VIDEOS = "videos";

  public findVideos = async (q: string): Promise<TVideoDB[]> => {
    let result: TVideoDB[];

    if (q) {
      result = await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS)
        .select()
        .where("title", "LIKE", `%${q}%`);
    } else {
      result = await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS).select();
    }
    return result;
  };

  public findVideoById = async (id: string): Promise<TVideoDB | undefined> => {
    const [response]: TVideoDB[] = await BaseDatabase.connection(
        VideoDatabase.TABLE_VIDEOS
    ).where({ id });

    return response;
  };

  public insertVideo = async (videoDB: TVideoDB): Promise<void> => {
    await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS).insert(videoDB);
  };

  public updateVideo = async (
    idToEdit: string,
    updatedVideoDB: TVideoDB
  ): Promise<void> => {
    await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS)
      .update(updatedVideoDB)
      .where({ id: idToEdit });
  };

  public deleteVideo = async (id: string): Promise<void> => {
    await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS).delete().where({ id });
  };
}
