/** @format */

import React, { useState, useEffect } from "react";

import { Form, Select, TreeSelect } from "antd";
import { useSelector } from "react-redux";
import { treeNested, treeNestedBelanja } from "../../../../utils/helper";

type filterProps = {
  handleChangeValues: (values: any) => void;
};

const FilterKomponentBiaya = ({ handleChangeValues }: filterProps) => {
  const [form] = Form.useForm();
  const store = useSelector((state: any) => state.store);
  const auths = useSelector((state: any) => state.auth);
  const auth = auths?.data;
  const groupRole = auth?.group_role;
  const [provinsi, setProvinsi] = useState<any>(null);
  const refProvinsi = store.provinsi || [];
  const refKabkota = store.kabkota || [];
  const tmpKategoriKomponenBiaya = store.kategoriKomponenBiaya || [];
  const tmpKategoriBelanja = store.kategoriBelanja || [];
  const dataSelectKategoriBiaya = treeNested(tmpKategoriKomponenBiaya);
  const dataSelectJenisBiaya = treeNestedBelanja(tmpKategoriBelanja);

  useEffect(() => {
    if (groupRole === "kabkota") {
      form.setFieldsValue({ provinsi: auth?.kantor_kabkota?.kode_provinsi });
      setProvinsi(auth?.kantor_kabkota?.kode_provinsi);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupRole]);
  const handleChange = (values) => {
    for (let obj in values) {
      if (obj === "provinsi") {
        setProvinsi(values.provinsi);
        form.setFieldsValue({ kabkota: null, madrasah: null });
      }
    }

    changeField();
  };

  const changeField = () => {
    const val = form.getFieldsValue();

    let tmpFilter: any = {
      provinsi: null,
      kabkota: null,
      kategoriKomponenBiaya: null,
      jenisBelanja: null,
    };
    for (let obj in val) {
      switch (obj) {
        case "provinsi":
          tmpFilter = { ...tmpFilter, provinsi: val.provinsi || null };
          break;

        case "kabkota":
          tmpFilter = { ...tmpFilter, kabkota: val.kabkota || null };
          break;
        case "kategoriKomponenBiaya":
          tmpFilter = {
            ...tmpFilter,
            kategoriKomponenBiaya: val.kategoriKomponenBiaya || null,
          };
          break;
        case "jenisBelanja":
          tmpFilter = { ...tmpFilter, jenisBelanja: val.jenisBelanja || null };
          break;
      }
    }
    handleChangeValues(tmpFilter);
  };

  return (
    <div className="m-5 p-5 bg-white shadow-md rounded">
      <Form
        form={form}
        key="formFilterKomponentBiaya"
        name="formFilterKomponentBiaya"
        layout="vertical"
        onValuesChange={handleChange}>
        <div className="grid grid-cols-1  md:items-center  md:grid-cols-2 gap-4 ">
          {groupRole !== "madrasah" && (
            <>
              {groupRole !== "kabkota" && (
                <div>
                  <Form.Item label="Provinsi" name="provinsi" required>
                    <Select placeholder="Pilih Provinsi" showSearch allowClear>
                      {refProvinsi.length &&
                        refProvinsi.map((item) => (
                          <Select.Option
                            key={`filProv${item.kode}`}
                            value={item.kode}>
                            {item.nama}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                </div>
              )}
              <div>
                <Form.Item label="Kab / Kota" name="kabkota" required>
                  <Select placeholder="Pilih Kab / Kota" showSearch allowClear>
                    {refKabkota.length &&
                      provinsi &&
                      refKabkota
                        .filter((item) => item.kode_provinsi === provinsi)
                        .map((item) => (
                          <Select.Option
                            key={`filKab${item.kode}`}
                            value={item.kode}>
                            {item.nama}
                          </Select.Option>
                        ))}
                  </Select>
                </Form.Item>
              </div>
            </>
          )}
          <div>
            <Form.Item
              label="Kategori Komponen Biaya"
              name="kategoriKomponenBiaya">
              <TreeSelect
                showSearch
                style={{ width: "100%" }}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                placeholder="Kategori Komponen Biaya"
                allowClear
                treeData={dataSelectKategoriBiaya}
              />
            </Form.Item>
          </div>
          <div>
            <Form.Item label="Jenis Belanja" name="jenisBelanja">
              <TreeSelect
                showSearch
                style={{ width: "100%" }}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                placeholder="Jenis Belanja"
                allowClear
                treeData={dataSelectJenisBiaya}
              />
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};
export default FilterKomponentBiaya;
