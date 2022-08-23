/** @format */

import { IDBPDatabase, openDB } from "idb";
import { add, edit, del } from "../services/v2/planningservice/pagudefinitif";

class IndexedDb {
  private database: string;
  private db: any;

  constructor(database: string) {
    this.database = database;
  }

  public async createObjectStore(tableNames: string[]) {
    try {
      this.db = await openDB(this.database, 1, {
        upgrade(db: IDBPDatabase) {
          for (const tableName of tableNames) {
            if (db.objectStoreNames.contains(tableName)) {
              continue;
            }
            db.createObjectStore(tableName, {
              autoIncrement: true,
              keyPath: "id",
            });
          }
        },
      });
    } catch (error) {
      return false;
    }
  }

  public async getValue(tableName: string, id: number) {
    const tx = this.db.transaction(tableName, "readonly");
    const store = tx.objectStore(tableName);
    const result = await store.get(id);
    // console.log('Get Data ', JSON.stringify(result));
    return result;
  }

  public async getAllValue(tableName: string) {
    const tx = this.db.transaction(tableName, "readonly");
    const store = tx.objectStore(tableName);
    const result = await store.getAll();
    // console.log('Get All Data');
    // console.log(result);
    return result;
  }

  public async putValue(tableName: string, value: object) {
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    const result = await store.put(value);
    // console.log('Put Data ', JSON.stringify(result));
    return result;
  }

  public async putBulkValue(tableName: string, values: object[]) {
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    for (const value of values) {
      const result = await store.put(value);
      // console.log('Put Bulk Data ', JSON.stringify(result));
    }
    return this.getAllValue(tableName);
  }

  public async deleteValue(tableName: string, id: number) {
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    const result = await store.get(id);
    if (!result) {
      console.log("Id not found", id);
      return result;
    }
    await store.delete(id);
    // console.log('Deleted Data', id);
    return id;
  }

  public async syncToRealDb(tableName: string) {
    let allActionData = await this.getAllValue(tableName);
    let success = false;
    if (tableName === "rencana-pendapatan-definitif-offline-action") {
      if (
        allActionData !== null &&
        allActionData !== undefined &&
        allActionData.length !== 0
      ) {
        allActionData.forEach((item) => {
          if (item.action === "tambah") {
            add(item.data)
              .then(async (data) => {
                success = true;
                console.log(
                  `[Add] Snyc Success From index db action idx #${item.id}`,
                );
                await this.deleteValue(tableName, item.id);
                console.log(
                  `Delete Success From index db action idx #${item.id}`,
                );
              })
              .catch((errror) => {
                console.log(errror);
              });
          } else if (item.action === "ubah") {
            edit(item.data.id, item.data)
              .then(async (data) => {
                success = true;
                console.log(
                  `[Edit] Snyc Success From index db action idx #${item.id}`,
                );
                await this.deleteValue(tableName, item.id);
                console.log(
                  `Delete Success From index db action idx #${item.id}`,
                );
              })
              .catch((errror) => {
                console.log(errror);
              });
          } else if (item.action === "hapus") {
            del(item.data)
              .then(async (data) => {
                success = true;
                console.log(
                  `[Delete] Snyc Success From index db action idx #${item.id}`,
                );
                await this.deleteValue(tableName, item.id);
                console.log(
                  `Delete Success From index db action idx #${item.id}`,
                );
              })
              .catch((errror) => {
                console.log(errror);
              });
          }
        });
      }
    }
    return success;
  }
}

export { IndexedDb };
