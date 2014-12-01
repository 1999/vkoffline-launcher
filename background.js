window.onerror = function(msg, url, line) {
    var msgError = msg + ' in ' + url + ' (line: ' + line + ')';
    alert(msgError);
};

(function () {
    'use strict';

    var VKOFFLINE_APP_ID = 'jinklgkideaicpdgmomlckebafjfibjk';

    function statSend(category, action, optLabel, optValue) {
        var args = [];

        for (var i = 0, len = Math.min(arguments.length, 4); i < len; i++) {
            if (i === 3) {
                if (typeof optValue === 'boolean') {
                    optValue = Number(optValue);
                } else if (typeof optValue !== 'number') {
                    optValue = parseInt(optValue, 10) || 0;
                }

                args.push(optValue);
            } else {
                if (typeof arguments[i] !== 'string') {
                    args.push(JSON.stringify(arguments[i]));
                } else {
                    args.push(arguments[i]);
                }
            }
        }

        try {
            window._gaq.push(['_trackEvent'].concat(args));
        } catch (e) {}
    }

    function launchAppOrGTFO() {
        chrome.runtime.sendMessage(VKOFFLINE_APP_ID, {action: 'launch'}, function (isLaunched) {
            if (!isLaunched) {
                chrome.tabs.create({url: 'https://chrome.google.com/webstore/detail/' + VKOFFLINE_APP_ID});
            }
        });
    }

    chrome.runtime.onInstalled.addListener(function (details) {
        if (details.reason === 'install') {
            statSend('ExtLauncher', 'Lifecycle', 'Install');
            statSend('ExtLauncher', 'Lifecycle', 'IsAlive');

            chrome.storage.local.set({installDate: Date.now()});
            chrome.alarms.create('lifecycle', {periodInMinutes: 60 * 24});
        }
    });

    chrome.alarms.onAlarm.addListener(function (alarmInfo) {
        if (alarmInfo.name === 'lifecycle') {
            statSend('ExtLauncher', 'Lifecycle', 'IsAlive');

            var storageKey = 'installDate';
            chrome.storage.local.get(storageKey, function (records) {
                if (!records[storageKey]) {
                    return;
                }

                var diff = Date.now() - records[storageKey];
                var daysUsed = Math.floor(diff / 86400 * 1000);

                statSend('ExtLauncher', 'Lifecycle', 'DaysUsed', daysUsed);
            });
        }
    });

    chrome.browserAction.onClicked.addListener(function () {
        statSend('ExtLauncher', 'Click', 'Panel');
        launchAppOrGTFO();
    });

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request === 'launch') {
            statSend('ExtLauncher', 'Click', 'External');
            launchAppOrGTFO();
        }
    });
})();
