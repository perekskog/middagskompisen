export const getInitialDates = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const nextWeek = new Date(tomorrow);
  nextWeek.setDate(tomorrow.getDate() + 7);
  
  return {
    start: tomorrow.toISOString().split('T')[0],
    end: nextWeek.toISOString().split('T')[0]
  };
};

export const getPlanDates = (startDate: string, endDate: string) => {
  const dates = [];
  if (!startDate || !endDate) return [];

  // Parse dates as local to avoid UTC shifts
  const [sYear, sMonth, sDay] = startDate.split('-').map(Number);
  const [eYear, eMonth, eDay] = endDate.split('-').map(Number);
  
  const start = new Date(sYear, sMonth - 1, sDay);
  const end = new Date(eYear, eMonth - 1, eDay);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return [];

  const current = new Date(start);
  while (current <= end) {
    // Format as YYYY-MM-DD manually to stay in local time
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, '0');
    const d = String(current.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${d}`);
    
    current.setDate(current.getDate() + 1);
    
    // Safety break to prevent infinite loop if dates are invalid
    if (dates.length > 40) break; 
  }
  return dates;
};
