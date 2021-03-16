const fs = require('fs');

const filesList = fs.readdirSync('./dist/resources/lambda', { withFileTypes: true })
  .filter(file => file.name.split('.').pop() === 'js')
  .map(file => 'dist/resources/lambda/' + file.name)

require('esbuild').build({
  entryPoints: [...filesList],
  bundle: true,
  outdir: 'bundled',
  platform: 'node',
}).catch(() => process.exit(1))