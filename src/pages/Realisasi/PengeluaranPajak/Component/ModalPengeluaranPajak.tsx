/** @format */

import React, { useState, useEffect } from "react";
import {
  Select,
  Input,
  Form,
  DatePicker,
  Modal,
  Table,
  Descriptions,
  Divider,
} from "antd";
import moment from "moment";
import "moment/locale/id";
import { ButtonTableEditBlue } from "../../../../components/Button";
import {
  formatRupiah,
  getJumlahSumberDana,
  uuidv4,
} from "../../../../utils/helper";
import ModalApprovalPengeluaranKegiatan from "../../PengeluaranKegiatan/Component/ModalApprovalPengeluaranKegiatan";
import { useSelector } from "react-redux";

type FormActionType = {
  dataEdit: any;
  openModal: boolean;
  title: string;
  store: any;
  handleSave: (e: any) => void;
  handleClose: () => void;
};

const ModalPengeluaranPajak = ({
  dataEdit,
  openModal,
  title,
  store,
  handleSave,
  handleClose,
}: FormActionType) => {
  const [form] = Form.useForm();
  const auths = useSelector((state: any) => state.auth);
  const tmpBiaya = store.realisasiBiaya || [];
  const tmpTipeKas = store.tipeKas || [];
  const tmpPajak = store.pajak || [];
  const tmpRekeningBelanja = store.rekeningBelanja || [];
  const tmpSumberDana = store.rencanaPendapatanDefinitif || [];
  const tmpRealisasiPajak = store.realisasiPajak || [];
  const [tipeKas, setTipeKas] = useState<any>(null);
  const [pajak, setPajak] = useState<any>(null);
  const [sumberDana, setSumberDana] = useState<any>(null);
  const [noRekening, setNoRekening] = useState<any>(null);
  const [saldoKas, setSaldoKas] = useState<any>(0);
  const [saldoTotal, setSaldoTotal] = useState<any>(0);
  const [enabledRekening, setEnabledRekening] = useState<any>(false);
  const [openModalApproval, setOpenModalApproval] = useState<any>(false);
  const [dataBiaya, setDataBiaya] = useState<any>(null);
  const [pajakList, setPajakList] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);

  let allFilter: any = { sumberDanaID: [], tipeKasID: [], pajakID: [] };
  let biayaFilter: any = [];

  tmpRealisasiPajak.length &&
    // eslint-disable-next-line array-callback-return
    tmpRealisasiPajak.map((item: any) => {
      item.pajakDetails.length &&
        item.pajakDetails.map((items: any) => biayaFilter.push(items.biayaId));
    });

  let tmpListBiaya: any =
    (tmpBiaya.length &&
      tmpBiaya
        .filter((item) => item.grandPajakTerutang > 0)
        .filter((item) => item.status === "SELESAI")) ||
    [];

  tmpListBiaya.length &&
    tmpListBiaya.map((item) =>
      // eslint-disable-next-line array-callback-return
      item.biayaSumberDanas.map((items) => {
        items.kodeSumberDana &&
          allFilter["sumberDanaID"].push(items.rencanaPendapatanId);
        items.kodeTipeKas && allFilter["tipeKasID"].push(items.kodeTipeKas);
        items.kodePajak && allFilter["pajakID"].push(items.kodePajak);
      }),
    );

  let dataTable: any =
    (tipeKas &&
      pajak &&
      sumberDana &&
      tmpListBiaya.filter((item) => {
        return (
          item.biayaSumberDanas.length &&
          item.biayaSumberDanas.some(
            (items) =>
              items.kodePajak &&
              items.kodePajak === pajak &&
              items.kodeTipeKas &&
              items.kodeTipeKas.includes(tipeKas) &&
              items.rencanaPendapatanId &&
              items.rencanaPendapatanId.includes(sumberDana),
          )
        );
      })) ||
    [];
  dataTable =
    (tipeKas === "rekening_bank" &&
      noRekening &&
      dataTable.filter((item) => {
        return (
          item.biayaSumberDanas.length &&
          item.biayaSumberDanas.some(
            (items) =>
              items.rekeningBankId && items.rekeningBankId.includes(noRekening),
          )
        );
      })) ||
    dataTable;

  // dataTable =
  //   (title === "Tambah" &&
  //     biayaFilter.length &&
  //     dataTable.filter((items) => !biayaFilter.includes(items.id))) ||
  //   dataTable;

  const handleReset = () => {
    setSumberDana(null);
    setPajakList([]);
    setPajak(null);
    setTipeKas(null);
    setNoRekening(null);
    setEnabledRekening(false);
    setSaldoKas(0);
    setSaldoTotal(0);
    setSelectedRowKeys([]);

    form.resetFields();
    handleClose();
  };

  useEffect(() => {
    if (dataEdit && title === "Edit") {
      let selectBiaya: any = [];
      dataEdit?.pajakDetails.length &&
        dataEdit?.pajakDetails.map((item) => selectBiaya.push(item.biayaId));
      setSelectedRowKeys(selectBiaya);
      setSaldoKas(
        getJumlahSumberDana(dataEdit?.rencanaPendapatanId, tmpSumberDana),
      );
      setSaldoTotal(dataEdit?.grandTotal);
      setSumberDana(dataEdit?.rencanaPendapatanId);
      setTipeKas(dataEdit?.kodeTipeKas);
      setNoRekening(dataEdit?.rekeningBankId);
      setPajak(dataEdit?.kodePajak);
      setEnabledRekening(
        dataEdit?.kodeTipeKas === "rekening_bank" ? true : false,
      );
      form.setFieldsValue({
        noRekening: dataEdit?.rekeningBankId,
        sumberDana: dataEdit?.rencanaPendapatanId,
        jenisPajak: dataEdit?.kodePajak,
        tipeKas: dataEdit?.kodeTipeKas,
        tanggalNota: moment(dataEdit?.tanggalNota),
        keterangan: dataEdit?.keterangan,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataEdit]);

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    let pajakDetailsTmp: any = [];
    setSelectedRowKeys(selectedRowKeys);

    selectedRows.length &&
      // eslint-disable-next-line array-callback-return
      selectedRows.map((item) => {
        item.biayaSumberDanas
          .filter(
            (items) =>
              items.rencanaPendapatanId &&
              items.rencanaPendapatanId.includes(sumberDana),
          )
          // eslint-disable-next-line array-callback-return
          .map((items) => {
            pajakDetailsTmp.push({
              biayaId: item.id,
              biayaDetails: item.biayaDetails,
              pajakTotal: items.grandPajakTerutang,
              tanggalRealisasi: item.tanggalRealisasi,
            });
          });
      });
    setPajakList(pajakDetailsTmp);
    handleTotalKas(pajakDetailsTmp);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  function disabledDate(current) {
    // Can not select days before today and today
    if (pajakList.length) {
      let tanggalValid = pajakList.map((item) => item.tanggalRealisasi);
      tanggalValid.sort();
      return moment(current).isBefore(tanggalValid[0], "day");
    }
    return current && current < moment().endOf("day");
  }

  const columns: any = [
    {
      title: "Sumber Dana",
      key: "rencanaPendapatanId",
      render: (record) => {
        let namaSumber: any =
          tmpSumberDana.find((item) => item.id.includes(sumberDana)) || null;
        return namaSumber?.nama_sumber_dana;
      },
    },
    {
      title: "Nota",
      dataIndex: "noNotaFormat",
      key: "noNotaFormat",
    },
    {
      title: `Jumlah Pajak`,
      key: "grandPajakTerutang",
      align: "right",
      render: (record) => {
        return record.biayaSumberDanas
          .filter((e) => e.rencanaPendapatanId === sumberDana)
          .map((e) => formatRupiah(e.grandPajakTerutang));
      },
    },
    {
      title: "Aksi",
      width: "20%",
      key: "id",
      render: (record) => (
        <ButtonTableEditBlue
          tooltips="Rincian"
          onClick={() => handleDetail(record)}
        />
      ),
    },
  ];

  const handleChangeField = (values: any) => {
    for (let obj in values) {
      switch (obj) {
        case "tipeKas":
          if (values.tipeKas === "rekening_bank") {
            setEnabledRekening(true);
          } else {
            setEnabledRekening(false);
          }
          setTipeKas(values.tipeKas);
          break;
        case "sumberDana":
          setSumberDana(values.sumberDana);
          setSaldoKas(getJumlahSumberDana(values.sumberDana, tmpSumberDana));
          break;
        case "jenisPajak":
          setPajak(values.jenisPajak);
          break;
        case "noRekening":
          setNoRekening(values.noRekening);
          break;
      }
      if (obj !== "tanggalNota") {
        setSelectedRowKeys([]);
        setPajakList([]);
        handleTotalKas([]);
      }
    }
  };

  const handleChange = (_, values) => {
    handleChangeField(values);
  };

  const handleBeforeSave = (values) => {
    let tmpPajakDetail: any = [];
    let dataSumber =
      tmpSumberDana.find((item) => item.id.includes(values.sumberDana)) || null;
    const id = title === "Tambah" ? uuidv4() : dataEdit?.id;
    pajakList.length &&
      pajakList.map((item) =>
        tmpPajakDetail.push({
          pajakId: id,
          biayaId: item.biayaId,
          grandTotal: item.pajakTotal,
          biayaDetails: item.biayaDetails,
        }),
      );
    let payload: any = {
      id: id,
      rencanaPendapatanId: values.sumberDana,
      kodeSumberDana: (dataSumber && dataSumber.kode_sumber_dana) || null,
      namaSumberDana: (dataSumber && dataSumber.nama_sumber_dana) || null,
      kodeTipeKas: values.tipeKas,
      rekeningBankId: values?.noRekening || null,
      kodePajak: values.jenisPajak,
      keterangan: values?.keterangan || null,
      tahun: auths.isTahun,
      tanggalNota: moment(values.tanggalNota).utc(),
      grandTotal: saldoTotal,
      pajakDetails: tmpPajakDetail,
    };

    handleSave(payload);
    handleReset();
  };

  const handleDetail = (record) => {
    setDataBiaya(record);
    setOpenModalApproval(true);
  };

  const handleTotalKas = (pajakList: any) => {
    let tmpTotalPajak = 0;
    pajakList.length &&
      // eslint-disable-next-line array-callback-return
      pajakList.map((item) => {
        tmpTotalPajak += item.pajakTotal;
      });

    setSaldoTotal(tmpTotalPajak);
  };

  return (
    <Modal
      visible={openModal}
      title={`${title} Nota Pengeluaran Pajak`}
      onCancel={handleReset}
      okText="Simpan"
      width={1100}
      cancelText="Batal"
      okButtonProps={{ disabled: pajakList.length ? false : true }}
      onOk={() => form.submit()}>
      <Form
        form={form}
        key="modalRealisasiPngeluaranPajak"
        name="modalRealisasiPengeluaranPajak"
        layout="vertical"
        onValuesChange={handleChange}
        onFinish={handleBeforeSave}>
        <div className="grid grid-cols-1   md:grid-cols-2 gap-2">
          <div>
            <Form.Item
              label="Sumber Dana"
              name="sumberDana"
              rules={[
                {
                  required: true,
                  message: "Sumber Dana tidak boleh kosong!",
                },
              ]}>
              <Select
                showSearch
                allowClear
                optionFilterProp="children"
                placeholder="Pilih Sumber Dana">
                {tmpSumberDana.length &&
                  tmpSumberDana
                    .filter((item) => allFilter.sumberDanaID.includes(item.id))
                    .map((item: any, i: any) => {
                      return (
                        <Select.Option key={`sp${i}`} value={item.id}>
                          {item.nama_sumber_dana}
                        </Select.Option>
                      );
                    })}
              </Select>
            </Form.Item>
          </div>
          <div>
            <Form.Item
              label="Tipe Kas"
              name="tipeKas"
              rules={[
                {
                  required: true,
                  message: "Tipe Kas tidak boleh kosong!",
                },
              ]}>
              <Select
                showSearch
                allowClear
                optionFilterProp="children"
                placeholder="Pilih Tipe Kas">
                {tmpTipeKas.length &&
                  tmpTipeKas
                    .filter((item) => allFilter.tipeKasID.includes(item.kode))
                    .map((item: any, i: any) => {
                      return (
                        <Select.Option key={`tipekas${i}`} value={item.kode}>
                          {item.nama}
                        </Select.Option>
                      );
                    })}
              </Select>
            </Form.Item>
          </div>
          {enabledRekening && (
            <div>
              <Form.Item
                label="No Rekening"
                name="noRekening"
                rules={[
                  {
                    required: true,
                    message: "No Rekening tidak boleh kosong!",
                  },
                ]}>
                <Select
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  placeholder="Pilih No Rekening">
                  {tmpRekeningBelanja.length &&
                    tmpRekeningBelanja.map((e: any, i: any) => {
                      return (
                        <Select.Option key={`noRek${i}`} value={e.id}>
                          {e.nama_bank} - {e.no_rekening}
                        </Select.Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </div>
          )}
          <div>
            <Form.Item
              label="Jenis Pajak"
              name="jenisPajak"
              rules={[
                {
                  required: true,
                  message: "Jenis Pajak tidak boleh kosong!",
                },
              ]}>
              <Select
                showSearch
                allowClear
                optionFilterProp="children"
                placeholder="Pilih Jenis Pajak">
                {tmpPajak.length &&
                  tmpPajak
                    .filter((item: any) =>
                      allFilter.pajakID.includes(item.kode),
                    )
                    .map((item: any, i: any) => {
                      return (
                        <Select.Option key={`snp${i}`} value={item.kode}>
                          {item.nama}
                        </Select.Option>
                      );
                    })}
              </Select>
            </Form.Item>
          </div>
          <div>
            <Form.Item
              label="Tanggal Nota"
              name="tanggalNota"
              rules={[
                {
                  required: true,
                  message: "Tanggal Nota tidak boleh kosong!",
                },
              ]}>
              <DatePicker disabledDate={disabledDate} showTime />
            </Form.Item>
          </div>

          <div>
            <Form.Item label="Keterangan" name="keterangan">
              <Input.TextArea placeholder="Keterangan" />
            </Form.Item>
          </div>
        </div>
      </Form>
      <Table
        columns={columns}
        rowKey={(record) => record.id}
        rowSelection={rowSelection}
        dataSource={dataTable}
        bordered
      />
      <Divider />
      <div className="flex justify-start md:justify-end gap-4">
        <div className="md:w-1/2">
          <Descriptions
            column={1}
            contentStyle={{
              fontWeight: 600,
              justifyContent: "end",
              fontSize: 18,
            }}>
            <Descriptions.Item label="Saldo Kas">
              {formatRupiah(saldoKas)}
            </Descriptions.Item>
            <Descriptions.Item label="Total Pajak">
              {formatRupiah(saldoTotal)}
            </Descriptions.Item>
            {/* <Descriptions.Item label="Sisa Saldo Kas">
              {formatRupiah(1000)}
            </Descriptions.Item> */}
          </Descriptions>
        </div>
      </div>
      <ModalApprovalPengeluaranKegiatan
        title={"Detail"}
        store={store}
        openModal={openModalApproval}
        // rincian={dataState}
        data={dataBiaya}
        handleClose={() => setOpenModalApproval(false)}
        handleSave={handleDetail}
      />
    </Modal>
  );
};
export default ModalPengeluaranPajak;
