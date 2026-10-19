export type PaginationItem = number | 'start-ellipsis' | 'end-ellipsis';

export function paginationItems(page: number, totalPages: number): PaginationItem[] {
  const total = Math.floor(totalPages);
  if (!Number.isFinite(total) || total < 1) return [];
  const current = Math.max(1, Math.min(total, Math.floor(page) || 1));
  if (total <= 5) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 3) return [1, 2, 3, 'end-ellipsis', total];
  if (current >= total - 2) return [1, 'start-ellipsis', total - 2, total - 1, total];
  return [1, 'start-ellipsis', current, 'end-ellipsis', total];
}
