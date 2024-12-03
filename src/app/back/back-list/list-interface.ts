export interface Quiz {
  id: number;
  title: string;
  status: string;
  start: string;
  end: string;
  selected?: boolean;
}
