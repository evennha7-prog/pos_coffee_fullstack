import {
  generateProductCode as genCode,
  generateInvoiceNumber as genInv,
} from "../models/counter.model";

export const generateProductCode = async (): Promise<string> => {
  return await genCode();
};

export const generateInvoiceNumber = async (): Promise<string> => {
  return await genInv();
};

export default {
  generateProductCode,
  generateInvoiceNumber,
};
