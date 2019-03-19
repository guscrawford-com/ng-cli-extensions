module.exports = removeLibraryScripts;
const CWD = process.cwd(), fs = require('fs'), path = require('path');
async function removeLibraryScripts (args, options, logger) {
    if (!args.library)
        throw new Error('No library specified');
    logger.info(`${options.dry?'Previewing':'Generating'} library-scripts for ${args.library} on ${CWD}/package.json`);
    const pkg = new (require('../package-operations'))(args, options, logger);
    var targetPackagePath = path.join(CWD,'package.json'), targetPackageJson = await pkg.read(targetPackagePath);
    var augmentedScriptStanza = reduceScriptStanza(targetPackageJson.scripts, args.library);
    logger.info(augmentedScriptStanza);
    Object.assign(targetPackageJson.scripts, augmentedScriptStanza);
    return pkg.update(targetPackageJson, targetPackagePath)
}
/**
 * Remove generated scripts to build / watch / package a library inside the current `package.json` `"scripts"` stanza
 * @param {*} originalScriptStanza 
 * @param {*} library 
 */
function reduceScriptStanza(originalScriptStanza, library) {
    const scriptSet = {
        'npm-pack':(lib)=>`cd dist/${lib} && npm pack`,
        'build-watch':(lib)=>`ng build --watch ${lib}`,
        'build-lib':(lib)=>`ng build --prod ${lib}`,
        'copy-assets':(lib)=>`xcopy \"projects/${lib}/src/assets\" \"dist/${lib}/assets\" /e /i /y /s`,
        'package':(lib)=>`yarn build-lib-${lib} && yarn copy-assets-${lib} && yarn npm-pack-${lib}`,
        'preview':(lib)=>`cd dist/${lib} && (yarn unlink || yarn link) && yarn link`
    }
    var expandScriptStanza = Object.assign({}, originalScriptStanza);
    Object.keys(scriptSet).forEach(scriptName=>{
        delete expandScriptStanza[`${scriptName}-${library}`];
        var shortHandDefinition = Object.keys(expandScriptStanza)
            .filter(k=>k.startsWith(scriptName)&&k!==scriptName) // combine all preview-x into preview:"yarn preview-x && ..."
            .map(subScript=>`yarn ${subScript}`);
        if (shortHandDefinition && shortHandDefinition.length)
            expandScriptStanza[scriptName] = shortHandDefinition.join(' && ');
        else delete expandScriptStanza[scriptName];
    });
    return expandScriptStanza;
}