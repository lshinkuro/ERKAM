/** @format */

import React from "react";
import { BreadCrumb } from "../../../components";
// import { useHistory } from "react-router-dom";
// import * as realizationService from "../../../../services/v2/realizationservice";
// import autoTable from 'jspdf-autotable';
// import jsPDF from 'jspdf';
// import { ExportToExcel } from '../../../components/Export/ExportToExcel';
// import { formatRupiah } from '../../../utils/helper';
// import { FunnelPlotOutlined } from '@ant-design/icons';
// import { PdfIcon, ExcelIcon } from '../../../icons';
// import moment from "moment";
// import 'moment/locale/id';

// import { Dropdown, DropdownItem } from "@windmill/react-ui";
import {
  Table,
  // Input,
  // InputGroup,
  // Icon,
  // Button,
  // Dropdown,
} from "rsuite";
// import { Table as Tablea, Row, Col, Select, Radio, Space, DatePicker } from 'antd';
const { Pagination } = Table;

let tableBody;
function LaporanCalk() {
  // const route = useHistory()
  // const item = ["Home", "Laporan", "Catatan Atas Laporan Keuangan"];
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Laporan" },
    { path: "/", breadcrumbName: "Catatan Atas Laporan Keuangan" },
  ];

  return (
    <>
      <BreadCrumb
        routes={itemBreadcrumb}
        title="Catatan Atas Laporan Keuangan"
      />
    </>
  );
}

export default LaporanCalk;
