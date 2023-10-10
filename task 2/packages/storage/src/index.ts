import { StorageMethods } from "../../common/constants";
import { Transport } from "../../common/Transport";
import * as TestController from './controllers/Test.controller'
import { initializeDB } from "./repository";

export const transport = new Transport();

(async () => {
  try {
    await initializeDB();

    await transport.connect();

    // Test
    transport.subscribe(StorageMethods.Test.find, TestController.find)


  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
