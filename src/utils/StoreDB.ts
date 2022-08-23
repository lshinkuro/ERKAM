/** @format */

import { openDB, IDBPDatabase } from "idb";

const dbRkamStore = openDB("rkam", 1, {
  upgrade(db: IDBPDatabase) {
    db.createObjectStore("rkamStore");
  },
});

export const getStoreDB = async (key): Promise<any> => {
  try {
    const res = (await dbRkamStore).get("rkamStore", key);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const getAllStoreDB = async (): Promise<any> => {
  try {
    const res = (await dbRkamStore).getAll("rkamStore");
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const setStoreDB = async (key, val) => {
  try {
    const res = (await dbRkamStore).put("rkamStore", val, key);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const deleteStoreDB = async (key) => {
  try {
    const res = (await dbRkamStore).delete("rkamStore", key);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const clearStoreDB = async () => {
  try {
    const res = (await dbRkamStore).clear("rkamStore");
    return res;
  } catch (err) {
    console.log(err);
  }
};

export async function keysStoreDB() {
  return (await dbRkamStore).getAllKeys("rkamStore");
}

// export const keysStoreDB = async () => {
//   try {
//     const res = (await dbRkamStore).getAllKeys("rkamStore");
//     return res;
//   } catch (err) {
//     console.log(err);
//   }
// };
