module.exports = FileOperations;
const CWD = process.cwd(), {readFile, writeFile} = require('fs');
function FileOperations (args, options, logger, ) {
    this.read = readAndParseJson;
    this.update = updateJson;
    async function readAndParseJson(targetPackagePath) {
        var targetPackage, targetPackageJson;
        try {
            targetPackage = await read(targetPackagePath);
        } catch (e) {
            logger.error(`Failed to read file at ${targetPackagePath}\n\t(${e})`);
            throw e;
        }
        try {
            targetPackageJson = JSON.parse(targetPackage);
        } catch (e) {
            logger.error(`Failed to parse JSON from file at ${targetPackagePath}\n\t(${e})`);
            throw e;
        }
        return targetPackageJson;
    }
    async function updateJson(targetPackagePath, targetPackageJson) {
        try {
            var asJson = JSON.stringify(targetPackageJson, null, '  ');
            if (!options.dry)
                await write(targetPackagePath, asJson);
            else {
                logger.info(`Preview: ${targetPackagePath}`);
                logger.info(asJson);
            }
        } catch (e) {
            console.error(`Failed to update JSON from file at ${targetPackagePath}\n\t(${e})`);
            throw e;
        }
    }
}

function read(path) {
    return new Promise((res,rej)=>readFile(path, {encoding:'utf-8'}, (err,data)=>err?rej(err):res(data)));
}
function write(path, data) {
    return new Promise((res,rej)=>writeFile(path, data, (err)=>err?rej(err):res(data)));
}