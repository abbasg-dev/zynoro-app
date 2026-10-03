export interface User {
  name: string;
  email: string;
  phone: string;
  street: string;
  apartment: string;
  zip: string;
  city: string;
  id?: string;
  userprofile: File | null;
}
