/** @format */

import React from "react";
import { Descriptions, Tag } from "antd";
import moment from "moment";
import "moment/locale/id";

type descriptionRincianProps = {
  title: string;
  tmpDataBelanja: any;
};

const DescriptionRincian = ({
  title,
  tmpDataBelanja,
}: descriptionRincianProps) => (
  <div className="m-5 p-5 bg-white shadow-md rounded">
    <div className="flex  flex-col  md:flex-row gap-2 ">
      <div className="flex-1">
        <Descriptions layout="vertical" labelStyle={{ fontWeight: "bold" }}>
          <Descriptions.Item label="Status Pagu" span={3}>
            {title}
          </Descriptions.Item>
          <Descriptions.Item label="Sasaran" span={3}>
            {tmpDataBelanja?.kelompok_sasaran?.length
              ? tmpDataBelanja?.kelompok_sasaran?.map(
                  (item: any, i: number) => (
                    <Tag key={`tagSasa${i}`} color="#00bcd4">
                      {item}
                    </Tag>
                  ),
                )
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Pelaksanaan" span={3}>
            {(tmpDataBelanja?.bulan_pelaksanaan_start &&
              moment(`2022-${tmpDataBelanja?.bulan_pelaksanaan_start}`).format(
                "MMMM",
              )) ||
              "-"}{" "}
            s/d{" "}
            {(tmpDataBelanja?.bulan_pelaksanaan_end &&
              moment(`2022-${tmpDataBelanja?.bulan_pelaksanaan_end}`).format(
                "MMMM",
              )) ||
              "-"}
          </Descriptions.Item>
        </Descriptions>
      </div>
      <div className="flex-1">
        <Descriptions
          size="small"
          title="Indikator Output"
          layout="vertical"
          bordered>
          <Descriptions.Item label="Output">
            {tmpDataBelanja?.indikator_output || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Target">
            {tmpDataBelanja?.indikator_output_target || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Satuan">
            {tmpDataBelanja?.indikator_output_satuan || "-"}
          </Descriptions.Item>
        </Descriptions>
      </div>
      <div className="flex-1">
        <Descriptions
          size="small"
          title="Indikator Hasil"
          layout="vertical"
          bordered>
          <Descriptions.Item label="Hasil">
            {tmpDataBelanja?.indikator_hasil || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Target">
            {tmpDataBelanja?.indikator_hasil_target || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Satuan">
            {tmpDataBelanja?.indikator_hasil_satuan || "-"}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  </div>
);
export default DescriptionRincian;
