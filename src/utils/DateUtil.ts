export class DateUtil {
  /**
   * Returns the current time in Bangladesh Timezone (Asia/Dhaka) as a UTC Date.
   * 
   * Mechanics:
   * 1. Extract BD time components (Year, Month, Hour...)
   * 2. Construct a UTC Date using those components.
   * 
   * Result: A Date object where .toISOString() (UTC) matching the BD Wall-Clock time.
   */
  static nowBD(): Date {
    return this.toBD(new Date());
  }

  /**
   * Converts a given date to Bangladesh Time
   */
  static toBD(date: Date | string | number): Date {
    const d = new Date(date);
    
    // Use Intl to extract parts in "Asia/Dhaka"
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Dhaka',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });

    const parts = formatter.formatToParts(d);
    
    // Extract values
    const get = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0');
    
    const year = get('year');
    const month = get('month') - 1; // Month is 0-indexed in JS Date
    const day = get('day');
    const hour = get('hour');
    const minute = get('minute');
    const second = get('second');

    // Create UTC date from these local components
    return new Date(Date.UTC(year, month, day, hour, minute, second));
  }
}
