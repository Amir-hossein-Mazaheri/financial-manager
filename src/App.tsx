import { useState } from "react";

// third party
import ReactModal from "react-modal";
import { z } from "zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns-jalali";
import { Calendar, CalendarProvider } from "zaman";
import type { Record as TRecord } from "@prisma/client";

// assets
import {
  IconJson,
  IconMoneybag,
  IconPlus,
  IconPrinter,
  IconX,
} from "@tabler/icons-react";

// project imports
import Button from "./common/Button";
import Container from "./common/Container";
import usePaginatedRecords from "./hooks/usePaginatedRecords";
import Record from "./common/Record";
import Input from "./common/Input";
import formatPrice from "./utils/formatPrice";
import clsxm from "./utils/mergeClass";
import useSwal from "./hooks/useSwal";
import "./types";

const requiredMsg = "پر کردن این فیلد ضروری است";
const numberMsg = "این فیلد باید عدد باشد";
const minMsg = "حداقل طول این فیلد 3 کاراکتر است";

const createRecordSchema = z.object({
  amount: z.preprocess(
    (val: unknown) => BigInt(val as string),
    z.bigint({ invalid_type_error: numberMsg, required_error: requiredMsg })
  ),
  reason: z
    .string()
    .nonempty({ message: requiredMsg })
    .min(3, { message: minMsg }),
  label: z.string().optional(),
});

