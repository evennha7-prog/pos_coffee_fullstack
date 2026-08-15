export function calculatePaymentStatus(
  totalCost: number,
  paidAmount: number
): "paid" | "due" | "partial" {
  if (paidAmount >= totalCost) return "paid";
  if (paidAmount === 0) return "due";
  return "partial";
}

export default calculatePaymentStatus;
