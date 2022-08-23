/** @format */

import { Input, Select, Button, InputNumber, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  name: string;
  title: any;
  inputType: "number" | "text";
  record: any;
  index: number;
  tmpSatuan: any;
  tmpPajak: any;
  tmpTambahKomponen: any;
  tmpJenisBelanja: any;
  listKoefisien: any;
  listSatuan: any;
  tambahJenisBelanja: any;
  handleOpenKomponen: (e: string) => void;
  handleOpenSumberDana: (e: string) => void;
  handleKoefisien: (e: any, action: string) => void;
  handleOpenAKB: (e: string) => void;
  tmpTipePencairan: any;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  name,
  inputType,
  record,
  tmpSatuan,
  tmpPajak,
  tmpTipePencairan,
  index,
  tmpJenisBelanja,
  tmpTambahKomponen,
  children,
  listKoefisien,
  listSatuan,
  handleOpenKomponen,
  handleOpenSumberDana,
  handleKoefisien,
  handleOpenAKB,
  ...restProps
}) => {
  let inputNode: any = null;

  switch (name) {
    case "komponenBiayaNama":
      inputNode = (
        <Input
          disabled
          suffix={
            <Button
              size="small"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleOpenKomponen("Edit")}
            />
          }
        />
      );
      break;
    case "ketBiayaLain":
      inputNode = (
        <Input
          disabled={
            tmpTambahKomponen && tmpTambahKomponen?.listKomponen?.belanja_lain
              ? false
              : true
          }
          // placeholder="Keterangan Komponen Biaya"
        />
      );
      break;
    case "kodeJenisBelanja":
      inputNode = (
        <Select
          key="editAkun"
          placeholder="Kode Akun"
          style={{ width: "100%" }}>
          {tmpTambahKomponen &&
            tmpJenisBelanja.length &&
            tmpJenisBelanja
              .filter((item: any) =>
                tmpTambahKomponen?.listKomponen?.jenis_belanja.includes(
                  item.kode,
                ),
              )
              .map((item: any) => (
                <Select.Option value={item.kode}>
                  {item.kode}-{item.nama}
                </Select.Option>
              ))}
        </Select>
      );
      break;
    case "koef1Jumlah":
    case "koef2Jumlah":
    case "koef3Jumlah":
    case "koef4Jumlah":
      inputNode = <InputNumber min={0} type="number" placeholder="Target" />;
      break;
    case "koef1Satuan":
    case "koef2Satuan":
    case "koef3Satuan":
    case "koef4Satuan":
      inputNode = (
        <Select
          showSearch
          allowClear
          key="tambahkoe4Satuan"
          placeholder="Satuan"
          style={{ width: "100%" }}>
          {tmpSatuan.length &&
            tmpSatuan
              .filter((item: any) => !listSatuan.includes(item.kode))
              .sort((a, b) => a.nama.localeCompare(b.nama))
              .map((item: any) => (
                <Select.Option value={item.kode}>{item.nama}</Select.Option>
              ))}
        </Select>
      );
      break;
    case "hargaSatuan":
      inputNode = (
        <InputNumber
          key="inputtambahHargaSatuan"
          style={{ width: "100%" }}
          disabled
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          prefix="Rp."
        />
      );
      break;
    case "pajak":
      inputNode = (
        <Select
          key="itambahpajak"
          placeholder={tmpTambahKomponen ? "Pajak" : "Komponen masih kosong"}
          style={{ width: "100%" }}>
          {tmpTambahKomponen &&
            tmpPajak.length &&
            tmpPajak
              .filter(
                (item: any) =>
                  !["pph21", "pph22", "ppnTerhutang", "pph23"].includes(
                    item.kode,
                  ),
              )
              .map((item: any) => (
                <Select.Option value={item.kode}>{item.nama}</Select.Option>
              ))}
        </Select>
      );
      break;
    case "totalHarga":
      inputNode = (
        <InputNumber
          key="inputtambahHargaSatuan"
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          disabled
          prefix="Rp."
        />
      );
      break;
    case "sumberDana":
      inputNode = (
        <Input
          key="ieditSumberDana"
          disabled
          suffix={
            <Button
              size="small"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleOpenSumberDana("Edit")}
            />
          }
        />
      );
      break;
    case "tipePencairan":
      inputNode = (
        <Select
          key="itambahTipePencairan"
          placeholder="Tipe Pencairan"
          style={{ width: "100%" }}>
          {tmpTipePencairan.length &&
            tmpTipePencairan.map((item: any) => (
              <Select.Option value={item.kode}>{item.nama}</Select.Option>
            ))}
        </Select>
      );
      break;
    case "akb":
      inputNode = (
        <Input
          key="itambahAkb"
          disabled
          suffix={
            <Button
              size="small"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleOpenAKB("Edit")}
            />
          }
        />
      );
      break;
  }

  return (
    <td key={`tdac${name}`} {...restProps}>
      {editing ? (
        <>
          <Form.Item
            name={name}
            style={{ margin: 0 }}
            // rules={[
            //   {
            //     required: true,
            //     message: `Please Input ${title}!`,
            //   },
            // ]}
          >
            {inputNode}
          </Form.Item>
        </>
      ) : (
        children
      )}
    </td>
  );
};
export default EditableCell;