function App() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const {
    records,
    createRecord,
    updateRecord,
    removeRecord,
    // page,
    // nextPage,
    // prevPage,
    // setPage,
  } = usePaginatedRecords();

  const swal = useSwal();

  const formMethods = useForm<z.infer<typeof createRecordSchema>>({
    resolver: zodResolver(createRecordSchema),
  });

  const { handleSubmit, register, watch, reset } = formMethods;

  const handleOpenCreateDialog = () => {
    setShowCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setShowCreateDialog(false);
  };

  const handleChangeDate = (d: Date) => {
    setDate(d);
    setShowDatePicker(false);
  };

  const handleAddRecord: SubmitHandler<
    z.infer<typeof createRecordSchema>
  > = async ({ amount, reason, label }) => {
    const newRecord: Omit<TRecord, "id" | "date"> = {
      amount: BigInt(amount),
      reason,
      label: label ?? null,
    };

    try {
      await createRecord(newRecord);
    } catch (e) {
      console.log("add record err: ", e);
    }

    reset();
    setShowCreateDialog(false);
  };

  const handleRemoveRecord = (id: string) => {
    removeRecord(id);
  };

  const handleEditRecord = (
    id: string,
    amount: bigint,
    reason: string,
    date: Date,
    label?: string
  ) => {
    updateRecord(id, {
      amount,
      date,
      reason,
      label: label ?? null,
    });
  };

  const handleImportLog = async () => {
    const { isConfirmed } = await swal.fire({
      icon: "error",
      title: "اخطار",
      text: "با انجام این کار رکود های ثبت شده تا الان از بین می رن، هنوزم می خوای ادامه بدی؟",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "مشکلی نیس",
      cancelButtonText: "نه بی خیال",
    });

    if (!isConfirmed) return;

    const fileDialog = await window.electron.openDialog("showOpenDialog", {
      title: "لاگ رو انتخاب کنین",
      properties: ["openFile"],
      filters: [
        {
          name: "JSON",
          extensions: ["json"],
        },
      ],
    });

    if (fileDialog.canceled) return;

    const logContent = await window.electron.readFile(fileDialog.filePaths[0]);

    const parsedContent = JSON.parse(logContent);

    const recordSchema = z.array(
      z.object({
        id: z.string().nonempty(),
        amount: z.number(),
        date: z.preprocess((val) => parseISO(val as string), z.date()),
        reason: z.string().nonempty(),
        label: z.string().optional(),
      })
    );

    const validation = await recordSchema.safeParseAsync(parsedContent);

    if (!validation.success) return;

    validation.data;
  };

  return (
    <Container>
      <div className="flex items-center gap-2">
        <h1 className="text-xl sm:text-4xl font-bold text-white print:text-gray-800 flex items-center gap-1">
          <IconMoneybag size={35} />

          <span className="print:hidden">مدیریت مالی</span>

          <span className="hidden print:block">
            پرینت رکورد های مالی تا تاریخ {format(new Date(), "yyyy/MM/dd")}
          </span>
        </h1>

        <Button
          className="mr-auto print:hidden"
          onClick={handleOpenCreateDialog}
          startIcon={<IconPlus />}
        >
          <span className="hidden sm:block">ایجاد رکورد جدید</span>
        </Button>

        <Button
          className="bg-blue-600 hover:bg-blue-700 print:hidden"
          startIcon={<IconPrinter />}
          onClick={() => window.print()}
        >
          <span className="hidden sm:block">پرینت</span>
        </Button>

        <Button
          className="bg-red-600 hover:bg-red-700 print:hidden"
          startIcon={<IconJson />}
          onClick={handleImportLog}
        />
      </div>

      <ReactModal
        shouldCloseOnEsc
        preventScroll
        isOpen={showCreateDialog}
        onRequestClose={handleCloseCreateDialog}
        className="absolute bg-gray-800 max-w-xl outline-none border-none w-full text-white mx-2 rounded-lg px-8 py-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        overlayClassName="bg-black/40 fixed inset-0"
        ariaHideApp={false}
      >
        <FormProvider {...formMethods}>
          <form
            onSubmit={handleSubmit(handleAddRecord)}
            className="w-full space-y-10"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="m-0">ایجاد رکورد مالی جدید</h2>

              <Button
                onClick={handleCloseCreateDialog}
                className="bg-transparent group hover:bg-red-500 border border-solid border-red-500 rounded-full w-8 h-8 p-0 flex items-center justify-center"
              >
                <IconX
                  size={18}
                  className="text-red-500 group-hover:text-white transition-all"
                />
              </Button>
            </div>

            <div className="flex items-center gap-2 w-full">
              <div className="relative flex-[2]">
                <Input
                  type="text"
                  placeholder="مقدار پول به تومان"
                  {...register("amount")}
                />

                {!!watch("amount") && (
                  <p
                    className={clsxm(
                      "absolute bottom-0 right-0 translate-y-full -mb-1 text-sm",
                      watch("amount") > 0 ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {formatPrice(watch("amount"))} تومان
                  </p>
                )}
              </div>

              <div className="flex-1 relative">
                <Input
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  type="text"
                  className="cursor-pointer"
                  value={format(date, "yyyy/MM/dd")}
                  onChange={() => ({})}
                />

                {showDatePicker && (
                  <div className="absolute top-full left-0 mt-3 z-1">
                    <CalendarProvider
                      locale="fa"
                      round="x2"
                      accentColor="#000000"
                    >
                      <Calendar
                        defaultValue={date}
                        className="text-black"
                        onChange={handleChangeDate}
                      />
                    </CalendarProvider>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full">
              <Input
                className="flex-grow"
                placeholder="دلیل وجود"
                {...register("reason")}
              />
            </div>

            <div className="flex items-center gap-2 w-full">
              <Input
                className="flex-grow"
                placeholder="لیبل (اختیاری)"
                {...register("label")}
              />
            </div>

            <Button
              type="submit"
              className="w-full justify-center py-2 rounded-full"
            >
              ایجاد رکورد
            </Button>
          </form>
        </FormProvider>
      </ReactModal>

      {records.length === 0 ? (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h2 className="text-3xl text-white text-center">
            هیچ رکوردی وجود ندارد 😎
          </h2>
        </div>
      ) : (
        <div className="container overflow-auto mt-5">
          <div className="space-y-8 px-5 pb-32">
            {records.map((record) => (
              <Record
                key={record.id.toString()}
                id={record.id}
                amount={record.amount}
                date={record.date}
                reason={record.reason}
                label={record.label ?? undefined}
                onEdit={handleEditRecord}
                onRemove={handleRemoveRecord}
              />
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}

export default App;
