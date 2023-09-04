import { z } from 'zod';

export const LimitValidator = (
  minValue: number,
  maxValue: number,
  defaultValue: number,
): z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined> => {
  return z
    .string()
    .optional()
    .transform((value, ctx) => {
      const limit = value ? Number.parseInt(value) : defaultValue;

      if (!(limit >= minValue && limit <= maxValue)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Limit must be a number between ${minValue} and ${maxValue}`,
          path: ['limit'],
        });

        return z.NEVER;
      }

      return limit;
    });
};

export const PageValidator = (): z.ZodEffects<z.ZodString, number, string> => {
  return z.string().transform((value, ctx) => {
    const page = Number.parseInt(value);

    if (!(Number.isInteger(page) && page >= 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Page must be a number greater than or equal 0',
        path: ['page'],
      });

      return z.NEVER;
    }

    return page;
  });
};

export const ProgramIdValidator = (): z.ZodEffects<z.ZodOptional<z.ZodString>, number | undefined> => {
  return z
    .string()
    .optional()
    .transform((value, ctx) => {
      if (!value) return undefined;

      const programId = Number.parseInt(value);

      if (!(Number.isInteger(programId) && programId >= 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'ProgramId must be a number greater than or equal 0',
          path: ['programId'],
        });

        return z.NEVER;
      }

      return programId;
    });
};

export const SearchValidator = (): z.ZodOptional<z.ZodString> => {
  return z.string().min(3).max(200).optional();
};

export const IdValidator = (): z.ZodEffects<z.ZodString, number, string> => {
  return z.string().transform((value, ctx) => {
    const id = Number(value);

    if (!(Number.isInteger(id) && id >= 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Id must be a number greater than or equal 0',
        path: ['id'],
      });

      return z.NEVER;
    }

    return id;
  });
};
