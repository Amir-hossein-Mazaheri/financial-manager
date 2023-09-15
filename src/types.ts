import { PrismaClient, Record } from "@prisma/client";
import { type Dialog } from "electron";
import { type PathLike } from "fs";
import { writeFile, type FileHandle } from "fs/promises";

const p = new PrismaClient();
type PrismaRecord = typeof p.record;

// adds electron types which are added externally to window
declare global {
  interface Window {
    electron: {
      openDialog: <T extends keyof Dialog>(
        method: T,
        config: object
      ) => ReturnType<Dialog[T]>;

      readFile: (path: PathLike | FileHandle) => Promise<string>;

      writeFile: (
        ...args: Parameters<typeof writeFile>
      ) => ReturnType<typeof writeFile>;

      records: <T extends keyof PrismaRecord>(
        action: T,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ...args: Parameters<Awaited<PrismaRecord[T]>>
      ) => // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ReturnType<PrismaRecord[T]>;

      createManyRecords: (
        records: (Omit<Record, "id"> & { id?: string })[]
      ) => Promise<undefined>;
    };
  }
}
