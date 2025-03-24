import { formatDistanceToNow } from 'date-fns';
// This function takes a date string or Date object and returns a human-readable string
export const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) {
        return 'N/A'; // Return a default value for invalid or missing dates
    }
    return formatDistanceToNow(new Date(date), { addSuffix: true });
};