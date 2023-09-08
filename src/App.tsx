import { useMemo, useState } from "react";

// third party
import * as uuid from "uuid";
import ReactModal from "react-modal";
import { z } from "zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO, compareAsc } from "date-fns-jalali";
import { Calendar, CalendarProvider } from "zaman";

// assets
import {
  IconMoneybag,
  IconPlus,
  IconPrinter,
  IconX,
} from "@tabler/icons-react";

// project imports
import Button from "./common/Button";
import Container from "./common/Container";
import useLocalStorage from "./hooks/useLocalStorage";
import Record from "./common/Record";
import Input from "./common/Input";
import formatPrice from "./utils/formatPrice";
import clsxm from "./utils/mergeClass";
import toExactDate from "./utils/toExactDate";

const requiredMsg = "پر کردن این فیلد ضروری است";
const numberMsg = "این فیلد باید عدد باشد";
const minMsg = "حداقل طول این فیلد 3 کاراکتر است";

type Record = {
  id: string;
  amount: number;
  date: string;
  reason: string;
  label?: string;
};

const createRecordSchema = z.object({
  amount: z.preprocess(
    (val: unknown) => parseFloat(val as string),
    z.number({ invalid_type_error: numberMsg, required_error: requiredMsg })
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

  const [records, setRecords] = useLocalStorage<Record[]>("records", []);

  const sortedRecords = useMemo(
    () =>
      records.sort((a, b) =>
        compareAsc(
          parseISO(b.date as unknown as string),
          parseISO(a.date as unknown as string)
        )
      ),
    [records]
  );

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

  const handleAddRecord: SubmitHandler<z.infer<typeof createRecordSchema>> = ({
    amount,
    reason,
    label,
  }) => {
    const newRecord: Record = {
      id: uuid.v4(),
      amount,
      date: toExactDate(date),
      reason,
      label,
    };

    setRecords([...records, newRecord]);
    reset();
    setShowCreateDialog(false);
  };

  const handleRemoveRecord = (id: string) => {
    setRecords(records.filter((record) => record.id !== id));
  };

  const handleEditRecord = (
    id: string,
    amount: number,
    reason: string,
    date: Date,
    label?: string
  ) => {
    const copyRecords = [...records];

    const recordIndex = copyRecords.findIndex((record) => record.id === id);

    copyRecords[recordIndex] = {
      id,
      amount,
      date: toExactDate(date),
      reason,
      label,
    };

    setRecords(copyRecords);
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

                {watch("amount") && (
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
        <div className="container mt-5">
          <div className="space-y-8 px-5 pb-32">
            {sortedRecords.map((record) => (
              <Record
                key={record.id}
                id={record.id}
                amount={record.amount}
                date={record.date}
                reason={record.reason}
                label={record.label}
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
