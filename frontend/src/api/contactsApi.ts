import axios from 'axios';

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  age: number;
  status: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface ContactsParams {
  q?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export const getContacts = async (params: ContactsParams): Promise<PagedResult<Contact>> => {
  const response = await axios.get<PagedResult<Contact>>('/api/contacts', { params });
  return response.data;
};