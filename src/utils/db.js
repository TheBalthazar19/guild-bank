const fs = require('fs');

function load() {
  return JSON.parse(fs.readFileSync('./data/bank.json'));
}

function save(d) {
  fs.writeFileSync('./data/bank.json', JSON.stringify(d, null, 2));
}

function add(cat, sub, item, q) {
  const d = load();
  d[cat] ??= {};
  d[cat][sub] ??= {};
  d[cat][sub][item] ??= 0;
  d[cat][sub][item] += q;
  save(d);
}

function removeItem(cat, sub, item, q) {
  const d = load();
  if (!d[cat]?.[sub]?.[item]) return false;
  if (d[cat][sub][item] < q) return false;
  d[cat][sub][item] -= q;
  save(d);
  return true;
}

module.exports = { add, removeItem };