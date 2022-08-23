/** @format */

import React from "react";
import { Form, Select } from "antd";

type filterProps = {
  form: any;
  tmpStandarPendidikan: any;
  standarPendidikan: any;
  tmpKegiatan: any;
  kegiatan: any;
  tmpSubKegiatan: any;
  handleChangeSelect: (values: any, action: string) => void;
};

const FilterRincian = ({
  form,
  standarPendidikan,
  tmpStandarPendidikan,
  tmpKegiatan,
  kegiatan,
  tmpSubKegiatan,
  handleChangeSelect,
}: filterProps) => (
  <div className="m-5 p-5 bg-white shadow-md rounded">
    <Form form={form} key="formFilter" name="formFilter" layout="vertical">
      <div className="flex  flex-col  md:flex-row gap-2 ">
        <div className="flex-1">
          <Form.Item
            label="Standar Nasional"
            name="standarPendidikan"
            rules={[
              {
                required: true,
                message: "Standar Nasional tidak boleh kosong!",
              },
            ]}>
            <Select
              showSearch
              placeholder="Standar Nasional"
              allowClear
              onSelect={(values) =>
                handleChangeSelect(values, "standarPendidikan")
              }>
              {tmpStandarPendidikan.length &&
                tmpStandarPendidikan.map((e: any, i: any) => {
                  return (
                    <Select.Option key={`snp${i}`} value={e.kode}>
                      {e.nama}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>
        </div>
        <div className="flex-1">
          <Form.Item
            label="Kegiatan"
            name="kegiatan"
            rules={[
              {
                required: true,
                message: "Kegiatan tidak boleh kosong!",
              },
            ]}>
            <Select
              showSearch
              optionFilterProp="children"
              onSelect={(values) => handleChangeSelect(values, "kegiatan")}
              placeholder="Pilih Kegiatan">
              {standarPendidikan &&
                tmpKegiatan
                  .filter((item: any) => item.kode_snp === standarPendidikan)
                  .map((e: any, i: any) => {
                    return (
                      <Select.Option key={`keg${i}`} value={e.kegiatan.kode}>
                        {e.kegiatan.nama}
                      </Select.Option>
                    );
                  })}
            </Select>
          </Form.Item>
        </div>
        <div className="flex-1">
          <Form.Item
            label="Sub Kegiatan"
            name="subKegiatan"
            rules={[
              {
                required: true,
                message: "Sub Kegiatan tidak boleh kosong!",
              },
            ]}>
            <Select
              showSearch
              optionFilterProp="children"
              onSelect={(values) => handleChangeSelect(values, "subKegiatan")}
              placeholder="Pilih Sub Kegiatan">
              {kegiatan &&
                tmpSubKegiatan
                  .filter((e: any) => e.kode_kegiatan === kegiatan)
                  .map((e: any, i: any) => {
                    return (
                      <Select.Option key={`subKeg${i}`} value={e.kode}>
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
export default FilterRincian;
