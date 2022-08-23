/** @format */

import React, { useState } from "react";
import {
  Select,
  InputNumber,
  Form,
  Table,
  Modal,
  Button,
  TreeSelect,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  formatRupiah,
  treeNested,
  treeNestedBelanja,
} from "../../../../../utils/helper";
import InputSearch from "../../../../../components/InputSearch";
import { getReferenceAll } from "../../../../../services/v2/referenceservice";
import { setStore } from "../../../../../redux/actions";

type komponenModal = {
  title: string;
  openModal: boolean;
  onClose: () => void;
  saveKomponen: (values: any, action: string) => void;
};

type komponenType = {
  hargaSatuan: any;
  hargaKode: any;
  listKomponen: any;
};

const ModalKomponen = (params: komponenModal) => {
  const dispatch = useDispatch();
  const store = useSelector((state: any) => state.store);
  const auths = useSelector((state: any) => state.auth);
  const auth = auths?.data || null;
  const [search, setSearch] = useState<any>(null);
  // const tmpRefKomponenBiaya = store.komponenBiaya || [];
  const tmpKategoriKomponenBiaya = store.kategoriKomponenBiaya || [];

  const tmpKategoriBelanja = store.kategoriBelanja || [];
  const [form] = Form.useForm();
  const [formSetHarga] = Form.useForm();
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(null);
  const [tmpData, setTmpData] = useState<any>({
    hargaSatuan: 0,
    kodeHarga: "",
    listKomponen: {},
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [kategoriBiaya, setKategoriBiaya] = useState<any>(null);
  const [jenisBelanja, setJenisBelanja] = useState<any>(null);
  const dataSelectKategoriBiaya = treeNested(tmpKategoriKomponenBiaya);
  const dataSelectJenisBiaya = treeNestedBelanja(tmpKategoriBelanja);
  const [tmpRefKomponenBiaya, setTmpRefKomponenBiaya] = useState<any>([]);

  const getData = async () => {
    setLoading(true);
    const refKomponenBiaya = store.komponenBiaya || [];
    if (refKomponenBiaya.length) {
      setTmpRefKomponenBiaya(refKomponenBiaya);
    } else {
      const komponenBiaya = await getReferenceAll("komponen-biaya", {
        tahun: auth.isTahun,
        kode_provinsi: auth.madrasah.kode_provinsi,
        kode_kabkota: auth.madrasah.kode_kabkota,
      });
      setTmpRefKomponenBiaya(komponenBiaya);
      setTimeout(() => {
        dispatch(setStore({ komponenBiaya }));
      }, 100);
    }

    setLoading(false);
  };

  React.useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let dataTable: any = search
    ? tmpRefKomponenBiaya.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.nama_kategori !== null &&
            (item.nama_kategori || "")
              .toString()
              .toLowerCase()
              .includes(val)) ||
          (item.kode_komponen_biaya !== null &&
            (item.kode_komponen_biaya || "")
              .toString()
              .toLowerCase()
              .includes(val)) ||
          (item.nama !== null &&
            (item.nama || "").toString().toLowerCase().includes(val))
        );
      })
    : tmpRefKomponenBiaya;

  dataTable = kategoriBiaya
    ? dataTable.filter((item: any) => item.kode_kategori === kategoriBiaya)
    : dataTable;

  dataTable = jenisBelanja
    ? dataTable.filter((item: any) => item.jenis_belanja.includes(jenisBelanja))
    : dataTable;
  let totalDataTable = dataTable.length;
  /**
   * Filter Pagination
   */
  dataTable = dataTable.filter((v, i) => {
    let start = pageSize * (page - 1);
    let end = start + pageSize;

    return i >= start && i < end;
  });

  const handleChange = (values, record) => {
    if (values === "setHarga" || values === "setLain") {
      setModal(true);
      setAction(values);
      setTmpData(record);
    } else {
      let tmpKomponen: komponenType = {
        ...tmpData,
        kodeHarga: values,
        hargaSatuan: record[values],
        listKomponen: record,
      };
      params.saveKomponen(tmpKomponen, params.title);
    }
  };

  const handleSave = (values) => {
    let payload: any = {
      ...values,
      kodeHarga: "setHarga",
      listKomponen: tmpData,
    };
    setModal(false);
    params.saveKomponen(payload, params.title);
  };

  let columns: any = [
    {
      title: "Kode",
      key: "kode",
      dataIndex: "kode",
    },
    {
      title: "Kategori",
      dataIndex: "nama_kategori",
      key: "nama_kategori",
    },
    {
      title: "Nama",
      key: "nama",
      dataIndex: "nama",
    },
    {
      title: "Akun Belanja",
      dataIndex: "jenis_belanja",
      key: "jenis_belanja",
      render: (jenis_belanja) =>
        ((jenis_belanja || jenis_belanja.length) &&
          jenis_belanja.map((item: any, i: number) =>
            i > 0 ? `, ${item}` : item,
          )) ||
        "-",
    },
    {
      title: "Aksi",
      key: "Aksi",
      render: (record) => (
        <Select
          key={record.komponen_biaya_harga_id}
          value={null}
          placeholder="Pilih Harga"
          onChange={(values) => handleChange(values, record)}>
          <Select.Option value="harga_1">
            {formatRupiah(record.harga_1)}
          </Select.Option>
          <Select.Option value="harga_2">
            {formatRupiah(record.harga_2)}
          </Select.Option>
          <Select.Option value="harga_3">
            {formatRupiah(record.harga_3)}
          </Select.Option>
          <Select.Option value="setHarga">Tetapkan Harga</Select.Option>
        </Select>
      ),
    },
  ];

  return (
    <>
      <Modal
        visible={params.openModal}
        width={1000}
        title={`Komponen Biaya`}
        onCancel={() => params.onClose()}>
        <Form form={form} key="filterKomponenBiaya">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-1">
              <Form.Item
                label="Kategori Komponen Biaya"
                name="kategoriKomponenBiaya">
                <TreeSelect
                  showSearch
                  style={{ width: "100%" }}
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  placeholder="Kategori Komponen Biaya"
                  allowClear
                  onChange={(values) => setKategoriBiaya(values)}
                  treeData={dataSelectKategoriBiaya}
                />
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item label="Jenis Belanja" name="jenisBelanja">
                <TreeSelect
                  showSearch
                  style={{ width: "100%" }}
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  placeholder="Jenis Belanja"
                  allowClear
                  treeData={dataSelectJenisBiaya}
                  onChange={(values) => setJenisBelanja(values)}
                />
              </Form.Item>
            </div>
          </div>
        </Form>
        <div className="w-full md:w-1/2 mb-2">
          <InputSearch
            onChange={(e: any) => setSearch(e.currentTarget.value)}
          />
        </div>
        <div className="w-full">
          <Table
            size="small"
            columns={columns}
            loading={loading}
            dataSource={dataTable}
            tableLayout="auto"
            bordered
            rowKey={(record) => record.komponen_biaya_harga_id}
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
      </Modal>
      <Modal
        visible={modal}
        title={action === "setHarga" ? `Tetapkan Harga` : "Lain Lain"}
        onCancel={() => setModal(!modal)}
        footer={[
          <Button key="back" onClick={() => setModal(!modal)}>
            Batal
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => formSetHarga.submit()}>
            Simpan
          </Button>,
        ]}>
        <Form
          key="filterSetHarga"
          form={formSetHarga}
          layout="vertical"
          onFinish={handleSave}>
          <Form.Item
            label="Harga Satuan"
            name="hargaSatuan"
            rules={[
              { required: true, message: "Harga Satuan tidak boleh kosong!" },
            ]}>
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              prefix="Rp."
              placeholder="Harga Satuan"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default ModalKomponen;
