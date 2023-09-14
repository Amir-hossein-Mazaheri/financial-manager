import { useCallback, useEffect, useState } from "react";

// third party
import { Record } from "@prisma/client";

export default function usePaginatedRecords(perPage = 15) {
  const [page, setPage] = useState(1);
  const [value, setValue] = useState<Record[]>([]);

  const updateValue = useCallback(
    async (page: number) => {
      const records = await window.electron.records("findMany", {
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: {
          date: "desc",
        },
      });

      setValue(records);
    },
    [perPage]
  );

  const prevPage = useCallback(() => {
    setPage((currPage) => currPage - 1);
  }, []);

  const nextPage = useCallback(() => {
    setPage((currPage) => currPage + 1);
  }, []);

  const createRecord = useCallback(
    async (record: Omit<Record, "id" | "date">) => {
      const newRecord = await window.electron.records("create", {
        data: record,
      });

      updateValue(page);

      return newRecord;
    },
    [page, updateValue]
  );

  const updateRecord = useCallback(
    async (id: string, record: Omit<Record, "id">) => {
      const updatedRecord = await window.electron.records("update", {
        where: {
          id,
        },
        data: record,
      });

      updateValue(page);

      return updatedRecord;
    },
    [page, updateValue]
  );

  const removeRecord = useCallback(
    async (id: string) => {
      const deletedRecord = await window.electron.records("delete", {
        where: {
          id,
        },
      });

      updateValue(page);

      return deletedRecord;
    },
    [page, updateValue]
  );

  useEffect(() => {
    updateValue(page);
  }, [page, updateValue]);

  return {
    records: value,
    page,
    setPage,
    prevPage,
    nextPage,
    createRecord,
    updateRecord,
    removeRecord,
  };
}
