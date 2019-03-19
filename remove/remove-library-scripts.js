module.exports = removeLibraryScripts;
const CWD = process.cwd(), fs = require('fs'), path = require('path');
async function removeLibraryScripts (args, options, logger) {
    if (!args.library)
        throw new Error('No library specified');
    logger.info(`${options.dry?'Previewing':'Generating'} library-scripts for ${args.library} on ${CWD}/package.json`);
    const FileOperations = new (require('../file-operations'))(args, options, logger);
    var targetPackagePath = path.join(CWD,'package.json'), targetPackageJson = await FileOperations.read(targetPackagePath);
    var augmentedScriptStanza = reduceScriptStanza(targetPackageJson.scripts, args.library);
    logger.info(`${options.dry?'Preview':'Updated'} scripts:`)
    logger.info(augmentedScriptStanza);
    targetPackageJson.scripts = augmentedScriptStanza;
    if (!options.dry) {
        return FileOperations.update(targetPackagePath, targetPackageJson)
    }
    return targetPackageJson;
}
/**
 * Remove generated scripts to build / watch / package a library inside the current `package.json` `"scripts"` stanza
 * @param {*} originalScriptStanza 
 * @param {*} library 
 */
function reduceScriptStanza(originalScriptStanza, library) {
    const scriptSet = require('../library-script-templates')
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