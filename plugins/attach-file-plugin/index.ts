import { IncomingMessage } from 'http';

import { Boom } from '@hapi/boom';
import {
    CommonRouteProperties,
    Plugin,
    ResponseObject,
    ResponseToolkit,
    RouteOptionsAccess,
} from '@hapi/hapi';

import { LOG_LEVELS } from '@alfa-bank/corp-onboarding-ui-shared-lib/server/constants/log-levels';
import { Log } from '@alfa-bank/corp-onboarding-ui-shared-lib/server/models/log';
import { getAttachFileHandler } from '@alfa-bank/corp-onboarding-ui-shared-lib/server/handlers/attach-file.handler';
import { getAttachFileWithIntProxyHandler } from '@alfa-bank/corp-onboarding-ui-shared-lib/server/handlers/attach-file-with-int-proxy.handler';

import { attachFilePluginJoiSchema } from './models/attach-file-plugin-model';

type AttachFilePluginOptions = {
    apiConfig: {
        method: string;
        path: string;
        url: string;
    };
    auth?: string | false | RouteOptionsAccess;
    maxFileSize: number;
    onResponse?: (h: ResponseToolkit, err: Boom<unknown>, res: IncomingMessage) => ResponseObject;
};

export const attachFilePlugin: Plugin<AttachFilePluginOptions> = {
    name: 'orders/attach-file',
    register: (server, options: AttachFilePluginOptions) => {
        const { apiConfig, maxFileSize, onResponse } = options;
        const { method, path, url } = apiConfig;

        const routeConfig: CommonRouteProperties = {
            payload: {
                output: process.env.PROXY_TO_INT_FILE ? 'data' : 'stream',
                allow: 'multipart/form-data',
                parse: false,
                maxBytes: maxFileSize,
            },
        };

        server.log(LOG_LEVELS.logInfo, Log.create(
            'orders/attach-file-plugin. Route config:',
            {
                routeConfig: routeConfig.payload,
            },
        ));

        const handler = process.env.PROXY_TO_INT_FILE
            ? getAttachFileWithIntProxyHandler(server)
            : getAttachFileHandler({ url }, server, onResponse);

        server.route({
            method,
            path,
            options: {
                ...routeConfig,
                auth: options.auth,
                ...attachFilePluginJoiSchema,
            },
            handler,
        });
    },
};
