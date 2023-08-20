import React, { useState } from "react";

// third party
import { format, set, setDate } from "date-fns-jalali";

// assets
import { IconCheck, IconPencil, IconTrash, IconX } from "@tabler/icons-react";

// project imports
import formatPrice from "../utils/formatPrice";
import clsxm from "../utils/mergeClass";
import Button from "./Button";
import Input from "./Input";
import { Calendar, CalendarProvider } from "zaman";

interface RecordProps {
  id: string;
  amount: number;
  date: Date;
  reason: string;
  label?: string;
  onRemove?: (id: string) => void;
  onEdit: (
    id: string,
    amount: number,
    reason: string,
    date: Date,
    label?: string
  ) => void;
}

const Record: React.FC<RecordProps> = ({
  id,
  amount,
  reason,
  date,
  label,
  onRemove,
  onEdit,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const [amountValue, setAmountValue] = useState(amount);
  const [labelValue, setLabelValue] = useState(label);
  const [reasonValue, setReasonValue] = useState(reason);
  const [dateValue, setDateValue] = useState(date);

  const handleChangeAmount: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    setAmountValue(parseFloat(value));
  };

  const handleChangeLabel: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    setLabelValue(value);
  };

  const handleChangeReason: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    setReasonValue(value);
  };

  const handleChangeDate = (d: Date) => {
    setDateValue(d);
    setShowCalendar(false);
  };

  const handleEdit = () => {
    onEdit?.(id, amountValue, reasonValue, dateValue, labelValue);

    setEditMode(false);
  };

  return (
    <div className="space-y-4 border-b border-gray-600 border-b-solid px-4 py-2">
      <div className="flex items-center gap-3">
        {editMode ? (
          <Input
            type="text"
            value={amountValue}
            onChange={handleChangeAmount}
            className={clsxm(
              "text-2xl font-bold border-none",
              amountValue < 0 ? "text-red-500" : "text-green-500"
            )}
          />
        ) : (
          <h2
            className={clsxm(
              "text-2xl font-bold m-0",
              amount < 0 ? "text-red-500" : "text-green-500"
            )}
          >
            {`${formatPrice(amount)} ${amount > 0 ? "+" : "-"}`}
          </h2>
        )}

        {label &&
          (editMode ? (
            <Input
              type="text"
              value={labelValue}
              onChange={handleChangeLabel}
              className="mr-auto border-orange-500 text-orange-500 rounded-full px-2 py-1 w-fit text-sm text-center"
            />
          ) : (
            <div className="rounded-full mr-auto text-sm font-semibold px-2 py-1 border border-orange-500 border-solid text-orange-500">
              {label}
            </div>
          ))}

        <div className="relative">
          <div
            className={clsxm(
              "rounded-full  text-sm font-semibold px-2 py-1 border border-blue-500 border-solid text-blue-500",
              !label && "mr-auto",
              editMode && "cursor-pointer"
            )}
            onClick={() => setShowCalendar((prev) => !prev)}
          >
            {format(editMode ? dateValue : date, "yyyy/MM/dd")}
          </div>

          {editMode && showCalendar && (
            <div className="absolute top-full left-0 mt-3 z-1">
              <CalendarProvider locale="fa" round="x2" accentColor="#000000">
                <Calendar
                  defaultValue={dateValue}
                  className="text-black"
                  onChange={handleChangeDate}
                />
              </CalendarProvider>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 justify-between">
        {editMode ? (
          <Input
            type="text"
            value={reasonValue}
            onChange={handleChangeReason}
            className="border-none text-white"
          />
        ) : (
          <h3 className="text-lg font-bold m-0 text-white">{reason}</h3>
        )}

        <div className="flex items-center gap-px">
          {editMode ? (
            <>
              <Button
                className="bg-transparent scale-[.8] hover:bg-transparent border text-red-500 border-red-500 border-solid"
                onClick={() => setEditMode(false)}
              >
                <IconX className="text-red-500" />
              </Button>

              <Button
                className="bg-transparent scale-[.8] hover:bg-transparent border text-green-500 border-green-500 border-solid"
                onClick={handleEdit}
              >
                <IconCheck className="text-green-500" />
              </Button>
            </>
          ) : (
            <>
              <Button
                className="bg-transparent scale-[.8] hover:bg-transparent border text-yellow-500 border-yellow-500 border-solid"
                onClick={() => setEditMode(true)}
              >
                <IconPencil className="text-yellow-500" />
              </Button>

              <Button
                className="bg-transparent scale-[.8] hover:bg-transparent border text-red-500 border-red-500 border-solid"
                onClick={() => onRemove && onRemove(id)}
              >
                <IconTrash className="text-red-500" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Record;
