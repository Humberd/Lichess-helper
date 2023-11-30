// ==UserScript==
// @name     [DEV] Lichess Helper
// @version  1.0.0
// @description Development mode for Lichess Helper
// @include https://lichess.org*
// @grant    GM_addElement
// @run-at		document-end
// @connect   localhost
// @connect   localhost:8124
// ==/UserScript==

"use strict";

function log(...args) {
  console.log("%cUserscript:", "color: purple; font-weight: bold", ...args);
}

log("Dev mode started");

async function main() {
  GM_addElement("script", {
    src: "http://localhost:8124/static/js/main.js",
    type: "text/javascript",

  });
  log("Got Dev script");
}

// Make sure we run once at the start
main
  .bind({})()
  .catch((e) => {
    log("ERROR", e);
  });

