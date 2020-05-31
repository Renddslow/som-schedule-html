const fs = require('fs');
const { promisify } = require('util');
const path = require('path');

const ejs = require('ejs');

const read = promisify(fs.readFile);
const write = promisify(fs.writeFile);

(async () => {
  const schedule = JSON.parse(((await read(path.join(__dirname, 'schedule.json')))).toString());
  const template = (await read(path.join(__dirname, 'template.html'))).toString();

  const html = ejs.render(template, { days: schedule });
  await write(path.join(__dirname, 'index.html'), html);
})();
