"use strict";

const Hapi = require("@hapi/hapi");
const inert = require("@hapi/inert");
const vision = require("@hapi/vision");
const h2o2 = require("@hapi/h2o2");
const Crumb = require("@hapi/crumb");
const attachFilePlugin = require('./plugins/attach-file-plugin');
console.log('attachFilePlugin:', attachFilePlugin);


const plugins = [inert, vision, h2o2];

plugins.push({
    // eslint-disable-next-line
    // @ts-ignore - неверные типы плагина
    plugin: Crumb,
    options: {
        // eslint-disable-next-line
        // @ts-ignore
        key: 'csrf-cookie',
        addToViewContext: true,
        headerName: 'csrf-header',
        restful: true,
        logUnauthorized: true,
    },
});

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: "localhost",
    });

    await server.register(plugins);

    server.route({
        method: "GET",
        path: "/",
        handler: (request, h) => {
            return "Hello World2!";
        },
    });

    server.route({
        method: "GET",
        path: "/goo",
        handler: (request, h) => {
            return "goo!";
        },
    });

    // h2o2 proxy
    server.route({
        method: "GET",
        path: "/google",
        handler: {
            proxy: {
                uri: "https://www.google.com/",
            },
        },
    });

    await server.start();
    console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
    console.log(err);
    process.exit(1);
});

init();
