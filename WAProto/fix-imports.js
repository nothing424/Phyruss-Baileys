import { readFileSync, writeFileSync } from 'fs';
import { argv, exit } from 'process';

const filePath = './index.js';

try {
  let content = readFileSync(filePath, 'utf8');
  content = content.replace(
    /import \* as (\$protobuf) from/g,
    'import $1 from'
  );
  content = content.replace(
    /(['"])protobufjs\/minimal(['"])/g,
    '$1protobufjs/minimal.js$2'
  );
  writeFileSync(filePath, content, 'utf8');
  
  console.log(`✅ Fixed imports in ${filePath}`);
} catch (error) {
  console.error(`❌ Error fixing imports: ${error.message}`);
  exit(1);
}
