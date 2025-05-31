import { z } from 'zod';

export const searchParamsSchema = z.object({
  q: z.string().max(100).optional(),
  page: z.number().min(1).max(100).optional(),
  categories: z.string().regex(/^[01]{3}$/).optional(),
  purity: z.string().regex(/^[01]{3}$/).optional(),
  sorting: z.enum(['date_added', 'relevance', 'random', 'views', 'favorites', 'toplist']).optional(),
  order: z.enum(['desc', 'asc']).optional(),
  atleast: z.string().regex(/^\d+x\d+$/).optional(),
});
