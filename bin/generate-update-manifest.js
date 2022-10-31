import { readFileSync, writeFileSync } from 'fs';
import { argv } from 'process';
const { version } = JSON.parse(readFileSync('./package.json'));

const manifest = JSON.stringify({ 
    addons: {
        [argv[2]]: {
            updates: [{
                version,
                update_link: `https://github.com/hazzik/geni-merge-helper/releases/latest/download/geni-merge-helper.xpi`
            }]
        }
    }
});
writeFileSync('./web-ext-artifacts/update.json', manifest);