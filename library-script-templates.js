/**
 * A master set of scripts to tack on to the package.json "scripts" stanza for each `ng cli library <lib-name>` generated
 */
module.exports = {
    'npm-pack':(lib)=>`cd dist/${lib} && npm pack`,
    'build-watch':(lib)=>`ng build --watch ${lib}`,
    'build-lib':(lib, options)=>`ng build ${options.prod?'--prod ':''}${lib}`,
    'copy-assets':(lib)=>`xcopy \"projects/${lib}/src/assets\" \"dist/${lib}/assets\" /e /i /y /s`,
    'package':(lib)=>`yarn build-lib-${lib} && (yarn copy-assets-${lib} || echo Skipping assets...) && yarn npm-pack-${lib}`,
    'yarn-link':(lib)=>`yarn build-lib-${lib} && cd dist/${lib} && (yarn unlink || echo Skipping unlink...) && yarn link`,
    'link-lib':(lib, options)=>`yarn yarn-link-${lib} && yarn link ${options.org?options.org+'/':''}${lib}`,
    'uninstall-lib':(lib)=>`yarn remove ${npmNamespace(lib)}`,
    'install-lib':(lib)=>`yarn package-${lib} && yarn add file:dist/${lib}/${tarballName(lib)}`
};
const { join } = require('path')
function tarballName (lib) {
    var libPackage = require(join(process.cwd(), 'projects', lib, 'package')),
    libPackageName = libPackage.name.replace(/@/g,'').replace(/\//g,'-');
    return `${libPackageName}-${libPackage.version}.tgz`;
}
function npmNamespace (lib) {
    var libPackage = require(join(process.cwd(), 'projects', lib, 'package'));
    return libPackage.name;
}