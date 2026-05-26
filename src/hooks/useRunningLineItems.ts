export const useRunningLineItems = (repeat: number) => {
    return Array.from({ length: repeat * 2 }, (_, index) => index);
};