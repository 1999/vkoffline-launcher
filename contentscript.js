(function () {
    'use strict';

    var VKOFFLINE_APP_ID = 'jinklgkideaicpdgmomlckebafjfibjk';
    var INJECTED_ITEM_ID = 'vkoffline-launcher';
    var SETTINGS_ITEM_ID = 'l_set';
    var DOM_ELEM_LAUNCH = 'launched-app';

    // mutation observer
    function showLink() {
        var launchItem = document.getElementById(DOM_ELEM_LAUNCH);
        if (launchItem) {
            launchItem.remove();
            chrome.runtime.sendMessage('launch');

            return;
        }

        var linkItem = document.getElementById(INJECTED_ITEM_ID);
        if (linkItem) {
            linkItem.style.display = 'block';
            return;
        }

        var menuSettingsItem = document.getElementById(SETTINGS_ITEM_ID);
        if (!menuSettingsItem) {
            return;
        }

        var linkItemHTML = [
            '<li id="' + INJECTED_ITEM_ID + '">',
                '<a href="https://chrome.google.com/webstore/detail/' + VKOFFLINE_APP_ID + '" onclick="el=document.createElement(\'span\'); el.id = \'' + DOM_ELEM_LAUNCH + '\'; document.body.appendChild(el); return false;" class="left_row">',
                    '<span class="left_label inl_bl">VK Offline</span>',
                '</a>',
            '</li>'
        ].join('');

        menuSettingsItem.insertAdjacentHTML('afterend', linkItemHTML);
    }

    var observer = new (window.MutationObserver || window.WebKitMutationObserver)(showLink);

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // run on page load
    showLink();
})();