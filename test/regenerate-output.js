import fs from 'fs'
import test from 'ava'
import pify from 'pify'
import childProcess from 'child_process'

const cssOutput = fs.readFileSync('test/fixtures/output.css', 'utf8').trim()
const cssRepeatOutput = fs.readFileSync('test/fixtures/output.repeat.css', 'utf8').trim()
const docsOutput = fs.readFileSync('test/fixtures/output.md', 'utf8').trim()
const docsAuthorsOutput = fs.readFileSync('test/fixtures/output-dynamic-authors.md', 'utf8').trim()

test('processes source code', async t => {
  const stdout = await pify(childProcess.execFile)('cli.js', ['test/fixtures/input.css'], { cwd: __dirname })
  fs.writeFileSync('test/fixtures/output.css', stdout.trim())
  t.pass()
})

test('processes source code and repeats classes', async t => {
  const stdout = await pify(childProcess.execFile)('cli.js', ['test/fixtures/input.css', '--repeat=4'], { cwd: __dirname })
  fs.writeFileSync('./test/fixtures/output.repeat.css', stdout.trim())
  t.pass()
})

test('documents a module', async t => {
  const stdout = await pify(childProcess.execFile)(
    'cli.js', [
      'node_modules/tachyons-type-scale/src/tachyons-type-scale.css',
      '--generate-docs',
      '--package=node_modules/tachyons-type-scale/package.json',
      '--template=templates/readme.md'
    ]
  )

  fs.writeFileSync('test/fixtures/output.md', stdout.trim())
  t.pass()
})

test('documents a module with dynamic authors', async t => {
  const stdout = await pify(childProcess.execFile)(
    'cli.js', [
      'node_modules/tachyons-type-scale/src/tachyons-type-scale.css',
      '--generate-docs',
      '--package=node_modules/tachyons-type-scale/package.json',
      '--template=templates/readme.md',
      '--authors'
    ]
  )

  fs.writeFileSync('test/fixtures/output-dynamic-authors.md', stdout.trim())
  t.pass()
})
