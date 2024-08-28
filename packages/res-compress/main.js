'use strict';

module.exports = {
    load () {
    },

    unload () {
    },

    messages: {
        'open' () {
            Editor.Panel.open('res-compress');
        },
        'asset-db:assets-moved': function (event, target) {
            Editor.Ipc.sendToPanel('res-compress', 'res-compress:hello', target);
        },
        'asset-db:assets-deleted': function (event, target) {
            Editor.Ipc.sendToPanel('res-compress', 'res-compress:hello', target);
        },
        'asset-db:assets-created': function (event, target) {
            Editor.Ipc.sendToPanel('res-compress', 'res-compress:hello', target);
        },
    },
};
