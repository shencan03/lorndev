import { promises } from "fs";

export async function writeJsonResponse(res: JSON) {
  const data = JSON.stringify(res);
  try {
    await promises.writeFile(`${process.cwd()}/response.json`, data);
  } catch (err: any) {
    throw new Error(err);
  }
}
