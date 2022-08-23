/** @format */

import React, { useState } from "react";

import { Form, Select, DatePicker } from "antd";
import { useSelector } from "react-redux";

type filterProps = {
  handleChangeValues: (values: any) => void;
  groupRole: any;
  madrasah: any;
};

const FilterPeriode = ({
  handleChangeValues,
  groupRole,
  madrasah,
}: filterProps) => {
  const [form] = Form.useForm();
  const store = useSelector((state: any) => state.store);
  const [provinsi, setProvinsi] = useState<any>(null);
  const [kabkota, setKabkota] = useState<any>(null);
  const refProvinsi = store.provinsi || [];
  const refKabkota = store.kabkota || [];
  const refMadrasah = madrasah || [];

  const handleChange = (values) => {
    for (let obj in values) {
      if (obj === "provinsi") {
        setProvinsi(values.provinsi);
        form.setFieldsValue({ kabkota: null, madrasah: null });
      }
      if (obj === "kabkota") {
        setKabkota(values.kabkota);
        form.setFieldsValue({ madrasah: null });
      }
    }

    changeField();
  };

  const changeField = () => {
    const val = form.getFieldsValue();
    let tmpFilter: any = {
      madrasahId: null,
      periode: null,
    };
    for (let obj in val) {
      switch (obj) {
        case "madrasahId":
          tmpFilter = { ...tmpFilter, madrasahId: val.madrasahId || null };
          break;
        case "periode":
          tmpFilter = { ...tmpFilter, periode: val.periode || null };
          break;
      }
    }
    handleChangeValues(tmpFilter);
  };
  return (
    <div className="m-5 p-5 bg-white shadow-md rounded">
      <Form
        form={form}
        key="formFilterPeriode"
        name="formFilterPeriode"
        labelAlign="left"
        labelCol={{ span: 6 }}
        onValuesChange={handleChange}>
        <div className="grid grid-cols-1  md:items-center  md:grid-cols-2 gap-4 ">
          {groupRole !== "madrasah" && (
            <>
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
              <div>
                <Form.Item label="Madrasah" name="madrasahId" required>
                  <Select placeholder="Pilih Madrasah" showSearch allowClear>
                    {refMadrasah.length &&
                      provinsi &&
                      kabkota &&
                      refMadrasah
                        .filter(
                          (item) =>
                            item.kode_provinsi === provinsi &&
                            item.kode_kabkota === kabkota,
                        )
                        .map((item) => (
                          <Select.Option
                            key={`filMad${item.id}`}
                            value={item.id}>
                            {item.nama}
                          </Select.Option>
                        ))}
                  </Select>
                </Form.Item>
              </div>
            </>
          )}
          <div>
            <Form.Item label="Periode" name="periode" required>
              <DatePicker picker="month" />
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};
export default FilterPeriode;
