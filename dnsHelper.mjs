import { writeFile, mkdir } from "node:fs/promises";
import dig from "node-dig-dns";

import { domains } from "./data/domains.mjs";

const getEpoch = () => Math.floor(new Date().getTime() / 1000);

const setTimeOut = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
};

const createDirectory = () => {
  const directoryName = `./data/${getEpoch()}`;
  mkdir(directoryName, { recursive: true }, (err) => {
    if (err) throw err;
  });
  return directoryName;
};

const saveToFile = (fileName, data) => {
  try {
    writeFile(fileName, JSON.stringify(data, null, 2));
    console.log(`Saved data to ${fileName}.`);
  } catch (error) {
    console.error(`Error saveToFile: ${error.message}`);
  }
};

const execCommand = async (domains, directoryName) => {
  for (const domain of domains) {
    try {
      const name = domain.name;
      const record = domain.record || "ANY";
      const data = await dig([name, record]);

      saveToFile(`${directoryName}/${getEpoch()}-${name}-${record}.json`, data);
      await setTimeOut();
    } catch (error) {
      console.error(`Error execCommand: ${error.message}`);
    }
  }
};

const init = async (domains) => {
  try {
    execCommand(domains, createDirectory());
  } catch (error) {
    console.error(`Error init: ${error.message}`);
  }
};

init(domains);
