#!/usr/bin/env node

const path = require('path');
const cp = require('child_process');
const util = require('util');
const fs = require('fs-extra');
const prompts = require('prompts');
const color = require('colorette');

const executable = util.promisify(cp.spawn);
const NAME_RE = /^@?[a-zA-Z0-9\/\-_]*$/;

(async () => {
  const response = await prompts([{
    type: 'text',
    name: 'name',
    message: 'Please enter the project name',
    validate: name => NAME_RE.test(name) ? true : 'Only English, @, -, _, /, characters are allowed.',
  }, {
    type: 'text',
    name: 'description',
    message: 'Please enter the project description',
  }]);

  const cwd = process.cwd();
  const projDir = path.join(cwd, response.name);
  await fs.mkdir(projDir);

  try {
    // console.log(response); // => { value: 24 }

    const srcPath = path.join(__dirname, '..', 'boilerplate');
    await fs.copy(srcPath, projDir);

    const pkgPath = path.join(projDir, 'package.json');
    const pkg = await fs.readJSON(path.join(projDir, 'package.json'));

    pkg.name = response.name;
    pkg.description = response.description;
    await fs.writeJSON(pkgPath, pkg, { spaces: 2 });

    // npm install
    await executable('npm', ['install'], {
      cwd: projDir,
      env: process.env,
      stdio: 'inherit',
    });

    console.log(color.green('done.'));
  } catch (err) {
    console.error(err);
    await fs.remove(projDir);
  }

})();