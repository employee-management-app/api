import type { Order as IOrder } from '../types/order';

export const sortNotCompletedOrders = (a: IOrder, b: IOrder) => {
  if (a.status === 'inbox' && b.status === 'inbox') {
    if (!a.assignedEmployee && !a.startDate && (b.startDate || b.assignedEmployee)) {
      return -1;
    }

    if (!a.assignedEmployee && !a.startDate && !b.startDate && !b.assignedEmployee) {
      return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
    }

    if (a.startDate && !a.assignedEmployee && b.assignedEmployee && !b.startDate) {
      return -1;
    }

    if (a.startDate && b.startDate) {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    }

    if (a.assignedEmployee && b.assignedEmployee) {
      return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
    }

    return 0;
  }

  if (a.status === 'inbox' && b.status === 'inProgress') {
    return -1;
  }

  if (a.status === 'inProgress' && b.status === 'inbox') {
    return 1;
  }

  if (a.startDate && b.startDate) {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  }

  return 0;
};
