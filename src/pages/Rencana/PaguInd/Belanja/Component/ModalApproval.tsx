/** @format */

import React, { useState } from "react";
import { Form, Modal, Button, Descriptions, Divider, Input } from "antd";
import moment from "moment";
import "moment/locale/id";
import { formatRupiah } from "../../../../../utils/helper";
import notifAlert from "../../../../../components/NotifAlert";
import { approvalRencanaRincianKegiatanIndikatif } from "../../../../../services/v2/planningservice/rencanakegiatanindikatif";
import { approvalRencanaRincianKegiatanDefinitif } from "../../../../../services/v2/planningservice/rencanakegiatandefinitif";

type approvalModal = {
  openModal: boolean;
  data: any;
  title: any;
  onReload: () => void;
  onClose: () => void;
};

const ModalApproval = (params: approvalModal) => {
  const tmpData = params.data;
  const listMonth = moment.months();
  const [form] = Form.useForm();
  const [komentar, setKomentar] = useState<any>(null);

  const handleSave = async (values) => {
    let payload: any = {
      ...tmpData,
      komentar: komentar,
      status: values,
    };
    if (params.title === "Approval Rencana Rincian Kegiatan Indikatif") {
      try {
        await approvalRencanaRincianKegiatanIndikatif(payload);
        notifAlert({
          type: "success",
          description: "Data rincian kegiatan berhasil disimpan",
        });
        params.onReload();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await approvalRencanaRincianKegiatanDefinitif(payload);
        notifAlert({
          type: "success",
          description: "Data rincian kegiatan berhasil disimpan",
        });
        params.onReload();
      } catch (error) {
        console.log(error);
      }
    }
    params.onClose();
  };
  const handleChange = (val) => {
    setKomentar(val.keterangan);
  };
  return (
    <>
      <Modal
        visible={params.openModal}
        width={1000}
        title={params.title}
        onCancel={params.onClose}
        footer={[
          <Button onClick={params.onClose}>Batal</Button>,
          <Button
            disabled={!komentar}
            onClick={() => handleSave("DITOLAK")}
            danger>
            Tolak
          </Button>,
          <Button type="primary" onClick={() => handleSave("DISETUJUI")}>
            Disetujui
          </Button>,
        ]}>
        <div className="mb-2 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Divider plain orientation="left">
              Detail Rincian
            </Divider>
            <Descriptions size="small" bordered column={1}>
              <Descriptions.Item label="Komponen Biaya">
                {tmpData?.komponenBiayaNama}
              </Descriptions.Item>
              <Descriptions.Item label="Jenis Belanja">
                {tmpData?.namaJenisBelanja}
              </Descriptions.Item>
              <Descriptions.Item label="Tipe Pencairan">
                {tmpData?.tipePencairanNama}
              </Descriptions.Item>
              <Descriptions.Item label="Jenis Pajak">
                {tmpData?.pajak}
              </Descriptions.Item>
            </Descriptions>
            <Divider plain orientation="left">
              Koefisien
            </Divider>
            <Descriptions size="small" className="mb-2" bordered column={1}>
              {[...Array(4)].map((_: any, i: number) => (
                <Descriptions.Item label={`Koefisien ${i + 1}`}>
                  {tmpData &&
                    tmpData[`koef${i + 1}Jumlah`] +
                      " " +
                      tmpData[`koef${i + 1}Satuan`]}
                </Descriptions.Item>
              ))}
            </Descriptions>
            <Form
              form={form}
              key="formApproval"
              layout="vertical"
              onValuesChange={handleChange}>
              <Form.Item label="Keterangan jika ditolak" name="keterangan">
                <Input.TextArea placeholder="Keterangan" />
              </Form.Item>
            </Form>
          </div>
          <div className="flex-1">
            <Divider plain orientation="left">
              Alokasi Pendapatan
            </Divider>
            <Descriptions size="small" bordered>
              {tmpData?.alokasiPendapatan.length &&
                tmpData?.alokasiPendapatan.map((item: any) => (
                  <Descriptions.Item
                    label={item.rencana_pendapatan.nama_sumber_dana}
                    span={3}>
                    {formatRupiah(item.jumlah)}
                  </Descriptions.Item>
                ))}
            </Descriptions>
            <Divider plain orientation="left">
              Anggaran Kas Bulanan
            </Divider>
            <Descriptions size="small" bordered>
              {listMonth.map((item: any, i: number) => (
                <Descriptions.Item label={item}>
                  {tmpData && tmpData[`jumlahBulan${i + 1}`]}
                </Descriptions.Item>
              ))}
            </Descriptions>
            <Divider />
            <Descriptions
              size="small"
              labelStyle={{ fontWeight: 600 }}
              column={1}>
              <Descriptions.Item label="Jumlah Kuantitas">
                {tmpData?.totalKuantitas}
              </Descriptions.Item>
              <Descriptions.Item label="Harga Satuan">
                {formatRupiah(tmpData?.hargaSatuan)}
              </Descriptions.Item>
              <Descriptions.Item label="Total Harga">
                {formatRupiah(tmpData?.hargaSatuan * tmpData?.totalKuantitas)}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default ModalApproval;
