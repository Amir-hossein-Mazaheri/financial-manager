import { PrismaClient } from "@prisma/client";
import { type Dialog } from "electron";
import { type PathLike } from "fs";
import { type FileHandle } from "fs/promises";

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

      readFile: (path: PathLike | FileHandle) => string;

      records: <T extends keyof PrismaRecord>(
        action: T,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ...args: Parameters<Awaited<PrismaRecord[T]>>
      ) => // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ReturnType<PrismaRecord[T]>;
    };
  }
}
