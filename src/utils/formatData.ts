// src/utils/formatDate.ts
import { formatDistanceToNow } from 'date-fns';

export const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) {
        return 'N/A'; // Return a default value for invalid or missing dates
    }
    return formatDistanceToNow(new Date(date), { addSuffix: true });
};