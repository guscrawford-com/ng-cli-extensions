module.exports = generateLibraryScripts;
const CWD = process.cwd(), {join} = require('path'), TARGET_PACKAGE_PATH = join(CWD,'package.json'), TARGET_ANGULAR_PATH = join(CWD,'angular.json');
async function generateLibraryScripts (args, options, logger) {
    const FileOperations = new( require('../../file-operations'))(args, options, logger);
    if (!args.library) {
        logger.error('No library specified');
        process.exit(1);
    }
    try {
        var angularWorkspaceJson = await FileOperations.read(TARGET_ANGULAR_PATH);
    } catch (e) {
        logger.error(`${CWD} is not the root of an angular workspace...`);
        process.exit(1);
    }

    logger.info(angularWorkspaceJson);
    logger.info(`${options.dry?'Previewing':'Generating'} library-scripts for ${args.library} on ${TARGET_PACKAGE_PATH}`);
    var targetPackageJson = await FileOperations.read(TARGET_PACKAGE_PATH);
    var augmentedScriptStanza = augmentScriptStanza(targetPackageJson.scripts, args.library, options);
    logger.info(augmentedScriptStanza);
    Object.assign(targetPackageJson.scripts, augmentedScriptStanza);
    return FileOperations.update(TARGET_PACKAGE_PATH, targetPackageJson);
}
/**
 * Augment an existing `package.json` `"scripts"` stanza with scripts to build / watch / package a particular library
 * @param {*} originalScriptStanza 
 * @param {*} library 
 */
function augmentScriptStanza(originalScriptStanza, library, options) {
    const SCRIPT_SET = require('../../library-script-templates');
    var expandScriptStanza = Object.assign({}, originalScriptStanza);
    Object.keys(SCRIPT_SET).forEach(scriptName=>{
        expandScriptStanza[`${scriptName}-${library}`] = SCRIPT_SET[scriptName](library, options);
        expandScriptStanza[scriptName] = Object.keys(expandScriptStanza)
        .filter(k=>k.startsWith(scriptName)&&k!==scriptName) // combine all preview-x into preview:"yarn preview-x && ..."
        .map(subScript=>`yarn ${subScript}`).join(' && ');
    });
    return expandScriptStanza;
}