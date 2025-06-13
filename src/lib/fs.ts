import fs from "fs";

interface WriteFileOptions {
  deleteIfExists?: boolean;
  createDirIfNotExists?: boolean;
}

export function deleteFileIfExists(path: string) {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}

export function writeFile(
  fileName: string,
  path: string,
  content: string,
  options?: WriteFileOptions
) {
  const qualifiedPath = `${path}/${fileName}`;
  console.log("qualifiedPath", qualifiedPath);
  if (options?.deleteIfExists === undefined ? true : options.deleteIfExists) {
    deleteFileIfExists(qualifiedPath);
  }
  if (
    options?.createDirIfNotExists === undefined
      ? true
      : options.createDirIfNotExists
  ) {
    fs.mkdirSync(path, { recursive: true });
  }
  fs.writeFileSync(qualifiedPath, content);
}


