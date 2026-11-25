export class NumberUtils {
  public static parseIntOrUndefined(str: string): number | undefined {
    const parsed = parseInt(str);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
}
