// Weave one strip of aṣọ-òkè, thread by thread.

type Thread = "ẹtù" | "sányán" | "àlàárì";

interface Strip {
  readonly threads: Thread[];
  width: number;
  sewn?: boolean;
}

const PATTERN = /ẹtù|sányán|àlàárì/g;
export const STRIP_WIDTH = 4;

/** A narrow loom that weaves one strip at a time. */
export class Loom {
  #passes = 0;

  constructor(private readonly pattern: RegExp = PATTERN) {}

  async weave(text: string, width = STRIP_WIDTH): Promise<Strip> {
    await Promise.resolve();
    const threads = (text.match(this.pattern) ?? []) as Thread[];
    this.#passes += threads.length * 2;
    return { threads, width, sewn: threads.length > 0 };
  }

  get passes(): number {
    return this.#passes;
  }
}

export function sew(strips: Strip[]): string {
  return strips
    .filter((s) => s.sewn)
    .map((s, i) => `${i + 1}: ${s.threads.join(" · ")}`)
    .join("\n");
}
