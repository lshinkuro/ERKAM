/** @format */

import React from "react";
import { Form, Select } from "antd";

type filterProps = {
  form: any;
  tmpSumberDana: any;
  tmpListMonth: any;
  handleChangeValues: (values: any, allValues: any) => void;
};

const FilterPengeluaranKegiatan = ({
  form,
  tmpSumberDana,
  tmpListMonth,
  handleChangeValues,
}: filterProps) => (
  <div className="m-5 p-5 bg-white shadow-md rounded">
    <Form
      form={form}
      key="formFilter"
      name="formFilter"
      onValuesChange={handleChangeValues}
      layout="vertical">
      <div className="grid grid-cols-1  md:items-center  md:grid-cols-3 gap-4 ">
        <div>
          <Form.Item label="Sumber Dana" name="sumberDana">
            <Select showSearch placeholder="Sumber Dana" allowClear>
              {tmpSumberDana.length &&
                tmpSumberDana.map((e: any, i: any) => {
                  return (
                    <Select.Option key={`sumber${i}`} value={e.id}>
                      {e.nama_sumber_dana}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Ketersediaan Nota" name="ketersediaanNota">
            <Select
              showSearch
              optionFilterProp="children"
              placeholder="Pilih Ketersediaan Nota"
              allowClear>
              <Select.Option value="TERSEDIA">Tersedia</Select.Option>
              <Select.Option value="BELUM_TERSEDIA">
                Belum Tersedia
              </Select.Option>
            </Select>
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Waktu Pelaksanaan" name="waktuPelaksanaan">
            <Select
              allowClear
              showSearch
              optionFilterProp="children"
              placeholder="Pilih Waktu Pelaksanaan">
              {tmpListMonth &&
                tmpListMonth.map((item: any, i: any) => {
                  return <Select.Option value={i + 1}>{item}</Select.Option>;
                })}
            </Select>
          </Form.Item>
        </div>
      </div>
    </Form>
  </div>
);
export default FilterPengeluaranKegiatan;
