/** @format */

import React, { useState } from "react";
import { BreadCrumb } from "../../../components";
import { Table, Input, Space, Form, Modal, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  ButtonTableDelete,
  ButtonTableEdit,
  ButtonTambah,
} from "../../../components/Button";
import notifAlert from "../../../components/NotifAlert";
import { uuidv4 } from "../../../utils/helper";
import InputSearch from "../../../components/InputSearch";
import { setStore } from "../../../redux/actions";
import {
  deleteSubKegiatan,
  postSubKegiatan,
} from "../../../services/v2/referenceservice/snpkegiatanservices";
const SubKegiatan = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Referensi" },
    { path: "/", breadcrumbName: "Sub Kegiatan" },
  ];
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const store = useSelector((state: any) => state.store);
  const auths = useSelector((state: any) => state.auth);
  const auth = auths.data || null;
  const kodeRole = auth?.kode_role;
  const refSubKegiatan = store.subKegiatan || [];
  const refKegiatan = store.kegiatan || [];
  const refSnp = store.snp || [];
  const refBos = store.penggunaanBos || [];
  const [search, setSearch] = useState<any>(null);
  const [snp, setSnp] = useState<any>(null);
  const [id, setID] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [title, setTitle] = useState<any>("");
  const [openModal, setOpenModal] = useState(false);

  /** Filter Search */
  let dataTable: any = search
    ? refSubKegiatan.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.nama !== null &&
            (item.nama || "").toString().toLowerCase().includes(val)) ||
          (item.kode !== null &&
            (item.kode || "").toString().toLowerCase().includes(val))
        );
      })
    : refSubKegiatan;
  const totalDataTable = dataTable.length;
  /**
   * Filter Pagination
   */
  dataTable = dataTable.filter((v, i) => {
    let start = pageSize * (page - 1);
    let end = start + pageSize;

    return i >= start && i < end;
  });

  const columnTmp: any = [
    {
      title: "Kode",
      dataIndex: "kode",
      key: "kode",
      width: 200,
      onFilter: (value, record) => record.kode.indexOf(value) === 0,
      sorter: (a, b) => a.kode.length - b.kode.length,
    },
    {
      title: "Nama Sub Kegiatan",
      key: "nama",
      dataIndex: "nama",
    },
    {
      title: "BOS",
      children: [
        {
          title: "Kode",
          key: "kode_bos",
          dataIndex: "kode_bos",
        },
        {
          title: "Komponen",
          key: "nama_bos",
          dataIndex: "nama_bos",
        },
      ],
    },
    {
      title: "Aksi",
      key: "aksi",
      align: "center",
      width: 120,
      fixed: "right",
      render: (record) => (
        <Space>
          <ButtonTableEdit onClick={() => handleEdit(record)} />
          <ButtonTableDelete
            onClick={() => {
              Modal.confirm({
                title: "Perhatian",
                content: "Yakin Hapus Data?",
                onOk() {
                  return handleDelete(record);
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

  kodeRole !== "super_admin_pusat" &&
    kodeRole !== "admin_pusat" &&
    delete columnTmp[4];

  const handleEdit = (record: any) => {
    setTitle("Edit");
    setOpenModal(true);
    setID(record.id);
    setSnp(record.kode_snp);
    form.setFieldsValue({
      nama: record.nama,
      kode: record.kode,
      snp: record.kode_snp,
      kegiatan: record.kode_kegiatan,
      bos: record.kode_bos,
    });
  };

  const handleDelete = async (record: any) => {
    try {
      await deleteSubKegiatan(record.id);
      let subKegiatan = refSubKegiatan.filter(
        (item: any) => item.id !== record.id,
      );

      notifAlert({
        type: "success",
        description: "Hapus data berhasil",
      });

      setTimeout(() => {
        dispatch(setStore({ subKegiatan }));
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTambah = () => {
    setTitle("Tambah");
    setID(uuidv4());
    setSnp(null);
    setOpenModal(true);
    form.resetFields();
  };

  const handleSave = async (values: any) => {
    const tmpBos = refBos.filter((item) => item.kode === values.bos);
    const payload: any = {
      id: id,
      tahun: auth.isTahun,
      activated: 1,
      nama: values.nama,
      kode: values.kode,
      kode_snp: values.snp,
      kode_bos: values.bos,
      nama_bos: (tmpBos.length && tmpBos[0].nama) || null,
      kode_kegiatan: values.kegiatan,
    };

    const filterSubKegiatan = refSubKegiatan.filter(
      (item: any) => !item.id.includes(id),
    );

    try {
      const res = await postSubKegiatan(payload);
      const subKegiatan = [...filterSubKegiatan, res];
      notifAlert({
        type: "success",
        description: "Data berhasil disimpan",
      });
      setTimeout(() => {
        dispatch(setStore({ subKegiatan }));
      }, 100);
    } catch (error) {
      console.log(error);
    }

    setOpenModal(false);
  };

  const validateName = (_, values) => {
    const val = values.toLowerCase();

    const checkName: any =
      refSubKegiatan
        .filter((item) => !item.id.includes(id))
        .filter(
          (item) =>
            item.nama !== null &&
            (item.nama || "").toString().toLowerCase() === val,
        ) || null;
    if (checkName.length) {
      return Promise.reject("Nama Sudah Digunakan!");
    } else {
      return Promise.resolve();
    }
  };

  const validateKode = (_, values) => {
    const val = values.toLowerCase();

    const checkKode: any =
      refSubKegiatan
        .filter((item) => !item.id.includes(id))
        .filter(
          (item) =>
            item.kode !== null &&
            (item.kode || "").toString().toLowerCase() === val,
        ) || null;
    if (checkKode.length) {
      return Promise.reject("Kode Sudah Digunakan!");
    } else {
      return Promise.resolve();
    }
  };

  const handleChange = (values) => {
    for (let obj in values) {
      if (obj === "snp") {
        setSnp(values.snp);
        form.setFieldsValue({ kegiatan: null });
      }
    }
  };
  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Sub Kegiatan" />
      <div className="m-5 p-5 bg-white shadow-md rounded">
        <div className="mb-4 flex justify-end">
          {(kodeRole === "admin_pusat" || kodeRole === "super_admin_pusat") && (
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
            columns={columnTmp}
            dataSource={dataTable}
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
        visible={openModal}
        title={`${title} Sub Kegiatan`}
        onCancel={() => setOpenModal(!openModal)}
        okText="Simpan"
        cancelText="Batal"
        onOk={() => form.submit()}>
        <Form
          form={form}
          key="formSumberDana"
          name="formSumberDana"
          layout="vertical"
          onValuesChange={handleChange}
          onFinish={handleSave}>
          <Form.Item
            label="Standar Nasional Pendidikan"
            name="snp"
            rules={[
              {
                required: true,
                message: "Standar Nasional Pendidikan tidak boleh kosong!",
              },
            ]}>
            <Select
              placeholder="Standar Nasional Pendidikan"
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option!.children as unknown as string).includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA!.children as unknown as string)
                  .toLowerCase()
                  .localeCompare(
                    (optionB!.children as unknown as string).toLowerCase(),
                  )
              }
              showSearch>
              {refSnp &&
                refSnp.map((item, i) => (
                  <Select.Option
                    key={`snp${i}`}
                    value={
                      item.kode
                    }>{`${item.kode}. ${item.nama}`}</Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Kegiatan"
            name="kegiatan"
            rules={[
              {
                required: true,
                message: "Kegiatan Pendidikan tidak boleh kosong!",
              },
            ]}>
            <Select placeholder="Kegiatan" allowClear showSearch>
              {refKegiatan &&
                snp &&
                refKegiatan
                  .filter((item) => item.kode_snp === snp)
                  .map((item, i) => (
                    <Select.Option
                      key={`keg${i}`}
                      value={
                        item.kegiatan.kode
                      }>{`${item.kegiatan.kode}. ${item.kegiatan.nama}`}</Select.Option>
                  ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Usulan Penggunaan BOS"
            name="bos"
            rules={[
              {
                required: true,
                message: "Usulan Penggunaan BOS tidak boleh kosong!",
              },
            ]}>
            <Select placeholder="Usulan Penggunaan BOS" allowClear showSearch>
              {refBos &&
                refBos.map((item, i) => (
                  <Select.Option
                    key={`bos${i}`}
                    value={
                      item.kode
                    }>{`${item.kode}. ${item.nama}`}</Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Kode"
            name="kode"
            rules={[
              { required: true, message: "Kode tidak boleh kosong!" },
              { validator: validateKode },
            ]}>
            <Input placeholder="Kode" />
          </Form.Item>
          <Form.Item
            label="Nama"
            name="nama"
            rules={[
              { required: true, message: "Nama tidak boleh kosong!" },
              { validator: validateName },
            ]}>
            <Input placeholder="Nama" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SubKegiatan;
