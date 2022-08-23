/** @format */

import React, { useState } from "react";
import { BreadCrumb } from "../../../components";
import { uuidv4 } from "../../../utils/helper";

import {
  Table,
  Select,
  Collapse,
  Space,
  Input,
  Button,
  Modal,
  Form,
  Descriptions,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import InputSearch from "../../../components/InputSearch";
import {
  ButtonTableDelete,
  ButtonTableEdit,
  ButtonTableEditBlue,
  ButtonTambah,
} from "../../../components/Button";
import notifAlert from "../../../components/NotifAlert";
import { setStore } from "../../../redux/actions";
import {
  deletePenerimaRekening,
  postPenerima,
  postPenerimaRekening,
  editPenerimaRekening,
  deletePenerima,
  editPenerima,
} from "../../../services/v2/referenceservice/penerimaservices";
import { getReferenceAll } from "../../../services/v2/referenceservice";

const { Panel } = Collapse;

function PenerimaRekening() {
  const dispatch = useDispatch();
  const store = useSelector((state: any) => state.store);
  const auths = useSelector((state: any) => state.auth);
  const [search, setSearch] = useState<any>(null);
  const [form] = Form.useForm();
  const [formRekening] = Form.useForm();
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Pengaturan" },
    { path: "/", breadcrumbName: "Penerima" },
  ];
  const auth = auths.data || [];
  const tmpPenerimaRekening = store.penerimaRekening || [];
  const refTipePenerima: {
    kode: string;
    nama: string;
  }[] = store.tipePenerima || [];

  const refProvinsi: { kode: string; nama: string }[] = store.provinsi || [];
  const refKabkota: {
    kode: string;
    nama: string;
    kode_provinsi: string;
  }[] = store.kabkota || [];

  const refKecamatan: {
    kode: string;
    nama: string;
    kode_kabkota: string;
  }[] = store.kecamatan || [];
  // const refKelurahan: {
  //   kode: string;
  //   nama: string;
  //   kode_kecamatan: string;
  // }[] = store.kelurahan || [];
  const refBank: any = store.bank || [];
  const role = auth.kode_role;

  const [refKelurahan, setRefKelurahan] = useState<any>([]);

  const getData = async () => {
    const tmpKelurahan = store.kelurahan || [];
    if (tmpKelurahan.length) {
      setRefKelurahan(tmpKelurahan);
    } else {
      const kelurahan = await getReferenceAll("kelurahan", { activated: 1 });
      setRefKelurahan(kelurahan);
      setTimeout(() => {
        dispatch(setStore({ kelurahan }));
      }, 100);
    }
  };

  React.useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [title, setTitle] = useState("");
  const [id, setID] = useState("");
  const [idRekening, setIdRekening] = useState("");
  const [provinsi, setProvinsi] = useState<any>(null);
  const [kabkota, setKabKota] = useState<any>(null);
  const [kecamatan, setKecamatan] = useState<any>(null);
  const [listRekening, setListRekening] = useState<any>([]);
  const [dataRekening, setDataRekening] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [openModalAction, setOpenModalAction] = useState(false);
  const [openModalActionRekening, setOpenModalActionRekening] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  let dataTable = search
    ? tmpPenerimaRekening.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.nama !== null &&
            (item.nama || "").toLowerCase().includes(val)) ||
          (item.email !== null &&
            (item.email || "").toLowerCase().includes(val)) ||
          (item.npwp !== null &&
            (item.npwp || "").toLowerCase().includes(val)) ||
          (item.keterangan !== null &&
            (item.keterangan || "").toLowerCase().includes(val)) ||
          (item.alamat !== null &&
            (item.alamat || "").toLowerCase().includes(val))
        );
      })
    : tmpPenerimaRekening;

  let totalDataTable = dataTable.length;
  /**
   * Filter Pagination
   */
  dataTable = dataTable.filter((v, i) => {
    let start = pageSize * (page - 1);
    let end = start + pageSize;

    return i >= start && i < end;
  });

  const columns: any = [
    {
      title: "Tipe Penerima",
      dataIndex: "kode_tipe_penerima",
      key: "kode_tipe_penerima",
      width: "100%",
      render: (kode_tipe_penerima) =>
        refTipePenerima
          .filter((e) => e.kode === kode_tipe_penerima)
          .map((e) => e.nama),
    },
    {
      title: "Nama",
      dataIndex: "nama",
      key: "nama",
      width: "100%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "100%",
    },
    {
      title: "NPWP",
      dataIndex: "npwp",
      key: "npwp",
      width: "100%",
    },
    {
      title: "No Rekening",
      dataIndex: "nomor_rekening",
      key: "nomor_rekening",
      width: "100%",
    },
    {
      title: "Provinsi",
      dataIndex: "kode_provinsi",
      key: "kode_provinsi",
      width: "100%",
      render: (kode_provinsi) =>
        refProvinsi.filter((e) => e.kode === kode_provinsi).map((e) => e.nama),
    },
    {
      title: "Kab/Kota",
      dataIndex: "kode_kabkota",
      key: "kode_kabkota",
      width: "100%",
      render: (kode_kabkota) =>
        refKabkota.filter((e) => e.kode === kode_kabkota).map((e) => e.nama),
    },
    {
      title: "Kecamatan",
      dataIndex: "kode_kecamatan",
      key: "kode_kecamatan",
      width: "100%",
      render: (kode_kecamatan) =>
        refKecamatan
          .filter((e) => e.kode === kode_kecamatan)
          .map((e) => e.nama),
    },
    {
      title: "Kelurahan",
      dataIndex: "kode_kelurahan",
      key: "kode_kelurahan",
      width: "100%",
      render: (kode_kelurahan) =>
        refKelurahan
          .filter((e) => e.kode === kode_kelurahan)
          .map((e) => e.nama),
    },
    {
      title: "RT",
      dataIndex: "rt",
      key: "rt",
      width: "100%",
    },
    {
      title: "RW",
      dataIndex: "rw",
      key: "rw",
      width: "100%",
    },
    {
      title: "Alamat",
      dataIndex: "alamat_jalan",
      key: "alamat_jalan",
      width: "100%",
    },
    {
      title: "Keterangan",
      dataIndex: "keterangan",
      key: "keterangan",
      width: "100%",
    },
    {
      title: "Aksi",
      fixed: "right",
      width: "100%",
      render: (record) => (
        <Space size="small">
          <ButtonTableEditBlue
            tooltips="Detail"
            onClick={() => handleRekening(record)}
          />
          <ButtonTableEdit onClick={() => handleEdit(record, "penerima")} />
          <ButtonTableDelete
            onClick={() => {
              Modal.confirm({
                title: "Perhatian",
                content: "Yakin Hapus Data?",
                onOk() {
                  return handleDelete(record, "penerima");
                },
                onCancel() {},
                okText: "Hapus",
                cancelText: "Batal",
                okType: "danger",
              });
            }}
          />
        </Space>
      ),
    },
  ];

  const columnsRekening: any = [
    {
      title: "Nama Bank",
      dataIndex: "kode_bank",
      key: "kode_bank",
      render: (kode_bank) =>
        refBank.filter((e) => e.kode === kode_bank).map((e) => e.nama),
    },
    {
      title: "No Rekening",
      dataIndex: "no_rekening",
      key: "no_rekening",
    },
    {
      title: "Nama Rekening",
      dataIndex: "no_rekening_nama",
      key: "no_rekening_nama",
    },
    {
      title: "Aksi",
      render: (record) => (
        <Space size="small">
          <ButtonTableEdit
            onClick={() => handleEdit(record, "penerimaRekening")}
          />
          <ButtonTableDelete
            onClick={() => {
              Modal.confirm({
                title: "Perhatian",
                content: "Yakin Hapus Data?",
                onOk() {
                  return handleDelete(record, "rekening");
                },
                onCancel() {},
                okText: "Hapus",
                cancelText: "Batal",
                okType: "danger",
              });
            }}
          />
        </Space>
      ),
    },
  ];

  function handleChangeSelect(e: any, type: string) {
    if (e === undefined) {
      e = null;
    }
    switch (type) {
      case "provinsi":
        setProvinsi(e);
        setKabKota(null);
        setKecamatan(null);
        form.setFieldsValue({
          kabkota: null,
          kecamatan: null,
          kelurahan: null,
        });

        return;
      case "kabkota":
        setKabKota(e);
        setKecamatan(null);
        form.setFieldsValue({
          kecamatan: null,
          kelurahan: null,
        });

        return;
      case "kecamatan":
        setKecamatan(e);
        form.setFieldsValue({
          kelurahan: null,
        });
        return;
    }
  }

  function handleTambah() {
    setOpenModalAction(true);
    setID(uuidv4());
    setTitle("Tambah");
  }

  function handleEdit(record?: any, act?: string) {
    setTitle("Ubah");
    setID(record.id);

    if (act === "penerima") {
      setOpenModalAction(true);
      form.setFieldsValue({
        tipePenerima: record.kode_tipe_penerima,
        nama: record.nama,
        npwp: record.npwp,
        provinsi: record.kode_provinsi,
        kabkota: record.kode_kabkota,
        kecamatan: record.kode_kecamatan,
        kelurahan: record.kode_kelurahan,
        alamat: record.alamat_jalan,
        rt: record.rt,
        rw: record.rw,
        email: record.email,
        keterangan: record.keterangan,
        noRekening: record.nomor_rekening,
      });

      setProvinsi(record?.kode_provinsi);
      setKabKota(record?.kode_kabkota);
      setKecamatan(record?.kode_kecamatan);
    } else {
      setOpenModalActionRekening(true);
      formRekening.setFieldsValue({
        nama: record.no_rekening_nama,
        bank: record.kode_bank,
        noRekening: record.no_rekening,
      });
      setIdRekening(record.d_penerima_id);
    }
  }

  const handleSave = async (values: any) => {
    setIsLoading(true);

    let payload: any = {
      id: id,
      kode_provinsi: values.provinsi,
      kode_kabkota: values.kabkota,
      nama: values.nama,
      kode_kelurahan: values.kelurahan,
      tahun: auth.tahun,
      email: values.email,
      npwp: values.npwp,
      rt: values.rt,
      rw: values.rw,
      alamat_jalan: values.alamat,
      kode_kecamatan: values.kecamatan,
      keterangan: values.keterangan,
      kode_tipe_penerima: values.tipePenerima,
      nomor_rekening: values.noRekening,
      nama_rekening: values.nama,
    };
    if (title === "Tambah") {
      try {
        const res = await postPenerima(payload);
        updateDispath(res);
        notifAlert({ type: "success", description: "Data berhasil disimpan" });
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await editPenerima(payload);
        updateDispath(res);
        notifAlert({ type: "success", description: "Data berhasil disimpan" });
      } catch (err) {
        console.log(err);
      }
    }

    setOpenModalAction(false);
    setIsLoading(false);
  };

  const updateDispath = async (payload: any) => {
    let filterPenerima = tmpPenerimaRekening.filter(
      (item: any) => !item.id.includes(payload.id),
    );
    const penerimaRekening = [...filterPenerima, payload];
    setTimeout(() => {
      dispatch(setStore({ penerimaRekening }));
    }, 100);
  };

  const handleSaveRekening = async (values: any) => {
    setIsLoading(true);

    let payload: any = {
      id: id,
      kode_bank: values.bank,
      d_penerima_id: idRekening,
      no_rekening: values.noRekening,
      no_rekening_nama: values.nama,
    };

    let filterDataRekening: any = dataRekening.filter(
      (item: any) => !item.id.includes(id),
    );
    filterDataRekening.push(payload);
    let updatePenerima: any = {
      ...listRekening,
      penerimaRekenings: filterDataRekening,
    };

    try {
      if (title === "Tambah") {
        await postPenerimaRekening(payload);
      } else {
        await editPenerimaRekening(payload);
      }
      updateDispath(updatePenerima);
      setDataRekening(filterDataRekening);
      notifAlert({ type: "success", description: "Data berhasil disimpan" });
    } catch (err) {
      console.log(err);
    }
    setOpenModalActionRekening(false);
    setIsLoading(false);
  };

  const handleDelete = async (params: any, action: string) => {
    setIsLoading(true);
    if (action === "penerima") {
      try {
        await deletePenerima(params.id);
        const penerimaRekening = tmpPenerimaRekening.filter(
          (item: any) => !item.id.includes(params.id),
        );
        setTimeout(() => {
          dispatch(setStore({ penerimaRekening }));
        }, 100);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        let filterDataRekening = dataRekening.filter(
          (item: any) => !item.id.includes(params.id),
        );
        await deletePenerimaRekening(params.id);
        setDataRekening(filterDataRekening);
        let updatePenerima: any = {
          ...listRekening,
          penerimaRekenings: filterDataRekening,
        };
        updateDispath(updatePenerima);
      } catch (err) {
        console.log(err);
      }
    }
    notifAlert({ type: "success", description: "Data berhasil dihapus" });

    setIsLoading(false);
  };

  function handleRekening(record?: any) {
    setOpenModal(true);
    setListRekening(record);
    setDataRekening(record.penerimaRekenings);
  }

  function handleTambahRekening(dataRekening?) {
    setOpenModalActionRekening(true);
    setTitle("Tambah");
    setID(uuidv4());
    setIdRekening(dataRekening.id);
    formRekening.setFieldsValue({
      nama: dataRekening.nama,
      bank: null,
      noRekening: "",
    });
  }

  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Penerima" />
      <div className="m-5 p-5 bg-white shadow-md rounded">
        <div className="mb-4 flex justify-end">
          {(role === "bendahara_madrasah" || role === "kepala_madrasah") && (
            <div className="mr-4">
              <ButtonTambah onClick={handleTambah} />
            </div>
          )}
          <InputSearch
            className="w-3/4"
            onChange={(e: any) => setSearch(e.currentTarget.value)}
          />
        </div>

        <div className="w-full">
          <Table
            rowKey={(record) => record.id}
            columns={columns}
            scroll={{ x: "1300" }}
            tableLayout="auto"
            dataSource={dataTable}
            loading={isLoading}
            bordered
            pagination={{
              total: totalDataTable,
              position: ["bottomRight"],
              defaultPageSize: pageSize,
              defaultCurrent: page,
              showTotal: (total) => `Total ${total} items`,
              onChange(page, pageSize) {
                setPage(page);
                setPageSize(pageSize);
              },
            }}
          />
        </div>
      </div>
      <Modal
        width={750}
        visible={openModal}
        title={`Rekening Penerima`}
        onCancel={() => setOpenModal(!openModal)}
        footer={[
          <Button key="back" onClick={() => setOpenModal(!openModal)}>
            Tutup
          </Button>,
        ]}>
        <div className="p-2">
          <Collapse>
            <Panel header="Detail Penerima" key="1">
              <Descriptions
                title=""
                labelStyle={{ fontWeight: 600 }}
                layout="vertical">
                <Descriptions.Item label="Nama">
                  {listRekening.nama}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {listRekening.email}
                </Descriptions.Item>
                <Descriptions.Item label="NPWP">
                  {listRekening.npwp}
                </Descriptions.Item>
                <Descriptions.Item label="Provinsi">
                  {listRekening.kode_provinsi &&
                    refProvinsi
                      .filter(
                        (item: any) => item.kode === listRekening.kode_provinsi,
                      )
                      .map((item) => item.nama)}
                </Descriptions.Item>
                <Descriptions.Item label="Kab / Kota">
                  {listRekening.kode_kabkota &&
                    refKabkota
                      .filter(
                        (item: any) => item.kode === listRekening.kode_kabkota,
                      )
                      .map((item) => item.nama)}
                </Descriptions.Item>
                <Descriptions.Item label="Kecamatan">
                  {listRekening.kode_kecamatan &&
                    refKecamatan
                      .filter(
                        (item: any) =>
                          item.kode === listRekening.kode_kecamatan,
                      )
                      .map((item) => item.nama)}
                </Descriptions.Item>
                <Descriptions.Item label="Kelurahan">
                  {listRekening.kode_kelurahan &&
                    refKelurahan
                      .filter(
                        (item: any) =>
                          item.kode === listRekening.kode_kelurahan,
                      )
                      .map((item) => item.nama)}
                </Descriptions.Item>
                <Descriptions.Item label="RT">
                  {listRekening.rt}
                </Descriptions.Item>
                <Descriptions.Item label="RW">
                  {listRekening.rw}
                </Descriptions.Item>
                <Descriptions.Item label="No Rekening">
                  {listRekening.nama}
                </Descriptions.Item>
                <Descriptions.Item label="Alamat">
                  {listRekening.alamat}
                </Descriptions.Item>
                <Descriptions.Item label="Keterangan">
                  {listRekening.keterangan}
                </Descriptions.Item>
              </Descriptions>
            </Panel>
          </Collapse>
        </div>
        <div className="w-full p-2">
          <div className="my-2 float-right">
            <ButtonTambah onClick={() => handleTambahRekening(listRekening)} />
          </div>
          <Table
            rowKey={(record) => record.id}
            loading={isLoading}
            columns={columnsRekening}
            dataSource={dataRekening}
            bordered
          />
        </div>
      </Modal>

      <Modal
        visible={openModalActionRekening}
        title={`${title} Rekening Penerima`}
        onCancel={() => setOpenModalActionRekening(!openModalActionRekening)}
        footer={[
          <Button
            key="back"
            onClick={() =>
              setOpenModalActionRekening(!openModalActionRekening)
            }>
            Batal
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isLoading}
            onClick={() => formRekening.submit()}>
            Simpan
          </Button>,
        ]}>
        <Form
          form={formRekening}
          key="formRekeningPenerima"
          name="formRekeningPenerima"
          layout="vertical"
          onFinish={handleSaveRekening}>
          <Form.Item
            label="Bank"
            name="bank"
            rules={[
              {
                required: true,
                message: "Bank tidak boleh kosong!",
              },
            ]}>
            <Select
              showSearch
              optionFilterProp="children"
              placeholder="Pilih Bank">
              {refBank?.length &&
                refBank.map((e: any, i: any) => {
                  return (
                    <Select.Option key={`bank${i}`} value={e.kode}>
                      {e.nama}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>
          <Form.Item
            label="No Rekening"
            name="noRekening"
            rules={[
              {
                required: true,
                message: "No Rekening tidak boleh kosong!",
              },
            ]}>
            <Input type="number" placeholder="No Rekening" />
          </Form.Item>
          <Form.Item
            label="Nama"
            name="nama"
            rules={[
              {
                required: true,
                message: "Nama tidak boleh kosong!",
              },
            ]}>
            <Input placeholder="Nama" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        width={900}
        visible={openModalAction}
        title={`${title} Penerima`}
        onCancel={() => setOpenModalAction(!openModalAction)}
        footer={[
          <Button
            key="back"
            onClick={() => setOpenModalAction(!openModalAction)}>
            Batal
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isLoading}
            onClick={() => form.submit()}>
            Simpan
          </Button>,
        ]}>
        <Form
          form={form}
          key="formPenerima"
          name="formPenerima"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={handleSave}>
          <div className="flex  flex-col  md:flex-row gap-2 ">
            <div className="flex-1">
              <Form.Item
                label="Tipe Penerima"
                name="tipePenerima"
                rules={[
                  {
                    required: true,
                    message: "Tipe Penerima tidak boleh kosong!",
                  },
                ]}>
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="Pilih Tipe Penerima">
                  {refTipePenerima?.length &&
                    refTipePenerima.map((e: any, i: any) => {
                      return (
                        <Select.Option key={`bank${i}`} value={e.kode}>
                          {e.nama}
                        </Select.Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item
                label="Nama"
                name="nama"
                rules={[
                  {
                    required: true,
                    message: "Nama tidak boleh kosong!",
                  },
                ]}>
                <Input placeholder="Nama" />
              </Form.Item>
            </div>
          </div>
          <div className="flex  flex-col  md:flex-row gap-2 ">
            <div className="flex-1">
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Email tidak boleh kosong!",
                  },
                  {
                    type: "email",
                    message: "Format Email tidak valid!",
                  },
                ]}>
                <Input placeholder="Email" />
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item label="NPWP" name="npwp">
                <Input placeholder="NPWP" />
              </Form.Item>
            </div>
          </div>
          <div className="flex  flex-col  md:flex-row gap-2 ">
            <div className="flex-1">
              <Form.Item
                label="Provinsi"
                name="provinsi"
                rules={[
                  { required: true, message: "Provinsi tidak boleh kosong!" },
                ]}>
                <Select
                  showSearch
                  optionFilterProp="children"
                  onChange={(e: any) => handleChangeSelect(e, "provinsi")}
                  placeholder="Pilih Provinsi">
                  {refProvinsi?.length &&
                    refProvinsi.map((e: any, i: any) => {
                      return (
                        <Select.Option key={`sumbe${i}`} value={e.kode}>
                          {e.nama}
                        </Select.Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item
                label="Kabupaten / Kota"
                name="kabkota"
                rules={[
                  {
                    required: true,
                    message: "Kabupaten / Kota tidak boleh kosong!",
                  },
                ]}>
                <Select
                  showSearch
                  optionFilterProp="children"
                  onChange={(e: any) => handleChangeSelect(e, "kabkota")}
                  placeholder="Pilih Kabupaten / Kota">
                  {provinsi &&
                    refKabkota?.length &&
                    refKabkota
                      .filter((item: any) => item.kode_provinsi === provinsi)
                      .map((e: any, i: any) => {
                        return (
                          <Select.Option key={`kabkot${i}`} value={e.kode}>
                            {e.nama}
                          </Select.Option>
                        );
                      })}
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="flex  flex-col  md:flex-row gap-2 ">
            <div className="flex-1">
              <Form.Item
                label="Kecamatan"
                name="kecamatan"
                rules={[
                  { required: true, message: "Kecamatan tidak boleh kosong!" },
                ]}>
                <Select
                  showSearch
                  onChange={(e: any) => handleChangeSelect(e, "kecamatan")}
                  optionFilterProp="children"
                  placeholder="Pilih Kecamatan">
                  {kabkota &&
                    refKecamatan?.length &&
                    refKecamatan
                      .filter((item: any) => item.kode_kabkota === kabkota)
                      .map((e: any, i: any) => {
                        return (
                          <Select.Option key={`kec${i}`} value={e.kode}>
                            {e.nama}
                          </Select.Option>
                        );
                      })}
                </Select>
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item
                label="Kelurahan"
                name="kelurahan"
                rules={[
                  {
                    required: true,
                    message: "Kelurahan tidak boleh kosong!",
                  },
                ]}>
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="Pilih Kelurahan">
                  {kecamatan &&
                    refKelurahan?.length &&
                    refKelurahan
                      .filter((item: any) => item.kode_kecamatan === kecamatan)
                      .map((e: any, i: any) => {
                        return (
                          <Select.Option key={`sumbe${i}`} value={e.kode}>
                            {e.nama}
                          </Select.Option>
                        );
                      })}
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="flex  flex-col  md:flex-row gap-2 ">
            <div className="flex-1">
              <Form.Item label="RT" name="rt">
                <Input placeholder="RT" />
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item label="RW" name="rw">
                <Input placeholder="RW" />
              </Form.Item>
            </div>
          </div>
          <div className="flex  flex-col  md:flex-row gap-2 ">
            <div className="flex-1">
              <Form.Item label="No Rekening" name="noRekening">
                <Input placeholder="No Rekening" />
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item label="Alamat" name="alamat">
                <Input.TextArea placeholder="Alamat" />
              </Form.Item>
            </div>
          </div>
          <div className="md:w-1/2 lg:w-1/2">
            <Form.Item label="Keterangan" name="keterangan">
              <Input.TextArea placeholder="Keterangan" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
}
export default PenerimaRekening;
