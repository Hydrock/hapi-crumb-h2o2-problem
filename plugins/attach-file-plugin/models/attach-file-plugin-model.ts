import Joi from 'joi';

import { JoiSchema } from '@alfa-bank/corp-onboarding-ui-shared-lib/server/utils/api-plugin-factory.types';

const pluginRequestQuerySchema = Joi.object({
    categoryCode: Joi.string().example('AD080').allow(''),
    dzId: Joi.string().example('AD080_2').allow(''),
    isOriginal: Joi.boolean().optional().example(false),
});

const pluginRequestParamsSchema = Joi.object({
    orderId: Joi.string().description('идентификатор заявки в BASE64'),
});

export const attachFilePluginJoiSchema: JoiSchema = {
    tags: ['api'],
    description: 'Прикрепление файла к заявке',
    notes: 'Файлы передаются в теле в виде multipart/form-data.',
    validate: {
        payload: true,
        params: pluginRequestParamsSchema,
        query: pluginRequestQuerySchema,
        failAction: 'ignore',
    },
};
