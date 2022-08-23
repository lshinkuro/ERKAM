/** @format */

import React from "react";
import { Modal, Descriptions, Divider, Tag } from "antd";
import moment from "moment";
import "moment/locale/id";
import { formatRupiah } from "../../../../utils/helper";

type FormActionType = {
  openModal: boolean;
  title: string;
  data: any;
  handleClose: () => void;
};

const ModalListRincian = ({
  openModal,
  title,
  data,
  handleClose,
}: FormActionType) => {
  const listMonth = moment.months();
  return (
    <Modal
      key="modalListRincian"
      visible={openModal}
      title={`${title} Rincian`}
      width={1000}
      onCancel={handleClose}
      footer={null}>
      <div className="mb-2 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Divider plain orientation="left">
            Kegiatan
          </Divider>
          <Descriptions
            labelStyle={{ fontWeight: 600 }}
            size="small"
            layout="vertical"
            column={1}>
            <Descriptions.Item label="Standar Nasional">
              {data?.rencanaKegiatan?.nama_snp}
            </Descriptions.Item>
            <Descriptions.Item label="Kegiatan">
              {data?.rencanaKegiatan?.nama_kegiatan}
            </Descriptions.Item>
            <Descriptions.Item label="Sub Kegiatan">
              {data?.rencanaKegiatan?.nama_sub_kegiatan}
            </Descriptions.Item>
            <Descriptions.Item label="Waktu Pelaksanaan">
              {listMonth[data?.rencanaKegiatan?.bulan_pelaksanaan_start - 1]}-
              {listMonth[data?.rencanaKegiatan?.bulan_pelaksanaan_end - 1]}
            </Descriptions.Item>
            <Descriptions.Item label="Sasaran">
              {data?.rencanaKegiatan?.kelompok_sasaran.map((item, i) => (
                <Tag key={`ttop${i}`} color="#00bcd4">
                  {item}
                </Tag>
              ))}
            </Descriptions.Item>
          </Descriptions>

          <Divider plain orientation="left">
            Rincian
          </Divider>
          <Descriptions
            size="small"
            bordered
            // layout="vertical"
            column={1}>
            <Descriptions.Item label="Sumber Dana">
              {data?.alokasiPendapatan[0].rencana_pendapatan.nama_sumber_dana}
            </Descriptions.Item>
            <Descriptions.Item label="Jenis Penarikan">
              {data?.tipePencairanNama}
            </Descriptions.Item>
            <Descriptions.Item label="Komponen Biaya">
              {data?.komponenBiayaNama}
            </Descriptions.Item>
            <Descriptions.Item label="Jenis Akun Belanja">
              {data?.namaJenisBelanja}
            </Descriptions.Item>
            <Descriptions.Item label="Jenis Pajak">
              {data?.pajak}
            </Descriptions.Item>
          </Descriptions>
        </div>
        <div className="flex-1">
          <Divider plain orientation="left">
            Indikator
          </Divider>
          <Descriptions
            size="small"
            // layout="vertical"
            bordered
            column={2}>
            <Descriptions.Item label="Output">
              {data?.rencanaKegiatan?.indikator_output}
            </Descriptions.Item>
            <Descriptions.Item label="Target Output">
              {data?.rencanaKegiatan?.indikator_output_target}{" "}
              {data?.rencanaKegiatan?.indikator_output_satuan}
            </Descriptions.Item>
            <Descriptions.Item label="Hasil">
              {data?.rencanaKegiatan?.indikator_hasil}
            </Descriptions.Item>
            <Descriptions.Item label="Target Hasil">
              {data?.rencanaKegiatan?.indikator_hasil_target}{" "}
              {data?.rencanaKegiatan?.indikator_hasil_satuan}
            </Descriptions.Item>
          </Descriptions>

          <Divider plain orientation="left">
            Anggaran Kas Bulanan
          </Divider>
          <Descriptions size="small" bordered>
            {listMonth.map((item: any, i: number) => (
              <Descriptions.Item label={item}>
                {data && data[`jumlahBulan${i + 1}`]}
              </Descriptions.Item>
            ))}
          </Descriptions>

          <Divider plain orientation="left">
            Keterangan
          </Divider>
          <div>{data?.komentar || "-"}</div>
          <Divider plain orientation="left">
            Harga
          </Divider>
          <Descriptions
            contentStyle={{ fontWeight: 600, justifyContent: "end" }}
            size="small"
            column={1}>
            <Descriptions.Item label="Harga Satuan">
              {formatRupiah(data?.hargaSatuan)}
            </Descriptions.Item>
            <Descriptions.Item label="Jumlah Kuantitas">
              {data?.totalKuantitas}
            </Descriptions.Item>
            <Descriptions.Item label="Total Harga">
              {formatRupiah(data?.jumlahTotal)}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
};
export default ModalListRincian;
