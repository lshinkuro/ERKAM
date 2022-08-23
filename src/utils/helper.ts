/** @format */

export const removeDuplicate = function (arr: any, attr: any, value: any): any {
  var i = arr.length;
  while (i--) {
    if (
      arr[i] &&
      arr[i].hasOwnProperty(attr) &&
      arguments.length > 2 &&
      arr[i][attr] === value
    ) {
      arr.splice(i, 1);
    }
  }
  return arr;
};

export const getBulan = (bulan: number): string => {
  const daftarBulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  if (bulan > 0 && bulan <= 12) return daftarBulan[bulan];
  else return "-";
};

export const uuidv4 = () => {
  return ([1e7].toString() + -1e3 + -4e3 + -8e3 + -1e11).replace(
    /[018]/g,
    (c: any) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16),
  );
};

export const getTriwulan = (str) => {
  if (str <= 3) {
    return "Triwulan 1";
  } else if (str <= 6) {
    return "Triwulan 2";
  } else if (str <= 9) {
    return "Triwulan 3";
  } else if (str <= 12) {
    return "Triwulan 4";
  }
};

export const sheet_to_blob = (s) => {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i <= s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
};

export const toTitleCase = (str) => {
  return str
    .replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    })
    .replace(/_/g, " ");
};

export const getJumlahSumberDana = (id, tmpSumberDana) => {
  return tmpSumberDana
    .filter((item) => item.id.includes(id))
    .map((item) => item.jumlah);
};
export const usulanKegiatanStatus = (
  sts: number,
): {
  text: string;
  color: "success" | "danger" | "warning" | "neutral" | "primary";
} => {
  if (sts === 0) return { text: "Menunggu", color: "warning" };
  if (sts === 1) return { text: "Disetujui", color: "success" };
  if (sts === 9) return { text: "Ditolak", color: "danger" };
  return { text: "Menunggu", color: "warning" };
};
export const formatRupiah = (money: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(money);
};

export const formatCurr = (money: number) => {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
  }).format(money);
};

export const isObject = (obj: any) => {
  return obj != null && obj.constructor.name === "Object";
};

export const treeNested = (tmpData: any) => {
  let data: any =
    (tmpData.length &&
      tmpData.map((item: any) => {
        return {
          id: item.id,
          kode: item.kode,
          value: item.kode,
          title: `${item.kode} - ${item.nama}`,
          parent: item.parent,
        };
      })) ||
    [];
  let obj: any = [];
  for (const i in data) {
    let _elem: any = data[i];
    if (_elem.parent) {
      let _parentId: any = _elem.parent;
      if (_parentId === _elem.kode) {
        // check children, if false - add
        if (!_elem.children) {
          _elem.children = [];
        }
        _elem.children.push(_elem);
      } else {
        addChildToParent(_elem, _parentId);
      }
    } // is root
    else {
      obj.push(_elem);
    }
  }

  function addChildToParent(child, parentId) {
    for (const j in data) {
      if (data[j].kode.toString() === parentId.toString()) {
        if (!data[j].children) {
          data[j].children = [];
        }
        data[j].children.push(child);
      }
    }
  }
  return obj;
};

export const treeNestedBelanja = (tmpData: any) => {
  let data: any = tmpData.map((item: any) => {
    return {
      kode: item.kode,
      value: item.kode,
      title: `${item.kode} - ${item.nama}`,
      children: item.list_jenis_belanja.length
        ? item.list_jenis_belanja.map((itemChild: any) => {
            return {
              kode: itemChild.kode,
              value: itemChild.kode,
              title: `${itemChild.kode} - ${itemChild.nama}`,
            };
          })
        : null,
    };
  });

  return data;
};
