export interface Domain {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  status?: string;
  owner_id?: string | null;
  created_at?: string;
  is_featured?: boolean;
}