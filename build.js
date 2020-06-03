const fs = require('fs');
const { promisify } = require('util');
const path = require('path');

const marked = require('marked');
const fm = require('frontmatter');
const ejs = require('ejs');
const globby = require('globby');

marked.setOptions({
  gfm: true,
  smartypants: true,
  smartLists: true,
});

const read = promisify(fs.readFile);
const write = promisify(fs.writeFile);

const getPermalink = (f) => {
  const [, permalink] = f.split(/[\/.]/g);
  return permalink;
};

(async () => {
  const schedule = JSON.parse((await read(path.join(__dirname, 'schedule.json'))).toString());
  const template = (await read(path.join(__dirname, 'template.html'))).toString();

  const files = await globby(['descriptions/*.md']);
  const descriptions = await Promise.all(
    files.map(async (f) => {
      const { data, content } = fm((await read(f)).toString());
      return {
        permalink: getPermalink(f),
        description: marked(content),
        title: data && data.title,
      };
    }),
  );

  const html = ejs.render(template, {
    days: schedule.days,
    descriptions,
  });
  await write(path.join(__dirname, 'index.html'), html);
})();
