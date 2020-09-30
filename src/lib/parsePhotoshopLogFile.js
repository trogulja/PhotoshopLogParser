const fs = require('fs');
const path = require('path');
const readline = require('readline');
const Datastore = require('nedb-promises');
const { env } = require('process');
const db = new Datastore();

async function parsePhotoshopLogFile(file) {
  // file.path
  const rl = readline.createInterface({
    input: fs.createReadStream(file.path, { encoding: 'latin1' }), // https://nodejs.org/api/buffer.html#buffer_buffer
    crlfDelay: Infinity,
  });

  const psRegex = {
    open: /^(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)\s+File (.+) opened$/,
    save: /^(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)\s+File (.+) saved$/,
    close: /^(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)\s+File (.+) closed$/,
    action: /^\s+(.+)$/,
  };

  let i = 0;
  let action = 0;
  for await (let line of rl) {
    line = line.toString('utf8');
    let event = 'ignore';
    if (psRegex.action.test(line)) event = 'action';
    else {
      if (psRegex.open.test(line)) event = 'open';
      else if (psRegex.save.test(line)) event = 'save';
      else if (psRegex.close.test(line)) event = 'close';

      await handleFile(event, line, i);
    }

    await handleAction(event, line, i);
    i += 1;
  }

  async function handleAction(event, line, i) {
    if (event === 'action') {
      action += 1;
    } else {
      if (action > 0) {
        console.log(`Line: ${i}, Action is: ${action}`)
        const match = await db.findOne({ actions: 0 }).sort({ i: -1 });
        if (!match) console.log(line)
        console.log(match)
        const res = await db.update({ _id: match._id }, { $set: { actions: action } });
        console.log(res)
        action = 0;
      }
    }
    return true;
  }

  async function handleFile(event, line, i) {
    const m = psRegex[event].exec(line);
    const date = new Date(m[1], m[2] - 1, m[3], m[4], m[5], m[6]);
    const name = event === 'save' ? path.basename(m[7]) : m[7];

    if (event === 'open') {
      await db.insert({ i, name, path: null, open: date, save: null, close: null, actions: 0, duration: 0 });
    } else {
      const match = await db.findOne({ name }).sort({ i: -1 });
      // if (!match) console.log(`We couldn't find a match for event ${event} for name ${name}`);
      if (!match) return false;

      let update = {};
      if (event === 'save') update = { save: date, path: m[7] };
      if (event === 'close') update = { close: date, duration: calcDuration(match.open, date) };

      await db.update({ _id: match._id }, { $set: update });
    }

    return true;
  }

  function calcDuration(start, end) {
    return Math.round((end.getTime() - start.getTime()) / 1000)
  }

  // const results = await db.find({});
  // console.log(results)
  return file.path;
}

module.exports = parsePhotoshopLogFile;

// const db_document = {
//   name: 'stjepan.tif',
//   path: 'C:\\LoginAppNew\\Export\\stjepan.tif',
//   open: '2020-09-30 11:12:44',
//   save: '2020-09-30 11:12:51',
//   close: '2020-09-30 11:12:51',
//   actions: 6,
//   duration: 7, // 7 sec
// };
