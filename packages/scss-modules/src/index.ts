import { writeFileSync } from "fs-extra";
import { getExportLocalsObject } from "./utils/getExportLocalsObject";
import { getTypingsFile } from "./utils/getTypingsFile";
import { getTypingsFilePath } from "./utils/getTypingsFilePath";
import { ensureDirectoryExists } from "./utils/ensureDirectoryExists";
import { generateSourceMap } from "./utils/generateSourceMap";

export default async function(this: any, src: string) {
    const async = this.async();

    if (async === undefined) {
        return;
    }

    const exportLocalsObject = JSON.parse(getExportLocalsObject(src));

    let typingsFile = getTypingsFile(exportLocalsObject);
    const typingsFilePath = getTypingsFilePath.call(this);

    ensureDirectoryExists(typingsFilePath.path);

    let generatedSourceMap;
    if (this.sourceMap) {
        generatedSourceMap = await generateSourceMap(
            src,
            exportLocalsObject,
            typingsFilePath.sourcePath,
            typingsFilePath.file,
        );
        writeFileSync(`${typingsFilePath.path}/${typingsFilePath.file}.d.ts.map`, generatedSourceMap.toString());

        typingsFile = `${typingsFile}\n\n/*# sourceMappingURL=${typingsFilePath.file}.map*/`;
    }

    writeFileSync(`${typingsFilePath.path}/${typingsFilePath.file}.d.ts`, typingsFile);

    this.addDependency(this.resourcePath);

    async(null, src);
}
