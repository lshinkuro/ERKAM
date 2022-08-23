/** @format */

import React from "react";
import { Form, Select } from "antd";
import { useSelector } from "react-redux";
const FilterMadrasah = ({ handleChangeValues }) => {
  const store = useSelector((state: any) => state.store);
  const [form] = Form.useForm();
  const refProvinsi = store.provinsi || [];
  const refKabkota = store.kabkota || [];
  const tmpJenjang = store.jenjang || [];
  const [provinsi, setProvinsi] = React.useState<any>(null);
  const refStatus = [
    { id: "status01", kode: "0", nama: "Belum Aktif" },
    { id: "status02", kode: "1", nama: "Aktif" },
  ];

  const handleChange = (values) => {
    for (let obj in values) {
      if (obj === "provinsi") {
        setProvinsi(values.provinsi);
        form.setFieldsValue({ kabkota: null });
      }
    }

    changeField();
  };

  const changeField = () => {
    const val = form.getFieldsValue();
    let tmpFilter: any = {
      provinsi: null,
      kabkota: null,
      jenjang: [],
      status: null,
    };
    for (let obj in val) {
      switch (obj) {
        case "provinsi":
          tmpFilter = {
            ...tmpFilter,
            provinsi: val.provinsi || null,
            kabkota: null,
          };
          break;
        case "kabkota":
          tmpFilter = { ...tmpFilter, kabkota: val.kabkota || null };
          break;
        case "jenjang":
          tmpFilter = { ...tmpFilter, jenjang: val.jenjang || [] };
          break;
        case "status":
          tmpFilter = { ...tmpFilter, status: val.status || null };
          break;
      }
    }
    handleChangeValues(tmpFilter);
  };

  return (
    <div className="m-5 p-5 bg-white shadow-md rounded">
      <Form
        form={form}
        key="formFilter"
        name="formFilter"
        onValuesChange={handleChange}
        layout="vertical">
        <div className="grid grid-cols-1  md:items-center  md:grid-cols-2 gap-4 ">
          <div>
            <Form.Item label="Provinsi" name="provinsi">
              <Select showSearch placeholder="Pilih Provinsi" allowClear>
                {refProvinsi.length &&
                  refProvinsi.map((e: any) => {
                    return (
                      <Select.Option key={`pro${e.kode}`} value={e.kode}>
                        {e.nama}
                      </Select.Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </div>
          <div>
            <Form.Item label="Kabupatan/Kota" name="kabkota">
              <Select showSearch placeholder="Pilih Kabupaten/Kota" allowClear>
                {refKabkota.length &&
                  provinsi &&
                  refKabkota
                    .filter((item) => item.kode_provinsi === provinsi)
                    .map((e: any) => {
                      return (
                        <Select.Option key={`kab${e.kode}`} value={e.kode}>
                          {e.nama}
                        </Select.Option>
                      );
                    })}
              </Select>
            </Form.Item>
          </div>
          <div>
            <Form.Item label="Jenjang" name="jenjang">
              <Select
                showSearch
                placeholder="Pilih Jenjang"
                allowClear
                mode="multiple"
                optionFilterProp="children">
                {tmpJenjang.length &&
                  tmpJenjang.map((e: any) => {
                    return (
                      <Select.Option key={`jenjang${e.kode}`} value={e.kode}>
                        {e.nama}
                      </Select.Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </div>
          <div>
            <Form.Item label="Status Madrasah" name="status">
              <Select showSearch placeholder="Pilih Status" allowClear>
                {refStatus.length &&
                  refStatus.map((e: any) => {
                    return (
                      <Select.Option key={`status${e.id}`} value={e.kode}>
                        {e.nama}
                      </Select.Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};
export default FilterMadrasah;
