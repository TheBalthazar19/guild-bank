const Bank = require('./bankModel');

async function load() {

  let bank = await Bank.findOne();

  if (!bank) {
    bank = await Bank.create({
      data: {}
    });
  }

  return bank.data;
}

async function save(data) {

  let bank = await Bank.findOne();

  if (!bank) {
    bank = new Bank({ data });
  } else {
    bank.data = data;
  }

  await bank.save();
}

async function add(cat, sub, item, qty) {

  const data = await load();

  if (!data[cat]) data[cat] = {};
  if (!data[cat][sub]) data[cat][sub] = {};
  if (!data[cat][sub][item]) data[cat][sub][item] = 0;

  data[cat][sub][item] += qty;

  await save(data);
}

async function removeItem(cat, sub, item, qty) {

  const data = await load();

  if (!data?.[cat]?.[sub]?.[item]) {
    return false;
  }

  if (data[cat][sub][item] < qty) {
    return false;
  }

  data[cat][sub][item] -= qty;

  await save(data);

  return true;
}

module.exports = {
  load,
  save,
  add,
  removeItem
};