/** @format */

import React from "react";

import { Divider, Descriptions, Collapse } from "antd";
import { formatRupiah } from "../../../../utils/helper";

const { Panel } = Collapse;
type rincianType = {
  rincian: any;
  tmpPajak: any;
};
const RincianRencana = ({ rincian, tmpPajak }: rincianType) => {
  const hargaSatuanPajak = (rincian: any) => {
    let hargaPajak =
      (rincian?.pajak === "ppn" &&
        Math.round(
          rincian?.hargaSatuan * ((rincian?.koefPersenPajak + 100) / 100),
        )) ||
      (rincian?.pajak === "termasukPajak" &&
        Math.round(
          rincian?.hargaSatuan * (100 / (rincian?.koefPersenPajak + 100)),
        )) ||
      rincian?.hargaSatuan;
    return formatRupiah(hargaPajak);
  };
  return (
    <>
      <Divider orientation="left" style={{ marginTop: 0 }}>
        Rencana Belanja
      </Divider>
      <Collapse>
        <Panel
          key="collapsePengeluaranKegiatan"
          header={
            <Descriptions
              //   layout="vertical"
              labelStyle={{ fontWeight: 600 }}
              column={{ xs: 1, sm: 2, md: 4 }}
              size="small">
              <Descriptions.Item label="Harga Satuan">
                {formatRupiah((rincian && rincian?.hargaSatuan) || 0)}
              </Descriptions.Item>
              <Descriptions.Item label="Kuantitas">
                {(rincian && rincian?.totalKuantitas) || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Koefesien Pajak">
                {(rincian && rincian?.koefPersenPajak) || 0}%
              </Descriptions.Item>
              <Descriptions.Item label="Harga+Pajak">
                {hargaSatuanPajak(rincian)}
              </Descriptions.Item>
            </Descriptions>
          }>
          <div className="grid grid-cols-1   md:grid-cols-3 gap-2">
            <div>
              <div>Sumber Dana:</div>
              <Descriptions bordered size="small" column={1}>
                {(rincian &&
                  rincian?.alokasiPendapatan.map((item: any) => (
                    <Descriptions.Item
                      label={item.rencana_pendapatan.nama_sumber_dana}>
                      {formatRupiah(item.jumlah)}
                    </Descriptions.Item>
                  ))) ||
                  null}
              </Descriptions>
            </div>
            <div>
              <Descriptions size="small" layout="vertical" column={1}>
                <Descriptions.Item label="Jenis Pajak">
                  {rincian &&
                    tmpPajak
                      .filter((item) => item.kode === rincian?.pajak)
                      .map((item) => item.nama)}
                </Descriptions.Item>
              </Descriptions>
            </div>
            <div>
              <div>Koefesien:</div>
              <Descriptions size="small" bordered column={1}>
                {[...Array(4)].map((_: any, i: number) => {
                  let no = i + 1;
                  return (
                    rincian &&
                    rincian[`koef${no}Jumlah`] > 0 && (
                      <Descriptions.Item label={`Koefisien ${no}`}>
                        {rincian[`koef${no}Jumlah`]}{" "}
                        {rincian[`koef${no}Satuan`] &&
                          rincian[`koef${no}Satuan`]}
                      </Descriptions.Item>
                    )
                  );
                })}
              </Descriptions>
            </div>
          </div>
        </Panel>
      </Collapse>
    </>
  );
};
export default RincianRencana;
