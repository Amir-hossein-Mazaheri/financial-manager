// assets
import { IconMoneybag, IconPlus, IconPrinter } from "@tabler/icons-react";

// project imports
import Button from "./common/Button";
import Container from "./common/Container";

function App() {
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
    </Container>
  );
}

export default App;
