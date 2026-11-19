export type Topic = {
  id: string;
  title: string;
  marks: string[];
  short: string;
  mid: string;
  detailed: string;
};
export type Section = { id: string; title: string; topics: Topic[] };
export type Shot = {
  src: string;
  width: number;
  height: number;
  marks: { n: number; kind: 'click' | 'look'; x: number; y: number; w: number; h: number }[];
};
