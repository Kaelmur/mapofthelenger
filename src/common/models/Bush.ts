export interface Bush {
  id: number;
  place_id: number;
  breed_id: number | null;
  type_id: number | null;
  sanitary_id: number | null;
  geocode: string;
  length: string;
  height: string;
  width: string;
  breed?: {
    id: number;
    title_ru: string;
  } | null;
  type?: {
    id: number;
    title_ru: string;
  } | null;
  sanitary?: {
    id: number;
    title_ru: string;
  } | null;
  place?: {
    id: number;
    title_ru: string;
  } | null;
}
