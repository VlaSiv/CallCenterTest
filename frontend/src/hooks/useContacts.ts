import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getContacts } from '../api/contactsApi';
import type { ContactsParams } from '../api/contactsApi';

export const useContacts = (params: ContactsParams) => {
  return useQuery({
    queryKey: ['contacts', params],
    queryFn: () => getContacts(params),
    placeholderData: keepPreviousData,
    staleTime: 30000,
  });
};