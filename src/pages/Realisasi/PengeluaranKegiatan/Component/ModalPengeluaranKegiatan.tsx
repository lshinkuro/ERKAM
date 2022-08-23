/** @format */

import React, { useState, useEffect } from "react";
import {
  Select,
  Input,
  Form,
  DatePicker,
  InputNumber,
  Modal,
  Divider,
  Descriptions,
  Button,
  Switch,
} from "antd";

import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import "moment/locale/id";
import { formatRupiah, uuidv4 } from "../../../../utils/helper";
import { ButtonPlus } from "../../../../components/Button";
import ModalPenerima, {
  ModalPenerimaRekening,
} from "../../../../components/Modal/ModalPenerima";
import RincianRencana from "./RincianRencana";
import { useSelector } from "react-redux";

type FormActionType = {
  openModal: boolean;
  title: string;
  data: any;
  store: any;
  rincian: any;
  komponenBiaya: any;
  handleSave: (e: any) => void;
  handleClose: () => void;
};

const ModalPengeluaranKegiatan = ({
  openModal,
  title,
  store,
  data,
  rincian,
  komponenBiaya,
  handleSave,
  handleClose,
}: FormActionType) => {
  const auths = useSelector((state: any) => state.auth);
  const tmpRekeningBelanja = store.rekeningBelanja || [];
  const tmpTipeKas = store.tipeKas || [];
  const tmpBank = store.bank || [];
  const tmpSumberDana = store.rencanaPendapatanDefinitif || [];
  const tmpPendapatanHeader = store.realisasiPendapatanHeader || [];
  const tmpMetodePembayaran = store.metodePembayaran || [];
  const tmpPajak = store.pajak || [];
  const tmpPenerima = store.penerimaRekening || [];
  const tmpRealisasiBiaya = store.realisasiBiaya || [];
  const [form] = Form.useForm();
  const [buttonEnabled, setButtonEnabled] = useState<any>(true);
  const [buttonEnabledAllokasi, setButtonEnabledAllokasi] = useState<any>(true);
  const [pajakEnabled, setPajakEnabled] = useState<any>(true);

  const [listSumberDana, setListSumberDana] = useState<any>([]);
  const [hargaSatuan, setHargaSatuan] = useState<any>(0);
  const [subTotal, setSubTotal] = useState<any>(0);
  const [totalPajak, setTotalPajak] = useState<any>(0);
  const [totalPajakTerhutang, setTotalPajakTerhutang] = useState<any>(0);
  const [disabledRekening, setDisabledRekening] = useState<any>(true);
  const [enabledRekeningPenerima, setEnabledRekeningPenerima] =
    useState<any>(false);
  const [listPenerimaRekening, setListPenerimaRekening] = useState<any>(null);

  const [openModalPenerimaRekening, setOpenModalPenerimaRekening] =
    useState<any>(false);
  const [editKuantitas, setEditKuantitas] = useState<any>(0);
  const [openModalPenerima, setOpenModalPenerima] = useState<any>(false);

  let allFilter: any = { sumberDanaID: [], tipeKasID: [], rekeningID: [] };

  rincian &&
    rincian.alokasiPendapatan.map(
      (items) =>
        items.rencana_pendapatan.kode_sumber_dana &&
        allFilter[`sumberDanaID`].push(
          items.rencana_pendapatan.kode_sumber_dana,
        ),
    );

  let tmpListSumberDana: any = [];
  tmpPendapatanHeader &&
    tmpPendapatanHeader.header3.map((item) =>
      // eslint-disable-next-line array-callback-return
      item.details.map((items) => {
        let namaSumberDana = tmpSumberDana.find(
          (val) => val.kode_sumber_dana === items.sumber_dana,
        );
        let noRek: any =
          (items.rekening_bank_id &&
            tmpRekeningBelanja.find(
              (val) => val.id === items.rekening_bank_id,
            )) ||
          null;
        let namaTipeKas = tmpTipeKas.find(
          (val) => val.kode === items.kode_tipe_kas,
        );

        let tmpDataSumber: any = {
          id: `${items.sumber_dana}${items.kode_tipe_kas}${items.rekening_bank_id}`,
          idSumberDana: namaSumberDana.id,
          kodeSumberDana: items.sumber_dana,
          namaSumberDana: namaSumberDana.nama_sumber_dana,
          kodeTipeKas: items.kode_tipe_kas,
          namaTipeKas: namaTipeKas.nama,
          sisa: items.sisa,
          rekeningBankId: items.rekening_bank_id,
          noRekening: (noRek && noRek.no_rekening) || null,
          namaRekeningBank: (noRek && noRek.nama_bank) || null,
        };
        tmpListSumberDana.push(tmpDataSumber);
      }),
    );

  // let tmpList: any = [];
  let tmpKuantitas = 0;

  tmpRealisasiBiaya.length &&
    tmpRealisasiBiaya
      .filter((item) => item.rencanaRincianKegiatanId.includes(rincian?.id))
      .map((item) =>
        item.biayaDetails.map((items) => (tmpKuantitas += items.kuantitas)),
      );

  let filterSumberDana: any = [];

  const tmpList =
    (listSumberDana.length &&
      // eslint-disable-next-line array-callback-return
      listSumberDana.map((item: any) => {
        let tmp = {
          sumberDana: item?.sumberDana || null,
          kuantitas: item?.kuantitas || 0,
        };
        tmpKuantitas += item?.kuantitas;
        item?.sumberDana && filterSumberDana.push(item?.sumberDana);
        // tmpList.push(tmp);
        return tmp;
      })) ||
    [];

  let sisaKuantitas = rincian?.totalKuantitas - tmpKuantitas + editKuantitas;

  const getNameBank = (kodeBank) => {
    const nameBank = tmpBank
      .filter((item) => item.kode === kodeBank)
      .map((item) => item.nama);
    return nameBank;
  };

  const handleChangeField = (values: any) => {
    for (let obj in values) {
      switch (obj) {
        case "sumberDanaList":
          setListSumberDana(values.sumberDanaList);
          break;
        case "hargaSatuan":
          setHargaSatuan((values.hargaSatuan && values.hargaSatuan) || 0);
          break;
        case "metodePembayaran":
          setEnabledRekeningPenerima(
            values.metodePembayaran === "transfer" ? true : false,
          );
          break;
        case "penerima":
          setListPenerimaRekening(values.penerima);
          setDisabledRekening(values.penerima ? false : true);
          break;
      }
    }
    checkButtonDisabled();
  };

  const handleChange = (_, values: any) => {
    handleChangeField(values);
  };

  useEffect(() => {
    // console.log(data);
    if (data && title === "Edit") {
      let editKodeMetode: any = null;
      let editListSumber: any = [];
      let totalEditKuantitas = 0;
      data.biayaSumberDanas.length &&
        // eslint-disable-next-line array-callback-return
        data.biayaSumberDanas.map((item) => {
          let tmpEditData: any = {
            sumberDana: `${item.kodeSumberDana}${item.kodeTipeKas}${item.rekeningBankId}`,
            kuantitas: item.quantity,
          };
          editKodeMetode = item.kodeMetodePembayaran;
          editListSumber.push(tmpEditData);
          totalEditKuantitas += item.quantity;
        });
      setEditKuantitas(totalEditKuantitas);

      setListSumberDana(editListSumber);
      form.setFieldsValue({
        pajak: data.kodePajak,
        tanggalNota: moment(data.tanggalNota),
        penerima: data.penerimaId,
        keterangan: data.keterangan,
        pajakTerhutang: data.grandPajakTerutang > 0 ? true : false,
        hargaSatuan: data.biayaDetails[0].hargaSatuan,
        metodePembayaran: editKodeMetode,
        noRekeningPenerima: data.penerimaRekeningId,
        sumberDanaList: editListSumber,
      });

      checkButtonDisabled();
    }

    // // console.log(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // const disabledDate = (current) => {
  //   var start = moment(
  //     `${auths.isTahun}-${rincian?.rencanaKegiatan?.bulan_pelaksanaan_start}-01`,
  //   );
  //   var end = moment(
  //     `${auths.isTahun}-${rincian?.rencanaKegiatan?.bulan_pelaksanaan_end}-01`,
  //   );

  //   return (
  //     moment(current, "YYYY-MM-DD").startOf("month") <
  //       moment(start, "YYYY-MM-DD") ||
  //     moment(current, "YYYY-MM-DD") >= moment(end, "YYYY-MM-DD").endOf("month")
  //   );
  // };

  const handleSaveForm = (values: any) => {
    let dataSumberDanaList: any = [];
    let jumlahTotalKuatantitas = 0;

    const dataKomponen =
      komponenBiaya.find((item) =>
        item.komponen_biaya_harga_id.includes(rincian?.komponenBiayaHargaId),
      ) || null;
    const dataPajak =
      tmpPajak.find((item) => item.kode === values.pajak) || null;
    const id = title === "Tambah" ? uuidv4() : data?.id;
    const dataMetodePembayaran =
      tmpMetodePembayaran.find(
        (item) => item.kode === values.metodePembayaran,
      ) || null;
    values.sumberDanaList.length &&
      // eslint-disable-next-line array-callback-return
      values.sumberDanaList.map((item) => {
        let totalPajak = Math.round(values.biayaPajak * item.kuantitas);
        let totalJumlah = Math.round(values.hargaSatuan * item.kuantitas);
        let dataTmpList =
          tmpListSumberDana.find((items) => items.id === item.sumberDana) ||
          null;
        let tmpSumberDanas: any = {
          // id: uuidv4(),
          kodeSumberDana: dataTmpList && dataTmpList.kodeSumberDana,
          namaSumberDana: dataTmpList && dataTmpList.namaSumberDana,
          jumlah: totalJumlah,
          quantity: item.kuantitas,
          kodePajak: dataPajak.kode,
          jenisPajak: dataPajak.nama,
          grandPajak: totalPajak,
          grandPajakTerutang: totalPajak,
          grandPajakTerutangPpn: (values.pajak === "ppn" && totalPajak) || 0,
          grandPajakTerutangPph21:
            (values.pajak === "pph21" && totalPajak) || 0,
          grandPajakTerutangPph22:
            (values.pajak === "pph22" && totalPajak) || 0,
          grandPajakTerutangPph23:
            (values.pajak === "pph23" && totalPajak) || 0,
          kodeTipeKas: dataTmpList && dataTmpList.kodeTipeKas,
          namaTipeKas: dataTmpList && dataTmpList.namaTipeKas,
          rekeningBankId: dataTmpList && dataTmpList.rekeningBankId,
          rekeningBankNama: dataTmpList && dataTmpList.namaRekeningBank,
          kodeMetodePembayaran: values.metodePembayaran,
          namaMetodePembayaran:
            (dataMetodePembayaran && dataMetodePembayaran.nama) || null,
          rencanaPendapatanId: dataTmpList && dataTmpList.idSumberDana,
        };
        dataSumberDanaList.push(tmpSumberDanas);
        jumlahTotalKuatantitas += item.kuantitas;
      });

    const payload = {
      id: id,
      tahun: auths.isTahun,
      rencanaPendapatanId: null,
      penerimaRekeningId: values?.noRekeningPenerima || null,
      rencanaRincianKegiatanId: rincian?.id,
      penerimaId: values.penerima,
      keterangan: values.keterangan || null,
      tanggalNota: moment(values.tanggalNota).format("YYYY-MM-DD HH:mm:ss"),
      grandSubTotal: subTotal,
      kodePajak: values.pajak,
      jenisPajak: (dataPajak && dataPajak.nama) || null,
      grandPajak: totalPajak,
      grandPajakTerutang: totalPajakTerhutang,
      grandPajakTerutangPpn:
        (values.pajak === "ppn" && totalPajakTerhutang) || 0,
      grandPajakTerutangPph21: (values.pajak === "pph21" && totalPajak) || 0,
      grandPajakTerutangPph22: (values.pajak === "pph22" && totalPajak) || 0,
      grandPajakTerutangPph23: (values.pajak === "pph23" && totalPajak) || 0,
      grandTotal: subTotal + totalPajak,
      biayaDetails: [
        {
          // id: id,
          realisasiBiayaId: id,
          rencanaRincianKegiatanId: rincian?.id,
          komponenBiayaKategori:
            (dataKomponen && dataKomponen.nama_kategori) || null,
          komponenBiayaNama: (dataKomponen && dataKomponen.nama) || null,
          komponenBiayaSpesifikasi:
            (dataKomponen && dataKomponen.spesifikasi) || null,
          komponenBiayaSatuan: (dataKomponen && dataKomponen.satuan) || null,
          kuantitas: jumlahTotalKuatantitas,
          hargaSatuan: values.hargaSatuan,
          pemungutPajakPpn:
            (values.pajak === "ppn" && true) ||
            (values.pajak === "ppnTerhutang" && true) ||
            false,
          pemungutPajakPph:
            (values.pajak === "pph21" && true) ||
            (values.pajak === "pph22" && true) ||
            (values.pajak === "pph23" && true) ||
            false,
          pajakPpn:
            (values.pajak === "ppn" && true) ||
            (values.pajak === "ppnTerhutang" && true) ||
            false,
          biayaPpn:
            (values.pajak === "ppn" && values.biayaPajak) ||
            (values.pajak === "ppnTerhutang" && values.biayaPajak) ||
            0,
          biayaPph21: (values.pajak === "pph21" && values.biayaPajak) || 0,
          biayaPph22: (values.pajak === "pph22" && values.biayaPajak) || 0,
          biayaPph23: (values.pajak === "pph23" && values.biayaPajak) || 0,
          grandSubTotal: subTotal,
          grandPajak: totalPajak,
          grandPajakTerutang: totalPajakTerhutang,
          grandTotal: subTotal + totalPajak,
        },
      ],
      biayaSumberDanas: dataSumberDanaList,
    };
    handleCloseForm();
    handleSave(payload);
  };

  const handleCloseForm = () => {
    setListSumberDana([]);
    setHargaSatuan(0);
    setTotalPajak(0);
    setTotalPajakTerhutang(0);
    setSubTotal(0);
    setEditKuantitas(0);
    form.resetFields();
    handleClose();
  };

  const checkValidationHargaSatuan = () => {
    let hargaSatuan = form.getFieldValue("hargaSatuan");
    if (hargaSatuan > rincian?.hargaSatuan) {
      return Promise.reject(
        "Harga satuan melebihi dari harga satuan di rencana!",
      );
    } else {
      return Promise.resolve();
    }
  };

  function checkButtonDisabled() {
    const values = form.getFieldsValue();
    setButtonEnabledAllokasi(
      values.biayaPajak !== undefined &&
        values.biayaPajak !== null &&
        values.hargaSatuan &&
        values.pajak
        ? false
        : true,
    );
    if (values.hargaSatuan > 0) {
      setPajakEnabled(
        (values.pajak === "ppn" && true) ||
          (values.pajak === "termasukPajak" && true) ||
          (values.pajak === "tidakTermasukPajak" && true) ||
          false,
      );
      if (values.pajak === "ppn") {
        let pj: any =
          tmpPajak.find((item) => item.kode === values.pajak) || null;
        form.setFieldsValue({
          biayaPajak: Math.round(values.hargaSatuan * (pj.koefisien / 100)),
        });
      }
    }

    setButtonEnabled(values.sumberDanaList.length ? false : true);
    handleSubTotal();
  }

  const handleSubTotal = () => {
    const values = form.getFieldsValue();

    let tmpSubQuantity = 0;

    values.sumberDanaList.length &&
      // eslint-disable-next-line array-callback-return
      values.sumberDanaList.map((item: any) => {
        tmpSubQuantity += item?.kuantitas;
      });
    let tmpSubTotal =
      (values.hargaSatuan && Math.round(values.hargaSatuan * tmpSubQuantity)) ||
      0;
    let tmpPajakTotal =
      (values.biayaPajak && Math.round(values.biayaPajak * tmpSubQuantity)) ||
      0;
    setSubTotal(tmpSubTotal);
    setTotalPajak(tmpPajakTotal);
    setTotalPajakTerhutang((values.pajakTerhutang && tmpPajakTotal) || 0);
  };

  return (
    <>
      <Modal
        visible={openModal}
        title={`${title} Nota Pengeluaran Kegiatan`}
        width={1100}
        onCancel={handleCloseForm}
        okButtonProps={{ disabled: buttonEnabled }}
        okText="Simpan"
        onOk={() => form.submit()}>
        <Form
          form={form}
          key="modalRealisasiPengeluaranKegiatan"
          name="modalRealisasiPengeluaranKegiatan"
          layout="vertical"
          initialValues={{ biayaPajak: 0, sumberDanaList: listSumberDana }}
          onValuesChange={handleChange}
          onFinish={handleSaveForm}>
          <div className="grid grid-cols-1   md:grid-cols-2 gap-2">
            <div>
              <Form.Item
                label="Tipe Metode Pembayaran"
                name="metodePembayaran"
                rules={[
                  {
                    required: true,
                    message: "Metode Pembayaran tidak boleh kosong!",
                  },
                ]}>
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="Pilih Metode Pembayaran">
                  {tmpMetodePembayaran.length &&
                    tmpMetodePembayaran.map((item: any, i: any) => {
                      return (
                        <Select.Option
                          key={`tipePembayaran${i}`}
                          value={item.kode}>
                          {item.nama}
                        </Select.Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </div>
            <div>
              <Form.Item label="Penerima" required>
                <Input.Group compact>
                  <Form.Item
                    label="Penerima"
                    name="penerima"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: "Penerima tidak boleh kosong!",
                      },
                    ]}>
                    <Select
                      showSearch
                      style={{ width: "calc(100% - 50px)" }}
                      optionFilterProp="children"
                      placeholder="Pilih Penerima">
                      {tmpPenerima.length &&
                        tmpPenerima
                          // .filter((item) => allFilter.tipeKasID.includes(item.kode))
                          .map((item: any, i: any) => {
                            return (
                              <Select.Option
                                key={`penerima${i}`}
                                value={item.id}>
                                {item.nama}
                              </Select.Option>
                            );
                          })}
                    </Select>
                  </Form.Item>
                  <ButtonPlus
                    type="primary"
                    onClick={() => setOpenModalPenerima(true)}
                  />
                </Input.Group>
              </Form.Item>
            </div>
            {enabledRekeningPenerima && (
              <div>
                <Form.Item label="No Rekening Penerima" required>
                  <Input.Group compact>
                    <Form.Item
                      name="noRekeningPenerima"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: "No Rekening Penerima tidak boleh kosong!",
                        },
                      ]}>
                      <Select
                        showSearch
                        style={{ width: "calc(100% - 50px)" }}
                        optionFilterProp="children"
                        placeholder="Pilih No Rekening Penerima">
                        {listPenerimaRekening &&
                          tmpPenerima
                            .filter((item) =>
                              item.id.includes(listPenerimaRekening),
                            )
                            .map((item: any) => {
                              return (
                                item.penerimaRekenings.length &&
                                item.penerimaRekenings.map((items, i) => (
                                  <Select.Option
                                    key={`noRekPenerima${i}`}
                                    value={items.id}
                                    disabled={disabledRekening}>
                                    {getNameBank(items.kode_bank)} -{" "}
                                    {items.no_rekening}
                                  </Select.Option>
                                ))
                              );
                            })}
                      </Select>
                    </Form.Item>
                    <ButtonPlus
                      type="primary"
                      disabled={disabledRekening}
                      onClick={() => setOpenModalPenerimaRekening(true)}
                    />
                  </Input.Group>
                </Form.Item>
              </div>
            )}
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
                <DatePicker
                  // disabledDate={disabledDate}
                  showTime
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item label="Keterangan" name="keterangan">
                <Input.TextArea placeholder="Keterangan" />
              </Form.Item>
            </div>
          </div>
          <RincianRencana rincian={rincian} tmpPajak={tmpPajak} />
          <Divider orientation="left">Realisasi</Divider>
          <div className="grid grid-cols-1   md:grid-cols-3 gap-2">
            <div>
              <Form.Item
                label="Harga Satuan"
                name="hargaSatuan"
                rules={[
                  {
                    required: true,
                    message: "Harga Satuan tidak boleh kosong!",
                  },
                  {
                    validator: checkValidationHargaSatuan,
                  },
                ]}>
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  max={rincian?.hargaSatuan}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  prefix="Rp."
                  placeholder="Harga Satuan"
                />
              </Form.Item>
            </div>
            <div>
              <Descriptions layout="vertical" size="small" column={1}>
                <Descriptions.Item label="Sisa Kuantitas">
                  {sisaKuantitas}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
          <div className="grid grid-cols-1   md:grid-cols-3 gap-2">
            <div>
              <Form.Item
                label="Pajak"
                name="pajak"
                rules={[
                  {
                    required: true,
                    message: "Pajak tidak boleh kosong!",
                  },
                ]}>
                <Select allowClear showSearch placeholder="Pajak">
                  {tmpPajak &&
                    tmpPajak
                      .filter((item) => item.realisasi === "1")
                      .map((item: any) => (
                        <Select.Option value={item.kode}>
                          {item.nama}
                        </Select.Option>
                      ))}
                </Select>
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label="Termasuk Pajak Terhutang"
                name="pajakTerhutang"
                valuePropName="checked">
                <Switch />
              </Form.Item>
            </div>
            <div>
              <Form.Item label="Biaya Pajak" name="biayaPajak">
                <InputNumber
                  disabled={pajakEnabled}
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="0"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  prefix="Rp."
                />
              </Form.Item>
            </div>
          </div>

          <Divider orientation="left">Alokasi Sumber Dana</Divider>
          <Form.List name="sumberDanaList">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index: number) => {
                  console.log(tmpList);
                  let filterSumber =
                    (tmpList[index]?.sumberDana &&
                      filterSumberDana.filter(
                        (item: any) =>
                          !item.includes(tmpList[index]?.sumberDana),
                      )) ||
                    filterSumberDana;
                  let tmpDataSumber =
                    tmpListSumberDana.find(
                      (item) => item.id === tmpList[index]?.sumberDana,
                    ) || null;

                  let saldoSumber = (tmpDataSumber && tmpDataSumber.sisa) || 0;
                  let totalKuantitasHarga =
                    (!isNaN(hargaSatuan * tmpList[index]?.kuantitas) &&
                      hargaSatuan * tmpList[index]?.kuantitas) ||
                    0;
                  let maxKuantitas = tmpList[index]?.kuantitas + sisaKuantitas;

                  const checkValidationSaldo = (
                    saldoSumber,
                    totalKuantitasHarga,
                  ) => {
                    if (saldoSumber < totalKuantitasHarga) {
                      return Promise.reject(
                        "Saldo dari Sumber Dana tidak mencukupi!",
                      );
                    } else {
                      return Promise.resolve();
                    }
                  };

                  return (
                    <div>
                      <div
                        key={key}
                        className="flex flex-col md:flex-row gap-2"
                        style={{ marginBottom: 8 }}>
                        <div>{index + 1}.</div>
                        <div className="flex-auto">
                          <Form.Item
                            {...restField}
                            label="Sumber Dana"
                            key={`sumberDana${key}`}
                            name={[name, "sumberDana"]}
                            rules={[
                              {
                                required: true,
                                message: "Sumber Dana tidak boleh kosong!",
                              },
                              {
                                validator: () =>
                                  checkValidationSaldo(
                                    saldoSumber,
                                    totalKuantitasHarga,
                                  ),
                              },
                            ]}>
                            <Select allowClear placeholder="Pilih Sumber Dana">
                              {tmpListSumberDana.length &&
                                tmpListSumberDana
                                  .filter(
                                    (item: any) =>
                                      !filterSumber.includes(item.id),
                                  )
                                  .filter((item: any) =>
                                    allFilter.sumberDanaID.includes(
                                      item.kodeSumberDana,
                                    ),
                                  )
                                  .map((item: any) => (
                                    <Select.Option value={item.id}>
                                      {item.namaSumberDana} | {item.namaTipeKas}{" "}
                                      {item.kodeTipeKas === "rekening_bank" &&
                                        `| ${item.namaRekeningBank}-${item.noRekening}`}
                                    </Select.Option>
                                  ))}
                            </Select>
                          </Form.Item>
                        </div>
                        <div className="flex-auto">
                          <Form.Item
                            {...restField}
                            label="Kuantitas"
                            key={`kuantitas${key}`}
                            name={[name, "kuantitas"]}
                            rules={[
                              {
                                required: true,
                                message: "Jumlah Kuantitas tidak boleh kosong!",
                              },
                              {
                                validator: () =>
                                  checkValidationSaldo(
                                    saldoSumber,
                                    totalKuantitasHarga,
                                  ),
                              },
                            ]}>
                            <InputNumber
                              type="number"
                              min={1}
                              max={maxKuantitas}
                              placeholder="Alokasikan Kuantitas"
                            />
                          </Form.Item>
                        </div>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </div>
                      <div className="mb-2">
                        <Descriptions key={key} size="small" bordered>
                          <Descriptions.Item label="Saldo Sumber Dana" span={3}>
                            {formatRupiah(saldoSumber)}
                          </Descriptions.Item>
                          <Descriptions.Item label="Jumlah" span={3}>
                            {formatRupiah(totalKuantitasHarga)}
                          </Descriptions.Item>
                        </Descriptions>
                      </div>
                    </div>
                  );
                })}
                {sisaKuantitas > 0 && (
                  <Form.Item>
                    <Button
                      type="primary"
                      disabled={buttonEnabledAllokasi}
                      onClick={() => add()}
                      icon={<PlusOutlined />}>
                      Tambah
                    </Button>
                  </Form.Item>
                )}
              </>
            )}
          </Form.List>
        </Form>
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
              <Descriptions.Item label="Sub Total">
                {formatRupiah(subTotal)}
              </Descriptions.Item>
              <Descriptions.Item label="Total Pajak">
                {formatRupiah(totalPajak)}
              </Descriptions.Item>
              <Descriptions.Item label="Total Pajak Terhutang">
                {formatRupiah(totalPajakTerhutang)}
              </Descriptions.Item>
              <Descriptions.Item label="Grand Total">
                {formatRupiah(subTotal + totalPajak)}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </Modal>
      <ModalPenerima
        openModal={openModalPenerima}
        handleClose={() => setOpenModalPenerima(false)}
      />
      <ModalPenerimaRekening
        openModal={openModalPenerimaRekening}
        penerimaID={listPenerimaRekening}
        handleClose={() => setOpenModalPenerimaRekening(false)}
      />
    </>
  );
};
export default ModalPengeluaranKegiatan;
