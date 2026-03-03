type LoanStatus = "active" | "closed";
const msPerDay = 24 * 60 * 60 * 1000;

function toDateOnly(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return null;

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getAccruedDays(startDateInput: string, asOfDate: Date = new Date()) {
  const startDate = toDateOnly(startDateInput);
  if (!startDate) return 0;

  const today = new Date(asOfDate.getFullYear(), asOfDate.getMonth(), asOfDate.getDate());
  if (today <= startDate) return 0;

  return Math.floor((today.getTime() - startDate.getTime()) / msPerDay);
}

function getDaysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function getAccruedInterestFromMonthlyRate({
  principal,
  monthlyInterestRate,
  startDate,
  asOfDate,
}: {
  principal: number;
  monthlyInterestRate: number;
  startDate: Date;
  asOfDate: Date;
}) {
  if (asOfDate <= startDate) return 0;

  const monthlyInterestAmount = (principal * monthlyInterestRate) / 100;
  if (monthlyInterestAmount <= 0) return 0;

  let accruedInterest = 0;
  let cursor = new Date(startDate);

  while (cursor < asOfDate) {
    const year = cursor.getFullYear();
    const monthIndex = cursor.getMonth();
    const daysInMonth = getDaysInMonth(year, monthIndex);
    const monthEndExclusive = new Date(year, monthIndex + 1, 1);
    const segmentEnd = monthEndExclusive < asOfDate ? monthEndExclusive : asOfDate;
    const segmentDays = Math.floor((segmentEnd.getTime() - cursor.getTime()) / msPerDay);

    accruedInterest += (monthlyInterestAmount / daysInMonth) * segmentDays;
    cursor = segmentEnd;
  }

  return accruedInterest;
}

export function getLoanFinancials({
  principal,
  interestRate,
  startDate,
  totalPaid,
  storedStatus,
}: {
  principal: number;
  interestRate: number;
  startDate: string;
  totalPaid: number;
  storedStatus?: string;
}) {
  const safePrincipal = Number(principal) || 0;
  const safeInterestRate = Number(interestRate) || 0;
  const safeTotalPaid = Number(totalPaid) || 0;

  const daysElapsed = getAccruedDays(startDate);
  const today = new Date();
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const parsedStartDate = toDateOnly(startDate);

  const monthlyInterestAmount = (safePrincipal * safeInterestRate) / 100;
  const currentMonthDays = getDaysInMonth(todayDateOnly.getFullYear(), todayDateOnly.getMonth());
  const dailyInterestAmount = currentMonthDays > 0 ? monthlyInterestAmount / currentMonthDays : 0;

  const accruedInterest = parsedStartDate
    ? getAccruedInterestFromMonthlyRate({
        principal: safePrincipal,
        monthlyInterestRate: safeInterestRate,
        startDate: parsedStartDate,
        asOfDate: todayDateOnly,
      })
    : 0;

  const totalAmount = safePrincipal + accruedInterest;
  const remainingAmount = Math.max(totalAmount - safeTotalPaid, 0);

  const status: LoanStatus =
    remainingAmount === 0 || storedStatus === "closed" ? "closed" : "active";

  return {
    daysElapsed,
    dailyInterestAmount,
    accruedInterest,
    totalAmount,
    totalPaid: safeTotalPaid,
    remainingAmount,
    status,
  };
}
