export class ParseUtil {
  parse(input: string) {
    return JSON.parse(input);
  }
  stringify(input: any) {
    return JSON.stringify(input);
  }
}
