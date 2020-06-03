const fs = require('fs');
const { promisify } = require('util');
const path = require('path');

const marked = require('marked');
const ejs = require('ejs');

marked.setOptions({
  gfm: true,
  smartypants: true,
  smartLists: true,
});

const read = promisify(fs.readFile);
const write = promisify(fs.writeFile);

(async () => {
  const schedule = JSON.parse((await read(path.join(__dirname, 'schedule.json'))).toString());
  const template = (await read(path.join(__dirname, 'template.html'))).toString();

  const html = ejs.render(template, {
    days: schedule.days,
    descriptions: Object.keys(schedule.descriptions).map((k) => ({
      permalink: k,
      description: marked(schedule.descriptions[k]),
    })),
  });
  await write(path.join(__dirname, 'index.html'), html);
})();
