import { useCallback, useEffect, useState } from "react";

// project imports
import { Record } from "../database/index";

export default function usePaginatedRecords(perPage = 15) {
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<Record[]>([]);
  const [pagesCount, setPagesCount] = useState(1);
  const [count, setCount] = useState(0);

  // should be called after any mutations on records because
  // data in managed in database and here is just a snapshot of
  // a piece of data to make the experience much more sweater for
  // user and memory friendly
  const updateRecords = useCallback(
    async (page: number, updatePagesCount = true) => {
      const records = await window.electron.records("findMany", {
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: {
          date: "desc",
        },
      });

      if (updatePagesCount) {
        const recordsCount = await window.electron.records("count");
        setCount(recordsCount);
        setPagesCount(Math.ceil(recordsCount / perPage));
      }

      setRecords(records);
    },
    [perPage]
  );

  const prevPage = useCallback(() => {
    if (page === 1) return;

    setPage((currPage) => currPage - 1);
  }, [page]);

  const nextPage = useCallback(() => {
    if (page === pagesCount) return;

    setPage((currPage) => currPage + 1);
  }, [page, pagesCount]);

  const createRecord = useCallback(
    async (record: Omit<Record, "id">) => {
      const newRecord = await window.electron.records("create", {
        data: record,
      });

      updateRecords(page);

      return newRecord;
    },
    [page, updateRecords]
  );

  const updateRecord = useCallback(
    async (id: string, record: Omit<Record, "id">) => {
      const updatedRecord = await window.electron.records("update", {
        where: {
          id,
        },
        data: record,
      });

      updateRecords(page, false);

      return updatedRecord;
    },
    [page, updateRecords]
  );

  const removeRecord = useCallback(
    async (id: string) => {
      const deletedRecord = await window.electron.records("delete", {
        where: {
          id,
        },
      });

      if (Math.ceil((count - 1) / perPage) !== pagesCount) {
        prevPage();
      }

      updateRecords(page);

      return deletedRecord;
    },
    [count, page, pagesCount, perPage, prevPage, updateRecords]
  );

  const importRecords = useCallback(
    async (records: (Omit<Record, "id"> & { id?: string })[]) => {
      await window.electron.createManyRecords(records);

      updateRecords(page);
    },
    [page, updateRecords]
  );

  const exportRecords = useCallback(async () => {
    const rawRecords = await window.electron.records("findMany", {
      orderBy: {
        date: "desc",
      },
    });

    return JSON.stringify(
      rawRecords.map((r) => {
        const recordCopy: Omit<Partial<Record>, "amount"> & {
          amount: string | bigint;
        } = {
          ...r,
        };

        delete recordCopy.id;

        recordCopy.amount = recordCopy.amount?.toString();

        return recordCopy as Omit<Record, "id">;
      })
    );
  }, []);

  useEffect(() => {
    updateRecords(page);
  }, [page, updateRecords]);

  return {
    records,
    recordsCount: count,
    page,
    setPage,
    prevPage,
    nextPage,
    createRecord,
    updateRecord,
    removeRecord,
    pagesCount,
    importRecords,
    exportRecords,
  };
}
