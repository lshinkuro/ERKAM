/** @format */

import React from "react";
import { Collapse, Descriptions, Card } from "antd";
import { uuidv4 } from "../../../../utils/helper";
import moment from "moment";
import "moment/locale/id";

const { Panel } = Collapse;

type notaType = {
  rincian: any;
};

const HeaderNotaPengeluaranKegiatan = ({ rincian }: notaType) => {
  const listMonth = moment.months();
  const headerPanel = (
    <Descriptions
      size="small"
      layout="vertical"
      labelStyle={{ fontWeight: 600 }}>
      <Descriptions.Item label="Standar Nasional">
        {rincian?.rencanaKegiatan?.nama_snp}
      </Descriptions.Item>
      <Descriptions.Item label="Kegiatan">
        {rincian?.rencanaKegiatan?.nama_kegiatan}
      </Descriptions.Item>
      <Descriptions.Item label="Sub Kegiatan">
        {rincian?.rencanaKegiatan?.nama_sub_kegiatan}
      </Descriptions.Item>
    </Descriptions>
  );

  return (
    <div className="m-5 p-5 bg-white shadow-md rounded">
      <Collapse>
        <Panel
          className="headerOutputKegiatan"
          header={headerPanel}
          key={uuidv4()}>
          <Card size="small" title="Detail" style={{ marginBottom: 20 }}>
            <Descriptions
              size="small"
              layout="vertical"
              labelStyle={{ fontWeight: 600 }}>
              <Descriptions.Item label="Komponen Biaya">
                {rincian?.komponenBiayaNama}
              </Descriptions.Item>
              <Descriptions.Item label="Sumber Dana">
                {
                  rincian?.alokasiPendapatan[0].rencana_pendapatan
                    ?.nama_sumber_dana
                }
              </Descriptions.Item>
              <Descriptions.Item label="Waktu/AKB">
                {
                  listMonth[
                    rincian?.rencanaKegiatan?.bulan_pelaksanaan_start - 1
                  ]
                }{" "}
                -{" "}
                {listMonth[rincian?.rencanaKegiatan?.bulan_pelaksanaan_end - 1]}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Panel>
      </Collapse>
    </div>
  );
};
export default HeaderNotaPengeluaranKegiatan;
