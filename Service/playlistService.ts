import { default as db } from "@lib/prismaClint"

export default class PlaylistService {
  public static async getAllSongs(id: number) {
    const songs = await db.playList.findUnique({
      where: {
        room_id: id,
      },
      select: {
        tracks: {
          orderBy: {
            position: "asc",
          },
        },
      },
    })
    return songs
  }

  public static async nowPLaying(id: number) {
    const cp = await db.playList.findFirst({
      where: {
        room_id: id,
      },
      select: {
        current: true,
        id: true,
      },
    })

    if (!cp) {
      return null
    }

    const currentSong = await db.tracks.findFirst({
      where: {
        AND: [{ playList_id: cp.id }, { position: cp.current }],
      },
    })

    return currentSong
  }

  public static async addNewTrack(id: number, track: any) {
    const newTrack = await db.tracks.create({
      data: {
        ...track,
        position: (await db.tracks.count({ where: { playList_id: id } })) + 1,
        playList_id: id,
      },
    })
    return newTrack
  }

  public static async playNextSong(id: number) {
    const cp = await db.playList.findFirst({
      where: {
        room_id: id,
      },
      select: {
        current: true,
        id: true,
        _count: {
          select: {
            tracks: true,
          },
        },
      },
    })

    if (!cp || cp.current === cp._count.tracks - 1) {
      return null
    }

    const nextSong = await db.tracks.findFirst({
      where: {
        AND: [{ playList_id: cp?.id }, { position: cp?.current + 1 }],
      },
    })

    if (nextSong) {
      await db.playList.update({
        where: {
          id: cp.id,
        },
        data: {
          current: cp.current + 1,
        },
      })
    }

    return nextSong
  }

  public static async playPreviousSong(id: number) {
    const cp = await db.playList.findFirst({
      where: {
        room_id: id,
      },
      select: {
        current: true,
        id: true,
      },
    })

    if (!cp || cp.current === -1) {
      return null
    }

    const previousSong = await db.tracks.findFirst({
      where: {
        AND: [{ playList_id: cp?.id }, { position: cp?.current - 1 }],
      },
    })

    if (previousSong) {
      await db.playList.update({
        where: {
          id: cp.id,
        },
        data: {
          current: cp.current - 1,
        },
      })
    }

    return previousSong
  }

  public static async changeTrackPosition(
    id: number,
    position: number,
    track_id: number
  ) {
    const cp = await db.playList.findFirst({
      where: {
        room_id: id,
      },
      select: {
        current: true,
        id: true,
      },
    })

    if (!cp) {
      return null
    }

    await db.tracks.updateMany({
      where: {
        AND: [{ playList_id: cp.id }, { position: { gte: position } }],
      },
      data: {
        position: {
          increment: 1,
        },
      },
    })

    await db.tracks.update({
      where: {
        id: track_id,
      },
      data: {
        position,
      },
    })

    return await this.getAllSongs(id)
  }
}
