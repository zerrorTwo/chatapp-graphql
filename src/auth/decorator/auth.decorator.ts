import { createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContextHost) => {
    const ctx = GqlExecutionContext.create(context).getContext();

    return ctx.req.user_data;
  },
);
