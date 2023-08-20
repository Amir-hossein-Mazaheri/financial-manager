// third party
import * as uuid from "uuid";

// assets
import { IconMoneybag, IconPlus, IconPrinter } from "@tabler/icons-react";

// project imports
import Button from "./common/Button";
import Container from "./common/Container";
import useLocalStorage from "./hooks/useLocalStorage";
import FinancialRecord from "./core/Record";
import Record from "./common/Record";

type NewRecord = {
  amount: number;
  reason: string;
  label?: string;
};

function App() {
  const [records, setRecords] = useLocalStorage<FinancialRecord[]>(
    "records",
    []
  );

  const handleAddRecord = ({ amount, reason, label }: NewRecord) => {
    const newRecord = new FinancialRecord(
      uuid.v4(),
      amount,
      new Date(),
      reason,
      label
    );

    setRecords([...records, newRecord]);
  };

  const handleRemoveRecord = (id: string) => {
    setRecords(records.filter((record) => record.id !== id));
  };

  return (
    <Container>
      <div className="flex items-center gap-2">
        <h1 className="text-4xl font-bold text-white flex items-center gap-1">
          <IconMoneybag size={35} />

          <span>مدیریت مالی</span>
        </h1>

        <Button className="mr-auto" startIcon={<IconPlus />}>
          ایجاد رکورد جدید
        </Button>

        <Button
          className="bg-blue-600 hover:bg-blue-700"
          startIcon={<IconPrinter />}
        >
          پرینت
        </Button>
      </div>

      <div className="space-y-8 mt-12">
        <Record
          id="1"
          amount={330000}
          date={new Date()}
          label="Financial"
          reason="تست یه چیزی..."
          onEdit={(...args) => console.log(args)}
        />
      </div>
    </Container>
  );
}

export default App;
