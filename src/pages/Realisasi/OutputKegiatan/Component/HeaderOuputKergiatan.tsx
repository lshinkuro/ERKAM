/** @format */

import React from "react";
import { Collapse, Descriptions, Card, Tag } from "antd";
import { uuidv4 } from "../../../../utils/helper";
import moment from "moment";
import "moment/locale/id";

const { Panel } = Collapse;

type outputKegiatanType = {
  rincian: any;
  data: any;
  tmpSumberDana: any;
};

const HeaderOutputKegiatan = ({
  rincian,
  data,
  tmpSumberDana,
}: outputKegiatanType) => {
  let listSumber: any = [];
  data.length &&
    data
      .filter((item: any) => item.kepalaMadrasahApproved === "DISETUJUI")
      .reduce((res, item) => {
        if (!res[item.rencanaPendapatanId]) {
          res[item.rencanaPendapatanId] = {
            pendapatanId: item.rencanaPendapatanId,
            qty: 0,
          };
          listSumber.push(res[item.rencanaPendapatanId]);
        }
        res[item.rencanaPendapatanId].qty += item.qtyOutput;
        return res;
      }, {});

  const listMonth = moment.months();
  const headerPanel = (
    <Descriptions
      size="small"
      layout="vertical"
      labelStyle={{ fontWeight: 600 }}>
      <Descriptions.Item label="SNP">{rincian?.nama_snp}</Descriptions.Item>
      <Descriptions.Item label="Kegiatan">
        {rincian?.nama_kegiatan}
      </Descriptions.Item>
      <Descriptions.Item label="Sub Kegiatan">
        {rincian?.nama_sub_kegiatan}
      </Descriptions.Item>
    </Descriptions>
  );

  const getNameSumberDana = (id: any) => {
    return (
      (tmpSumberDana.length &&
        tmpSumberDana
          .filter((item) => item.id.includes(id))
          .map((item) => item.nama_sumber_dana)) ||
      ""
    );
  };
  return (
    <div className="m-5 p-5 bg-white shadow-md rounded">
      <Collapse>
        <Panel
          className="headerOutputKegiatan"
          header={headerPanel}
          key={uuidv4()}>
          <Card
            size="small"
            title="Indikator Output"
            style={{ marginBottom: 20 }}>
            <div className="flex flex-col justify-between md:flex-row gap-2">
              <div>
                <Descriptions
                  size="small"
                  layout="vertical"
                  labelStyle={{ fontWeight: 600 }}>
                  <Descriptions.Item label="Sasaran">
                    {rincian?.kelompok_sasaran.map((item, i) => (
                      <Tag key={`ttop${i}`} color="#00bcd4">
                        {item}
                      </Tag>
                    ))}
                  </Descriptions.Item>
                  <Descriptions.Item label="Waktu Pelaksanaan">
                    {listMonth[rincian?.bulan_pelaksanaan_start - 1]} -{" "}
                    {listMonth[rincian?.bulan_pelaksanaan_end - 1]}
                  </Descriptions.Item>
                </Descriptions>
              </div>
              <div>
                <Descriptions
                  size="small"
                  layout="vertical"
                  labelStyle={{ fontWeight: 600 }}>
                  <Descriptions.Item label="Output">
                    {rincian?.indikator_output}
                  </Descriptions.Item>
                  <Descriptions.Item label="Target">
                    {rincian?.indikator_output_target}{" "}
                    {rincian?.indikator_output_satuan}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </div>
          </Card>
          <Card size="small" title="Sumber Dana">
            <Descriptions bordered column={1} size="small">
              {listSumber.length &&
                listSumber.map((item: any) => (
                  <Descriptions.Item
                    label={getNameSumberDana(item.pendapatanId)}>
                    {item.qty} {rincian?.indikator_output_satuan}
                  </Descriptions.Item>
                ))}
            </Descriptions>
          </Card>
        </Panel>
      </Collapse>
    </div>
  );
};
export default HeaderOutputKegiatan;
