const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

glob('**/*.yml', { cwd: path.resolve(__dirname) }, function(err, files) {
  files.forEach(file => {
    const doc = yaml.safeLoad(
      fs.readFileSync(`${path.resolve(__dirname)}/${file}`, 'utf8')
    );

    const fileNameWithoutExtension = path.parse(file).name;

    fs.writeFileSync(
      `${path.resolve(__dirname)}/${fileNameWithoutExtension}.json`,
      JSON.stringify(doc)
    );
  });
});
