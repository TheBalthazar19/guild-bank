const navStack = {};

function pushState(uid, s) {
  if (!navStack[uid]) navStack[uid] = [];
  navStack[uid].push(s);
}

function popState(uid) {
  if (!navStack[uid]?.length) return null;
  return navStack[uid].pop();
}

module.exports = { pushState, popState, navStack };