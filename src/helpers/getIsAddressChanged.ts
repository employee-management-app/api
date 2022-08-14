import { Order as IOrder } from "../types/order";

export const getIsAddressChanged = (a: IOrder['address'], b?: IOrder['address']) => {
  if (!b) {
    return false;
  }

  return (Object.keys(b) as (keyof typeof a)[]).some((key) => b[key] !== a[key]);
};
