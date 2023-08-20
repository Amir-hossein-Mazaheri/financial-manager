class FinancialRecord {
  constructor(
    private _id: string,
    private _amount: number,
    private _date: Date,
    private _reason: string,
    private _label?: string
  ) {}

  get haveLabel() {
    return !!this._label;
  }

  get id() {
    return this._id;
  }

  get amount() {
    return this._amount;
  }

  get date() {
    return this._date;
  }

  get reason() {
    return this._reason;
  }

  get label() {
    return this._label ?? "";
  }

  set amount(amount: number) {
    this._amount = amount;
  }

  set date(date: Date) {
    this._date = date;
  }

  set reason(reason: string) {
    this._reason = reason;
  }

  set label(label: string) {
    this._label = label;
  }
}

export default FinancialRecord;
