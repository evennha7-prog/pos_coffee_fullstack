import Counter from "../models/counter.model";

export const generateProductCode = async (): Promise<string> => {
  const result: any = await Counter.findOneAndUpdate(
    { _id: "product_code" },
    { $inc: { sequcene_value: 1 } },
    { new: true, upsert: true }
  );
  const productCode = String(result.sequcene_value).padStart(6, "0");
  return productCode;
};

export const generateInvoiceNumber = async (): Promise<string> => {
  const result: any = await Counter.findOneAndUpdate(
    { _id: "invoice_number" },
    { $inc: { sequcene_value: 1 } },
    { new: true, upsert: true }
  );
  const invoiceNumber = String(result.sequcene_value).padStart(6, "0");
  return invoiceNumber;
};
