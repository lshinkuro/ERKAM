/**
 * ⚠ DISINI CUMA ARRAY YANG DIPAKE UNTUK RENDER ISI DARI NAVBAR
 * Disini bisa di masukan path, icon dan nama menu.
 *
 * ROUTING ADA DI,
 * `src/routes/index.js`
 *
 * * SIDEBAR COMPONEN ADA DI,
 * `/src/components/Sidebar`
 *
 * @format
 */

//////////////////////////MADRASAH/////////////////////////////////////
//KEPALA MADRASAH
export const kepala_madrasah = [
  {
    path: "/dashboard", // the url
    icon: "HomeOutlined", //"HomeIcon", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/edm", // the url
    icon: "EditOutlined", // the component being exported from icons/index.js
    name: "Evaluasi Diri Madrasah", // name that appear in Sidebar
  },
  {
    path: "/profile-madrasah", // the url
    icon: "IdcardOutlined", // the component being exported from icons/index.js
    name: "Profil Madrasah", // name that appear in Sidebar
  },
  {
    icon: "SettingOutlined",
    name: "Pengaturan",
    routes: [
      {
        icon: "TeamOutlined",
        name: "Manajemen User",
        routes: [
          // submenu
          {
            path: "/pengaturan/management-user/staff-madrasah",
            name: "Staf Madrasah",
          },
        ],
      },
      {
        path: "/pengaturan/rekening-bank",
        name: "Rekening Bank",
      },
      {
        path: "/pengaturan/penerima",
        name: "Penerima",
      },
    ],
  },
  {
    icon: "FolderOutlined",
    name: "Referensi",
    routes: [
      // submenu
      {
        path: "/referensi/snp",
        name: "Program dan Kegiatan",
      },
      {
        path: "/referensi/tahun",
        name: "Tahun",
      },
      {
        path: "/referensi/jenis-belanja",
        name: "Jenis Belanja",
      },
      {
        path: "/referensi/komponen-biaya",
        name: "Komponen Biaya",
      },
      // {
      //   icon: "FileDoneOutlined",
      //   name: "Usulan ",
      //   routes: [
      //     // submenu
      //     {
      //       path: "/usulan/kegiatan/list",
      //       name: "Usulan Kegiatan",
      //     },
      //     {
      //       path: "/usulan/subkegiatan/list",
      //       name: "Usulan Sub Kegiatan ",
      //     },
      //     {
      //       path: "/usulan/komponen/list",
      //       name: "Usulan Komponen",
      //     },
      //   ],
      // },
    ],
  },
  {
    icon: "PieChartOutlined",
    name: "Rencana",
    routes: [
      {
        name: "Pagu Indikatif",
        routes: [
          {
            path: "/rencana/indikatif/pendapatan",
            name: "Pendapatan",
          },
          {
            path: "/rencana/indikatif/belanja",
            name: "Belanja",
          },
        ],
      },
      {
        name: "Pagu Definitif",
        routes: [
          {
            path: "/rencana/definitif/pendapatan",
            name: "Pendapatan",
          },
          {
            path: "/rencana/definitif/belanja",
            name: "Belanja",
          },
        ],
      },
    ],
  },
  // {
  //   icon: "CreditCardOutlined",
  //   name: "Pencairan",
  //   routes: [
  //     // submenu
  //     {
  //       path: "/pencairan/pagu-definitif",
  //       name: "Pagu Definitif",
  //     },
  //     {
  //       path: "/pencairan/pencairan-pagu/list",
  //       name: "Pencairan Pagu",
  //     },
  //   ],
  // },
  {
    icon: "RiseOutlined",
    name: "Realisasi",
    routes: [
      // submenu
      {
        path: "/realisasi/pendapatan/list",
        name: "Pendapatan",
      },
      {
        path: "/realisasi/pindah-buku/list",
        name: "Pindah Buku",
      },
      {
        path: "/realisasi/pengeluaran-kegiatan/list",
        name: "Pengeluaran Kegiatan",
      },
      {
        path: "/realisasi/pengeluaran-pajak/list",
        name: "Pengeluaran Pajak",
      },
      {
        path: "/realisasi/pengembalian-dana/list",
        name: "Pengembalian Dana",
      },
      {
        path: "/realisasi/output-kegiatan",
        name: "Output Kegiatan",
      },
    ],
  },
  // {
  //   icon: "UsbOutlined",
  //   name: "Export & Backup",
  //   routes: [
  //     // submenu
  //     {
  //       path: "/export",
  //       name: "Export Data",
  //     },
  //     {
  //       path: "/backup",
  //       name: "Backup Data",
  //     },
  //   ],
  // },
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "RKAKL",
          },
          // {
          //   path: "/laporan/rkakl-konsolidasi-min",
          //   name: "RKAKL Konsolidasi Min",
          // },
          {
            path: "/laporan/laporan-rapbm",
            name: "RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          // {
          //   path: "/laporan/buku-kas-umum-konsolidasi-min",
          //   name: "Laporan BKU Konsolidasi Min",
          // },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
];

//BENDAHARA MADRASAH
export const bendahara_madrasah = [
  {
    path: "/dashboard", // the url
    icon: "HomeOutlined", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/edm", // the url
    icon: "EditOutlined", // the component being exported from icons/index.js
    name: "Evaluasi Diri Madrasah", // name that appear in Sidebar
  },
  {
    path: "/profile-madrasah", // the url
    icon: "IdcardOutlined", // the component being exported from icons/index.js
    name: "Profil Madrasah", // name that appear in Sidebar
  },
  {
    icon: "SettingOutlined",
    name: "Pengaturan",
    routes: [
      {
        path: "/pengaturan/rekening-bank",
        name: "Rekening Bank",
      },
      {
        path: "/pengaturan/penerima",
        name: "Penerima",
      },
    ],
  },

  {
    icon: "FolderOutlined",
    name: "Referensi",
    routes: [
      // submenu
      {
        path: "/referensi/snp",
        name: "Program dan Kegiatan",
      },
      {
        path: "/referensi/tahun",
        name: "Tahun",
      },
      {
        path: "/referensi/jenis-belanja",
        name: "Jenis Belanja",
      },
      {
        path: "/referensi/kegiatan",
        name: "Kegiatan",
      },
      {
        path: "/referensi/komponen-biaya",
        name: "Komponen Biaya",
      },
      // {
      //   icon: "FileDoneOutlined",
      //   name: "Usulan",
      //   routes: [
      //     // submenu
      //     {
      //       path: "/usulan/kegiatan/list",
      //       name: "Usulan Kegiatan",
      //     },
      //     {
      //       path: "/usulan/subkegiatan/list",
      //       name: "Usulan Sub Kegiatan ",
      //     },
      //     {
      //       path: "/usulan/komponen/list",
      //       name: "Usulan Komponen",
      //     },
      //   ],
      // },
    ],
  },
  {
    icon: "PieChartOutlined",
    name: "Rencana",
    routes: [
      {
        name: "Pagu Indikatif",
        routes: [
          {
            path: "/rencana/indikatif/pendapatan",
            name: "Pendapatan",
          },
          {
            path: "/rencana/indikatif/belanja",
            name: "Belanja",
          },
        ],
      },
      {
        name: "Pagu Definitif",
        routes: [
          {
            path: "/rencana/definitif/pendapatan",
            name: "Pendapatan",
          },
          {
            path: "/rencana/definitif/belanja",
            name: "Belanja",
          },
        ],
      },
    ],
  },
  // {
  //   icon: "CreditCardOutlined",
  //   name: "Pencairan",
  //   routes: [
  //     // submenu
  //     {
  //       path: "/pencairan/pagu-definitif",
  //       name: "Pagu Definitif",
  //     },
  //     {
  //       path: "/pencairan/pencairan-pagu/list",
  //       name: "Pencairan Pagu",
  //     },
  //   ],
  // },
  {
    icon: "RiseOutlined",
    name: "Realisasi",
    routes: [
      // submenu
      {
        path: "/realisasi/pendapatan/list",
        name: "Pendapatan",
      },
      {
        path: "/realisasi/pindah-buku/list",
        name: "Pindah Buku",
      },
      {
        path: "/realisasi/pengeluaran-kegiatan/list",
        name: "Pengeluaran Kegiatan",
      },
      {
        path: "/realisasi/pengeluaran-pajak/list",
        name: "Pengeluaran Pajak",
      },
      {
        path: "/realisasi/pengembalian-dana/list",
        name: "Pengembalian Dana",
      },
      {
        path: "/realisasi/output-kegiatan",
        name: "Output Kegiatan",
      },
    ],
  },
  // {
  //   icon: "UsbOutlined",
  //   name: "Export & Backup",
  //   routes: [
  //     // submenu
  //     {
  //       path: "/export",
  //       name: "Export Data",
  //     },
  //     {
  //       path: "/backup",
  //       name: "Backup Data",
  //     },
  //   ],
  // },
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "Laporan RKAKL",
          },
          // {
          //   path: "/laporan/rkakl-konsolidasi-min",
          //   name: "RKAKL Konsolidasi Min",
          // },
          {
            path: "/laporan/laporan-rapbm",
            name: "Laporan RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          // {
          //   path: "/laporan/buku-kas-umum-konsolidasi-min",
          //   name: "Laporan BKU Konsolidasi Min",
          // },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
];

//STAFF MADRASAH
export const staff_madrasah = [
  {
    path: "/dashboard", // the url
    icon: "HomeOutlined", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/edm", // the url
    icon: "EditOutlined", // the component being exported from icons/index.js
    name: "Evaluasi Diri Madrasah", // name that appear in Sidebar
  },
  {
    path: "/profile-madrasah", // the url
    icon: "IdcardOutlined", // the component being exported from icons/index.js
    name: "Profil Madrasah", // name that appear in Sidebar
  },
  {
    icon: "SettingOutlined",
    name: "Pengaturan",
    routes: [
      // {
      //   path: "/pengaturan/rekening-bank",
      //   name: "Rekening Bank",
      // },
      {
        path: "/referensi/rekening-belanja",
        name: "Rekening Bank Madrasah",
      },
      {
        path: "/pengaturan/penerima",
        name: "Penerima",
      },
    ],
  },

  {
    icon: "FolderOutlined",
    name: "Referensi",
    routes: [
      // submenu
      {
        path: "/referensi/snp",
        name: "Program dan Kegiatan",
      },
      {
        path: "/referensi/tahun",
        name: "Tahun",
      },
      {
        path: "/referensi/jenis-belanja",
        name: "Jenis Belanja",
      },
      {
        path: "/referensi/kegiatan",
        name: "Kegiatan",
      },
      {
        path: "/referensi/komponen-biaya",
        name: "Komponen Biaya",
      },
      // {
      //   icon: "FileDoneOutlined",
      //   name: "Usulan Kegiatan",
      //   routes: [
      //     // submenu
      //     {
      //       path: "/usulan/kegiatan/list",
      //       name: "Usulan Kegiatan",
      //     },
      //     {
      //       path: "/usulan/subkegiatan/list",
      //       name: "Usulan Sub Kegiatan ",
      //     },
      //     {
      //       path: "/usulan/komponen/list",
      //       name: "Usulan Komponen",
      //     },
      //   ],
      // },
    ],
  },
  {
    icon: "PieChartOutlined",
    name: "Rencana",
    routes: [
      {
        name: "Pagu Indikatif",
        routes: [
          {
            path: "/rencana/indikatif/pendapatan",
            name: "Pendapatan",
          },
          {
            path: "/rencana/indikatif/belanja",
            name: "Belanja",
          },
        ],
      },
      {
        name: "Pagu Definitif",
        routes: [
          {
            path: "/rencana/definitif/pendapatan",
            name: "Pendapatan",
          },
          {
            path: "/rencana/definitif/belanja",
            name: "Belanja",
          },
        ],
      },
    ],
  },
  // {
  //   icon: "CreditCardOutlined",
  //   name: "Pencairan",
  //   routes: [
  //     // submenu
  //     {
  //       path: "/pencairan/pagu-definitif",
  //       name: "Pagu Definitif",
  //     },
  //     {
  //       path: "/pencairan/pencairan-pagu/list",
  //       name: "Pencairan Pagu",
  //     },
  //   ],
  // },
  {
    icon: "RiseOutlined",
    name: "Realisasi",
    routes: [
      // submenu
      {
        path: "/realisasi/pendapatan/list",
        name: "Pendapatan",
      },
      {
        path: "/realisasi/pindah-buku/list",
        name: "Pindah Buku",
      },
      {
        path: "/realisasi/pengeluaran-kegiatan/list",
        name: "Pengeluaran Kegiatan",
      },
      {
        path: "/realisasi/pengeluaran-pajak/list",
        name: "Pengeluaran Pajak",
      },
      {
        path: "/realisasi/pengembalian-dana/list",
        name: "Pengembalian Dana",
      },
      {
        path: "/realisasi/output-kegiatan",
        name: "Output Kegiatan",
      },
    ],
  },
  // {
  //   icon: "UsbOutlined",
  //   name: "Export & Backup",
  //   routes: [
  //     // submenu
  //     {
  //       path: "/export",
  //       name: "Export Data",
  //     },
  //     {
  //       path: "/backup",
  //       name: "Backup Data",
  //     },
  //   ],
  // },
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "RKAKL",
          },
          // {
          //   path: "/laporan/rkakl-konsolidasi-min",
          //   name: "RKAKL Konsolidasi Min",
          // },
          {
            path: "/laporan/laporan-rapbm",
            name: "RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          // {
          //   path: "/laporan/buku-kas-umum-konsolidasi-min",
          //   name: "Laporan BKU Konsolidasi Min",
          // },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
];

/////////////////////////////KAB/KOTA/////////////////////////////////
//ADMIN KAB KOTA
export const admin_kabkota = [
  {
    path: "/dashboard", // the url
    icon: "HomeOutlined", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/edm", // the url
    icon: "EditOutlined", // the component being exported from icons/index.js
    name: "Evaluasi Diri Madrasah", // name that appear in Sidebar
  },
  {
    icon: "SettingOutlined",
    name: "Pengaturan",
    routes: [
      {
        icon: "TeamOutlined",
        name: "Manajemen User",
        routes: [
          // submenu
          {
            path: "/pengaturan/management-user/kabkota",
            name: "Kankemenag",
          },
          {
            path: "/pengaturan/management-user/madrasah",
            name: "Madrasah",
          },
        ],
      },
      {
        path: "/pengaturan/tanggal-rkam", // the url
        name: "Tanggal RKAM", // name that appear in Sidebar
      },
    ],
  },
  {
    icon: "FolderOutlined",
    name: "Referensi",
    routes: [
      // submenu
      {
        path: "/referensi/snp",
        name: "Program dan Kegiatan",
      },
      {
        path: "/referensi/tahun",
        name: "Tahun",
      },
      {
        path: "/referensi/jenis-belanja",
        name: "Jenis Belanja",
      },
      {
        path: "/referensi/kegiatan",
        name: "Kegiatan",
      },
      {
        path: "/referensi/komponen-biaya",
        name: "Komponen Biaya",
      },
      {
        path: "/referensi/madrasah",
        name: "Madrasah",
      },
      // {
      //   path: "/referensi/kode-registrasi",
      //   name: "Kode Registrasi",
      // },
    ],
  },
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "Laporan RKAKL",
          },
          {
            path: "/laporan/rkakl-konsolidasi-min",
            name: "Laporan RKAKL Konsolidasi Min",
          },
          {
            path: "/laporan/laporan-rapbm",
            name: "Laporan RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          {
            path: "/laporan/buku-kas-umum-konsolidasi-min",
            name: "Laporan BKU Konsolidasi Min",
          },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
  {
    path: "/komentar", // the url
    icon: "MessageOutlined", // the component being exported from icons/index.js
    name: "Komentar", // name that appear in Sidebar
  },
];

//PENGARAH KAB KOTA  //PERLU DIREVISI
export const pengarah_kabkota = [
  {
    path: "/dashboard", // the url
    icon: "HomeOutlined", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/edm", // the url
    icon: "EditOutlined", // the component being exported from icons/index.js
    name: "Evaluasi Diri Madrasah", // name that appear in Sidebar
  },
  {
    icon: "TeamOutlined",
    name: "Manajemen User",
    routes: [
      // submenu
      {
        path: "/manajemenuser/profile",
        name: "My Profile",
      },
      {
        path: "/manajemenuser/task",
        name: "My Task",
      },
    ],
  },
  {
    icon: "FolderOutlined",
    name: "Referensi",
    routes: [
      // submenu
      {
        path: "/referensi/kegiatan",
        name: "Kegiatan",
      },
      {
        path: "/referensi/jenis-belanja",
        name: "Jenis Belanja",
      },
      {
        path: "/referensi/komponen-biaya",
        name: "Komponen Biaya",
      },
      {
        path: "/referensi/madrasah",
        name: "Madrasah",
      },
    ],
  },
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "RKAKL",
          },
          {
            path: "/laporan/rkakl-konsolidasi-min",
            name: "RKAKL Konsolidasi Min",
          },
          {
            path: "/laporan/laporan-rapbm",
            name: "RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          {
            path: "/laporan/buku-kas-umum-konsolidasi-min",
            name: "Laporan BKU Konsolidasi Min",
          },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
  {
    icon: "SettingOutlined",
    name: "Pengaturan",
    routes: [
      {
        icon: "TeamOutlined",
        name: "Manajemen User",
        routes: [
          // submenu
          {
            path: "/pengaturan/management-user/kabkota",
            name: "Kankemenag",
          },
          {
            path: "/pengaturan/management-user/madrasah",
            name: "Madrasah",
          },
        ],
      },
    ],
  },
];

//AUDITOR KAB KOTA  //PERLU DIREVISI
export const auditor_kabkota_external = [
  {
    path: "/dashboard", // the url
    icon: "HomeOutlined", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/edm", // the url
    icon: "EditOutlined", // the component being exported from icons/index.js
    name: "Evaluasi Diri Madrasah", // name that appear in Sidebar
  },
  {
    icon: "SettingOutlined",
    name: "Pengaturan",
    routes: [
      {
        icon: "TeamOutlined",
        name: "Manajemen User",
        routes: [
          // submenu
          {
            path: "/pengaturan/management-user/kabkota",
            name: "Kankemenag",
          },
          {
            path: "/pengaturan/management-user/madrasah",
            name: "Madrasah",
          },
        ],
      },
    ],
  },
  {
    icon: "FolderOutlined",
    name: "Referensi",
    routes: [
      // submenu
      {
        path: "/referensi/kegiatan",
        name: "Kegiatan",
      },
      {
        path: "/referensi/jenis-belanja",
        name: "Jenis Belanja",
      },
      {
        path: "/referensi/komponen-biaya",
        name: "Komponen Biaya",
      },
      {
        path: "/referensi/madrasah",
        name: "Madrasah",
      },
    ],
  },
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "RKAKL",
          },
          {
            path: "/laporan/rkakl-konsolidasi-min",
            name: "RKAKL Konsolidasi Min",
          },
          {
            path: "/laporan/laporan-rapbm",
            name: "RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          {
            path: "/laporan/buku-kas-umum-konsolidasi-min",
            name: "Laporan BKU Konsolidasi Min",
          },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
];

//PENANGGUNG JAWAB UMUM  //PERLU DIREVISI
export const penanggung_jawab_umum_kabkota = [
  {
    path: "/dashboard", // the url
    icon: "HomeOutlined", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/edm", // the url
    icon: "EditOutlined", // the component being exported from icons/index.js
    name: "Evaluasi Diri Madrasah", // name that appear in Sidebar
  },
  {
    icon: "SettingOutlined",
    name: "Pengaturan",
    routes: [
      {
        icon: "TeamOutlined",
        name: "Manajemen User",
        routes: [
          // submenu
          {
            path: "/pengaturan/management-user/kabkota",
            name: "Kankemenag",
          },
          {
            path: "/pengaturan/management-user/madrasah",
            name: "Madrasah",
          },
        ],
      },
      // {
      //   path: "/pengaturan/ppk",
      //   name: "PPK",
      // },
    ],
  },
  {
    icon: "FolderOutlined",
    name: "Referensi",
    routes: [
      // submenu
      {
        path: "/referensi/kegiatan",
        name: "Kegiatan",
      },
      {
        path: "/referensi/jenis-belanja",
        name: "Jenis Belanja",
      },
      {
        path: "/referensi/komponen-biaya",
        name: "Komponen Biaya",
      },
      {
        path: "/referensi/madrasah",
        name: "Madrasah",
      },
    ],
  },
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "RKAKL",
          },
          {
            path: "/laporan/rkakl-konsolidasi-min",
            name: "RKAKL Konsolidasi Min",
          },
          {
            path: "/laporan/laporan-rapbm",
            name: "RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          {
            path: "/laporan/buku-kas-umum-konsolidasi-min",
            name: "Laporan BKU Konsolidasi Min",
          },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
];
//PENANGGUNG JAWAB TEKNIS  //PERLU DIREVISI
export const penanggung_jawab_teknis_kabkota = [
  {
    path: "/dashboard", // the url
    icon: "HomeOutlined", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/edm", // the url
    icon: "EditOutlined", // the component being exported from icons/index.js
    name: "Evaluasi Diri Madrasah", // name that appear in Sidebar
  },
  // {
  //   icon: "TeamOutlined",
  //   name: "Manajemen User",
  //   routes: [
  //     // submenu
  //     {
  //       path: "/manajemenuser/profile",
  //       name: "My Profile",
  //     },
  //     {
  //       path: "/manajemenuser/task",
  //       name: "My Task",
  //     },
  //   ],
  // },
  {
    icon: "FolderOutlined",
    name: "Referensi",
    routes: [
      // submenu
      {
        path: "/referensi/kegiatan",
        name: "Kegiatan",
      },
      {
        path: "/referensi/jenis-belanja",
        name: "Jenis Belanja",
      },
      {
        path: "/referensi/komponen-biaya",
        name: "Komponen Biaya",
      },
      {
        path: "/referensi/madrasah",
        name: "Madrasah",
      },
    ],
  },
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "RKAKL",
          },
          {
            path: "/laporan/rkakl-konsolidasi-min",
            name: "RKAKL Konsolidasi Min",
          },
          {
            path: "/laporan/laporan-rapbm",
            name: "RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          {
            path: "/laporan/buku-kas-umum-konsolidasi-min",
            name: "Laporan BKU Konsolidasi Min",
          },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
  {
    icon: "SettingOutlined",
    name: "Pengaturan",
    routes: [
      {
        icon: "TeamOutlined",
        name: "Manajemen User",
        routes: [
          // submenu
          {
            path: "/pengaturan/management-user/kabkota",
            name: "Kankemenag",
          },
          {
            path: "/pengaturan/management-user/madrasah",
            name: "Madrasah",
          },
        ],
      },
    ],
  },
];
//PEMBUAT KEBIJAKAN  //PERLU DIREVISI
export const pembuat_kebijakan_kabkota = [
  {
    path: "/dashboard", // the url
    icon: "HomeOutlined", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/edm", // the url
    icon: "EditOutlined", // the component being exported from icons/index.js
    name: "Evaluasi Diri Madrasah", // name that appear in Sidebar
  },
  // {
  //   icon: "TeamOutlined",
  //   name: "Manajemen User",
  //   routes: [
  //     // submenu
  //     {
  //       path: "/manajemenuser/profile",
  //       name: "My Profile",
  //     },
  //     {
  //       path: "/manajemenuser/task",
  //       name: "My Task",
  //     },
  //   ],
  // },
  {
    icon: "FolderOutlined",
    name: "Referensi",
    routes: [
      // submenu
      {
        path: "/referensi/kegiatan",
        name: "Kegiatan",
      },
      {
        path: "/referensi/jenis-belanja",
        name: "Jenis Belanja",
      },
      {
        path: "/referensi/komponen-biaya",
        name: "Komponen Biaya",
      },
      {
        path: "/referensi/madrasah",
        name: "Madrasah",
      },
    ],
  },
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "RKAKL",
          },
          {
            path: "/laporan/rkakl-konsolidasi-min",
            name: "RKAKL Konsolidasi Min",
          },
          {
            path: "/laporan/laporan-rapbm",
            name: "RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          {
            path: "/laporan/buku-kas-umum-konsolidasi-min",
            name: "Laporan BKU Konsolidasi Min",
          },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
  {
    icon: "SettingOutlined",
    name: "Pengaturan",
    routes: [
      {
        icon: "TeamOutlined",
        name: "Manajemen User",
        routes: [
          // submenu
          {
            path: "/pengaturan/management-user/kabkota",
            name: "Kankemenag",
          },
          {
            path: "/pengaturan/management-user/madrasah",
            name: "Madrasah",
          },
        ],
      },
    ],
  },
];

//AUDITOR KAB KOTA  //PERLU DIREVISI
export const auditor_kabkota = [
  {
    path: "/dashboard", // the url
    icon: "HomeOutlined", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/edm", // the url
    icon: "EditOutlined", // the component being exported from icons/index.js
    name: "Evaluasi Diri Madrasah", // name that appear in Sidebar
  },
  // {
  //   icon: "TeamOutlined",
  //   name: "Manajemen User",
  //   routes: [
  //     // submenu
  //     {
  //       path: "/manajemenuser/profile",
  //       name: "My Profile",
  //     },
  //     {
  //       path: "/manajemenuser/task",
  //       name: "My Task",
  //     },
  //   ],
  // },
  {
    icon: "FolderOutlined",
    name: "Referensi",
    routes: [
      // submenu
      {
        path: "/referensi/kegiatan",
        name: "Kegiatan",
      },
      {
        path: "/referensi/jenis-belanja",
        name: "Jenis Belanja",
      },
      {
        path: "/referensi/komponen-biaya",
        name: "Komponen Biaya",
      },
      {
        path: "/referensi/madrasah",
        name: "Madrasah",
      },
    ],
  },
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "RKAKL",
          },
          {
            path: "/laporan/rkakl-konsolidasi-min",
            name: "RKAKL Konsolidasi Min",
          },
          {
            path: "/laporan/laporan-rapbm",
            name: "RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          {
            path: "/laporan/buku-kas-umum-konsolidasi-min",
            name: "Laporan BKU Konsolidasi Min",
          },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
  {
    icon: "SettingOutlined",
    name: "Pengaturan",
    routes: [
      {
        icon: "TeamOutlined",
        name: "Manajemen User",
        routes: [
          // submenu
          {
            path: "/pengaturan/management-user/kabkota",
            name: "Kankemenag",
          },
          {
            path: "/pengaturan/management-user/madrasah",
            name: "Madrasah",
          },
        ],
      },
    ],
  },
];

//////////////////////////////PROVINSI////////////////////////////////
//ADMIN PROVISI
export const admin_provinsi = [
  {
    path: "/dashboard", // the url
    icon: "HomeOutlined", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/edm", // the url
    icon: "EditOutlined", // the component being exported from icons/index.js
    name: "Evaluasi Diri Madrasah", // name that appear in Sidebar
  },
  {
    icon: "SettingOutlined",
    name: "Pengaturan",
    routes: [
      {
        icon: "TeamOutlined",
        name: "Manajemen User",
        routes: [
          // submenu
          {
            path: "/pengaturan/management-user/prov",
            name: "Kanwil",
          },
          {
            path: "/pengaturan/management-user/kabkota",
            name: "Kankemenag",
          },
          {
            path: "/pengaturan/management-user/madrasah",
            name: "Madrasah",
          },
        ],
      },
    ],
  },
  {
    icon: "FolderOutlined",
    name: "Referensi",
    routes: [
      // submenu
      {
        path: "/referensi/snp",
        name: "Program dan Kegiatan",
      },
      {
        path: "/referensi/tahun",
        name: "Tahun",
      },
      {
        path: "/referensi/jenis-belanja",
        name: "Jenis Belanja",
      },
      {
        path: "/referensi/kegiatan",
        name: "Kegiatan",
      },
      {
        path: "/referensi/komponen-biaya",
        name: "Komponen Biaya",
      },
      {
        path: "/referensi/madrasah",
        name: "Madrasah",
      },
    ],
  },
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "RKAKL",
          },
          {
            path: "/laporan/rkakl-konsolidasi-min",
            name: "RKAKL Konsolidasi Min",
          },
          {
            path: "/laporan/laporan-rapbm",
            name: "RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          {
            path: "/laporan/buku-kas-umum-konsolidasi-min",
            name: "Laporan BKU Konsolidasi Min",
          },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },
      {
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
];

export const auditor_provinsi_external = [
  {
    path: "/dashboard", // the url
    icon: "HomeOutlined", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/edm", // the url
    icon: "EditOutlined", // the component being exported from icons/index.js
    name: "Evaluasi Diri Madrasah", // name that appear in Sidebar
  },
  {
    icon: "SettingOutlined",
    name: "Pengaturan",
    routes: [
      {
        icon: "TeamOutlined",
        name: "Manajemen User",
        routes: [
          // submenu
          {
            path: "/pengaturan/management-user/prov",
            name: "Kanwil",
          },
          {
            path: "/pengaturan/management-user/kabkota",
            name: "Kankemenag",
          },
          {
            path: "/pengaturan/management-user/madrasah",
            name: "Madrasah",
          },
        ],
      },
    ],
  },
  {
    icon: "FolderOutlined",
    name: "Referensi",
    routes: [
      // submenu
      {
        path: "/referensi/snp",
        name: "Program dan Kegiatan",
      },
      {
        path: "/referensi/tahun",
        name: "Tahun",
      },
      {
        path: "/referensi/jenis-belanja",
        name: "Jenis Belanja",
      },
      {
        path: "/referensi/kegiatan",
        name: "Kegiatan",
      },
      {
        path: "/referensi/komponen-biaya",
        name: "Komponen Biaya",
      },
      {
        path: "/referensi/madrasah",
        name: "Madrasah",
      },
    ],
  },
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "RKAKL",
          },
          {
            path: "/laporan/rkakl-konsolidasi-min",
            name: "RKAKL Konsolidasi Min",
          },
          {
            path: "/laporan/laporan-rapbm",
            name: "RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          {
            path: "/laporan/buku-kas-umum-konsolidasi-min",
            name: "Laporan BKU Konsolidasi Min",
          },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
];

//PENGARAH PROVINSI  //PERLU DIREVISI
export const pengarah_provinsi = [
  {
    path: "/dashboard", // the url
    icon: "HomeOutlined", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/edm", // the url
    icon: "EditOutlined", // the component being exported from icons/index.js
    name: "Evaluasi Diri Madrasah", // name that appear in Sidebar
  },
  // {
  //   icon: "TeamOutlined",
  //   name: "Manajemen User",
  //   routes: [
  //     // submenu
  //     {
  //       path: "/manajemenuser/profile",
  //       name: "My Profile",
  //     },
  //     {
  //       path: "/manajemenuser/task",
  //       name: "My Task",
  //     },
  //   ],
  // },
  {
    icon: "FolderOutlined",
    name: "Referensi",
    routes: [
      // submenu
      {
        path: "/referensi/kegiatan",
        name: "Kegiatan",
      },
      {
        path: "/referensi/jenis-belanja",
        name: "Jenis Belanja",
      },
      {
        path: "/referensi/komponen-biaya",
        name: "Komponen Biaya",
      },
      {
        path: "/referensi/madrasah",
        name: "Madrasah",
      },
    ],
  },
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "Laporan RKAKL",
          },
          {
            path: "/laporan/rkakl-konsolidasi-min",
            name: "Laporan RKAKL Konsolidasi Min",
          },
          {
            path: "/laporan/laporan-rapbm",
            name: "Laporan RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          {
            path: "/laporan/buku-kas-umum-konsolidasi-min",
            name: "Laporan BKU Konsolidasi Min",
          },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
  {
    icon: "SettingOutlined",
    name: "Pengaturan",
    routes: [
      {
        icon: "TeamOutlined",
        name: "Manajemen User",
        routes: [
          // submenu
          {
            path: "/pengaturan/management-user/prov",
            name: "Kanwil",
          },
          {
            path: "/pengaturan/management-user/kabkota",
            name: "Kankemenag",
          },
          {
            path: "/pengaturan/management-user/madrasah",
            name: "Madrasah",
          },
        ],
      },
    ],
  },
];

//PENANGGUNG JAWAB UMUM PROVINSI  //PERLU DIREVISI
export const penanggung_jawab_umum_provinsi = [
  {
    path: "/dashboard", // the url
    icon: "HomeOutlined", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/edm", // the url
    icon: "EditOutlined", // the component being exported from icons/index.js
    name: "Evaluasi Diri Madrasah", // name that appear in Sidebar
  },
  // {
  //   icon: "TeamOutlined",
  //   name: "Manajemen User",
  //   routes: [
  //     // submenu
  //     {
  //       path: "/manajemenuser/profile",
  //       name: "My Profile",
  //     },
  //     {
  //       path: "/manajemenuser/task",
  //       name: "My Task",
  //     },
  //   ],
  // },
  {
    icon: "FolderOutlined",
    name: "Referensi",
    routes: [
      // submenu
      {
        path: "/referensi/kegiatan",
        name: "Kegiatan",
      },
      {
        path: "/referensi/jenis-belanja",
        name: "Jenis Belanja",
      },
      {
        path: "/referensi/komponen-biaya",
        name: "Komponen Biaya",
      },
      {
        path: "/referensi/madrasah",
        name: "Madrasah",
      },
    ],
  },
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "RKAKL",
          },
          {
            path: "/laporan/rkakl-konsolidasi-min",
            name: "RKAKL Konsolidasi Min",
          },
          {
            path: "/laporan/laporan-rapbm",
            name: "RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          {
            path: "/laporan/buku-kas-umum-konsolidasi-min",
            name: "Laporan BKU Konsolidasi Min",
          },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
  {
    icon: "SettingOutlined",
    name: "Pengaturan",
    routes: [
      {
        icon: "TeamOutlined",
        name: "Manajemen User",
        routes: [
          // submenu
          {
            path: "/pengaturan/management-user/prov",
            name: "Kanwil",
          },
          {
            path: "/pengaturan/management-user/kabkota",
            name: "Kankemenag",
          },
          {
            path: "/pengaturan/management-user/madrasah",
            name: "Madrasah",
          },
        ],
      },
    ],
  },
];

//PENANGGUNG JAWAB TEKNIS PROVINSI  //PERLU DIREVISI
export const penanggung_jawab_teknis_provinsi = [
  {
    path: "/dashboard", // the url
    icon: "HomeOutlined", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/edm", // the url
    icon: "EditOutlined", // the component being exported from icons/index.js
    name: "Evaluasi Diri Madrasah", // name that appear in Sidebar
  },
  // {
  //   icon: "TeamOutlined",
  //   name: "Manajemen User",
  //   routes: [
  //     // submenu
  //     {
  //       path: "/manajemenuser/profile",
  //       name: "My Profile",
  //     },
  //     {
  //       path: "/manajemenuser/task",
  //       name: "My Task",
  //     },
  //   ],
  // },
  {
    icon: "FolderOutlined",
    name: "Referensi",
    routes: [
      // submenu
      {
        path: "/referensi/kegiatan",
        name: "Kegiatan",
      },
      {
        path: "/referensi/jenis-belanja",
        name: "Jenis Belanja",
      },
      {
        path: "/referensi/komponen-biaya",
        name: "Komponen Biaya",
      },
      {
        path: "/referensi/madrasah",
        name: "Madrasah",
      },
    ],
  },
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "RKAKL",
          },
          {
            path: "/laporan/rkakl-konsolidasi-min",
            name: "RKAKL Konsolidasi Min",
          },
          {
            path: "/laporan/laporan-rapbm",
            name: "RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          {
            path: "/laporan/buku-kas-umum-konsolidasi-min",
            name: "Laporan BKU Konsolidasi Min",
          },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
  {
    icon: "SettingOutlined",
    name: "Pengaturan",
    routes: [
      {
        icon: "TeamOutlined",
        name: "Manajemen User",
        routes: [
          // submenu
          {
            path: "/pengaturan/management-user/prov",
            name: "Kanwil",
          },
          {
            path: "/pengaturan/management-user/kabkota",
            name: "Kankemenag",
          },
          {
            path: "/pengaturan/management-user/madrasah",
            name: "Madrasah",
          },
        ],
      },
    ],
  },
];

//PEMBUAT KEBIJAKAN PROVINSI  //PERLU DIREVISI
export const pembuat_kebijakan_provinsi = [
  {
    path: "/dashboard", // the url
    icon: "HomeOutlined", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/edm", // the url
    icon: "EditOutlined", // the component being exported from icons/index.js
    name: "Evaluasi Diri Madrasah", // name that appear in Sidebar
  },
  {
    icon: "SettingOutlined",
    name: "Pengaturan",
    routes: [
      {
        icon: "TeamOutlined",
        name: "Manajemen User",
        routes: [
          // submenu
          {
            path: "/pengaturan/management-user/prov",
            name: "Kanwil",
          },
          {
            path: "/pengaturan/management-user/kabkota",
            name: "Kankemenag",
          },
          {
            path: "/pengaturan/management-user/madrasah",
            name: "Madrasah",
          },
        ],
      },
      {
        path: "/pengaturan/staff-madrasah",
        name: "Madrasah",
      },
      {
        path: "/pengaturan/rekening-bank",
        name: "Kankemenag",
      },
    ],
  },
  // {
  //   icon: "TeamOutlined",
  //   name: "Manajemen User",
  //   routes: [
  //     // submenu
  //     {
  //       path: "/manajemenuser/profile",
  //       name: "My Profile",
  //     },
  //     {
  //       path: "/manajemenuser/task",
  //       name: "My Task",
  //     },
  //   ],
  // },
  {
    icon: "FolderOutlined",
    name: "Referensi",
    routes: [
      // submenu
      {
        path: "/referensi/kegiatan",
        name: "Kegiatan",
      },
      {
        path: "/referensi/jenis-belanja",
        name: "Jenis Belanja",
      },
      {
        path: "/referensi/komponen-biaya",
        name: "Komponen Biaya",
      },
      {
        path: "/referensi/madrasah",
        name: "Madrasah",
      },
      // {
      //   path: "/referensi/kode-registrasi",
      //   name: "Kode Registrasi",
      // },
    ],
  },
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "RKAKL",
          },
          {
            path: "/laporan/rkakl-konsolidasi-min",
            name: "RKAKL Konsolidasi Min",
          },
          {
            path: "/laporan/laporan-rapbm",
            name: "RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          {
            path: "/laporan/buku-kas-umum-konsolidasi-min",
            name: "Laporan BKU Konsolidasi Min",
          },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
];

//AUDITOR PROVINSI  //PERLU DIREVISI
export const auditor_provinsi = [
  {
    path: "/dashboard", // the url
    icon: "HomeOutlined", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/edm", // the url
    icon: "EditOutlined", // the component being exported from icons/index.js
    name: "Evaluasi Diri Madrasah", // name that appear in Sidebar
  },
  // {
  //   icon: "TeamOutlined",
  //   name: "Manajemen User",
  //   routes: [
  //     // submenu
  //     {
  //       path: "/manajemenuser/profile",
  //       name: "My Profile",
  //     },
  //     {
  //       path: "/manajemenuser/task",
  //       name: "My Task",
  //     },
  //   ],
  // },
  {
    icon: "FolderOutlined",
    name: "Referensi",
    routes: [
      // submenu
      {
        path: "/referensi/kegiatan",
        name: "Kegiatan",
      },
      {
        path: "/referensi/jenis-belanja",
        name: "Jenis Belanja",
      },
      {
        path: "/referensi/komponen-biaya",
        name: "Komponen Biaya",
      },
      {
        path: "/referensi/madrasah",
        name: "Madrasah",
      },
    ],
  },
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "RKAKL",
          },
          {
            path: "/laporan/rkakl-konsolidasi-min",
            name: "RKAKL Konsolidasi Min",
          },
          {
            path: "/laporan/laporan-rapbm",
            name: "RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          {
            path: "/laporan/buku-kas-umum-konsolidasi-min",
            name: "Laporan BKU Konsolidasi Min",
          },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
  {
    icon: "SettingOutlined",
    name: "Pengaturan",
    routes: [
      {
        icon: "TeamOutlined",
        name: "Manajemen User",
        routes: [
          // submenu
          {
            path: "/pengaturan/management-user/prov",
            name: "Kanwil",
          },
          {
            path: "/pengaturan/management-user/kabkota",
            name: "Kankemenag",
          },
          {
            path: "/pengaturan/management-user/madrasah",
            name: "Madrasah",
          },
        ],
      },
    ],
  },
];

///////////////////////////////PUSAT//////////////////////////////////
//SUPER ADMIN PUSAT  //PERLU DI REVISI
export const super_admin_pusat = [
  {
    path: "/HomeOutlined", // the url
    icon: "HomeOutlined", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/edm", // the url
    icon: "EditOutlined", // the component being exported from icons/index.js
    name: "Evaluasi Diri Madrasah", // name that appear in Sidebar
  },
  {
    icon: "SettingOutlined",
    name: "Pengaturan",
    routes: [
      {
        icon: "TeamOutlined",
        name: "Manajemen User",
        routes: [
          // submenu
          {
            path: "/pengaturan/management-user/role",
            name: "Role",
          },
          {
            path: "/pengaturan/management-user/pusat",
            name: "Pusat",
          },
          {
            path: "/pengaturan/management-user/prov",
            name: "Kanwil",
          },
          {
            path: "/pengaturan/management-user/kabkota",
            name: "Kankemenag",
          },
          {
            path: "/pengaturan/management-user/madrasah",
            name: "Madrasah",
          },
        ],
      },
      // {
      //   path: "/pengaturan/rekening-bank",
      //   name: "Rekening Bank",
      // },
      {
        path: "/referensi/rekening-belanja",
        name: "Rekening Bank Madrasah",
      },
      // {
      //   path: "/pengaturan/penerima",
      //   name: "Penerima",
      // },
    ],
  },
  {
    icon: "FolderOutlined",
    name: "Referensi",
    routes: [
      // submenu
      {
        path: "/referensi/snp",
        name: "Program dan Kegiatan",
      },
      {
        path: "/referensi/tahun",
        name: "Tahun",
      },
      {
        path: "/referensi/jenis-belanja",
        name: "Jenis Belanja",
      },
      {
        path: "/referensi/komponen-biaya",
        name: "Komponen Biaya",
      },
      {
        path: "/referensi/kegiatan",
        name: "Kegiatan",
      },
      {
        path: "/referensi/sub-kegiatan",
        name: "Sub Kegiatan",
      },
      {
        path: "/referensi/kegiatan-bos",
        name: "Kegiatan BOS",
      },
      // {
      //   path: "/referensi/kegiatan-bop",
      //   name: "Kegiatan BOP",
      // },
      {
        path: "/referensi/sumber-dana-madrasah",
        name: "Sumber Dana Madrasah",
      },
      // {
      //   path: "/referensi/alokasi-bop",
      //   name: "Alokasi BOP",
      // },
      // {
      //   path: "/referensi/alokasi-bos",
      //   name: "Alokasi BOS",
      // },
    ],
  },

  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "RKAKL",
          },
          {
            path: "/laporan/rkakl-konsolidasi-min",
            name: "RKAKL Konsolidasi Min",
          },
          {
            path: "/laporan/laporan-rapbm",
            name: "RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          {
            path: "/laporan/buku-kas-umum-konsolidasi-min",
            name: "Laporan BKU Konsolidasi Min",
          },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
];
//ADMIN PUSAT
export const admin_pusat = [
  // {
  //   icon: "HomeOutlined", // the component being exported from icons/index.js
  //   name: "Dashboard", // name that appear in Sidebar
  //   path: "/dashboard", // the url
  //   routes: [
  //     {
  //       icon: "PieChartOutlined",
  //       name: "Pendapatan dan Kegiatan",
  //       path: "/dashboard/pendapatan-dan-kegiatan", // the url
  //     },
  //     {
  //       icon: "PieChartOutlined",
  //       name: "Pendapatan",
  //       path: "/dashboard/pendapatan", // the url
  //     },
  //     {
  //       icon: "PieChartOutlined",
  //       name: "Anggaran Kas Belanja",
  //       path: "/dashboard/kas-belanja", // the url
  //     },
  //   ],
  // },
  {
    path: "/dashboard", // the url
    icon: "HomeOutlined", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/edm", // the url
    icon: "EditOutlined", // the component being exported from icons/index.js
    name: "Evaluasi Diri Madrasah", // name that appear in Sidebar
  },
  {
    icon: "SettingOutlined",
    name: "Pengaturan",
    routes: [
      {
        icon: "TeamOutlined",
        name: "Manajemen User",
        routes: [
          // submenu
          {
            path: "/pengaturan/management-user/pusat",
            name: "Pusat",
          },
          {
            path: "/pengaturan/management-user/prov",
            name: "Kanwil",
          },
          {
            path: "/pengaturan/management-user/kabkota",
            name: "Kankemenag",
          },
          {
            path: "/pengaturan/management-user/madrasah",
            name: "Madrasah",
          },
        ],
      },
      // {
      //   path: "/pengaturan/rekening-bank",
      //   name: "Rekening Bank",
      // },
      {
        path: "/referensi/rekening-belanja",
        name: "Rekening Bank Madrasah",
      },
    ],
  },

  {
    icon: "FolderOutlined",
    name: "Referensi",
    routes: [
      // submenu
      {
        path: "/referensi/snp",
        name: "Program dan Kegiatan",
        acl: "admin_pusat",
        permissions: ["admin", "user"],
      },
      {
        path: "/referensi/tahun",
        name: "Tahun",
      },
      {
        path: "/referensi/jenis-belanja",
        name: "Jenis Belanja",
      },
      {
        path: "/referensi/komponen-biaya",
        name: "Komponen Biaya",
      },
      {
        path: "/referensi/kegiatan",
        name: "Kegiatan",
      },
      {
        path: "/referensi/sub-kegiatan",
        name: "Sub Kegiatan",
      },
      {
        path: "/referensi/kegiatan-bos",
        name: "Kegiatan BOS",
      },
      {
        path: "/referensi/satuan",
        name: "Satuan",
      },
      {
        path: "/referensi/pajak",
        name: "Pajak",
      },
      {
        path: "/referensi/sumber-dana-madrasah",
        name: "Sumber Dana Madrasah",
      },
      {
        path: "/referensi/madrasah",
        name: "Madrasah",
      },
    ],
  },
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "RKAKL",
          },
          {
            path: "/laporan/rkakl-konsolidasi-min",
            name: "RKAKL Konsolidasi Min",
          },
          {
            path: "/laporan/laporan-rapbm",
            name: "RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          {
            path: "/laporan/buku-kas-umum-konsolidasi-min",
            name: "Laporan BKU Konsolidasi Min",
          },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
];

//PENGARAH PUSAT  //PERLU DI REVISI
export const pengarah_pusat = [
  {
    path: "/dashboard", // the url
    icon: "HomeOutlined", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/edm", // the url
    icon: "EditOutlined", // the component being exported from icons/index.js
    name: "Evaluasi Diri Madrasah", // name that appear in Sidebar
  },
  {
    icon: "SettingOutlined",
    name: "Pengaturan",
    routes: [
      {
        icon: "TeamOutlined",
        name: "Manajemen User",
        routes: [
          // submenu
          {
            path: "/pengaturan/management-user/pusat",
            name: "Pusat",
          },
          {
            path: "/pengaturan/management-user/prov",
            name: "Kanwil",
          },
          {
            path: "/pengaturan/management-user/kabkota",
            name: "Kankemenag",
          },
          {
            path: "/pengaturan/management-user/madrasah",
            name: "Madrasah",
          },
        ],
      },
      {
        path: "/referensi/rekening-belanja",
        name: "Rekening Bank Madrasah",
      },
    ],
  },
  {
    icon: "FolderOutlined",
    name: "Referensi",
    routes: [
      // submenu
      {
        path: "/referensi/snp",
        name: "Program dan Kegiatan",
      },
      {
        path: "/referensi/tahun",
        name: "Tahun",
      },
      {
        path: "/referensi/komponen-biaya",
        name: "Komponen Biaya",
      },
      {
        path: "/referensi/kegiatan",
        name: "Kegiatan",
      },
      {
        path: "/referensi/sub-kegiatan",
        name: "Sub Kegiatan",
      },
      {
        path: "/referensi/kegiatan-bos",
        name: "Kegiatan BOS",
      },
      // {
      //   path: "/referensi/kegiatan-bop",
      //   name: "Kegiatan BOP",
      // },
      {
        path: "/referensi/sumber-dana-madrasah",
        name: "Sumber Dana Madrasah",
      },
      // {
      //   path: "/referensi/alokasi-bop",
      //   name: "Alokasi BOP",
      // },
      // {
      //   path: "/referensi/alokasi-bos",
      //   name: "Alokasi BOS",
      // },
    ],
  },
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "Laporan RKAKL",
          },
          {
            path: "/laporan/rkakl-konsolidasi-min",
            name: "Laporan RKAKL Konsolidasi Min",
          },
          {
            path: "/laporan/laporan-rapbm",
            name: "Laporan RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          {
            path: "/laporan/buku-kas-umum-konsolidasi-min",
            name: "Laporan BKU Konsolidasi Min",
          },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
];
//
export const auditor_pusat_external = [
  {
    path: "/dashboard", // the url
    icon: "HomeOutlined", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "Laporan RKAKL",
          },
          {
            path: "/laporan/rkakl-konsolidasi-min",
            name: "Laporan RKAKL Konsolidasi Min",
          },
          {
            path: "/laporan/laporan-rapbm",
            name: "Laporan RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          {
            path: "/laporan/buku-kas-umum-konsolidasi-min",
            name: "Laporan BKU Konsolidasi Min",
          },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
  {
    path: "/komentar", // the url
    icon: "MessageOutlined", // the component being exported from icons/index.js
    name: "Komentar", // name that appear in Sidebar
  },
];

//PENANGGUNG JAWAB UMUM PUSAT  //PERLU DI REVISI
export const penanggung_jawab_umum_pusat = [
  {
    path: "/dashboard", // the url
    icon: "HomeOutlined", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/edm", // the url
    icon: "EditOutlined", // the component being exported from icons/index.js
    name: "Evaluasi Diri Madrasah", // name that appear in Sidebar
  },
  {
    icon: "SettingOutlined",
    name: "Pengaturan",
    routes: [
      {
        icon: "TeamOutlined",
        name: "Manajemen User",
        routes: [
          // submenu
          {
            path: "/pengaturan/management-user/pusat",
            name: "Pusat",
          },
          {
            path: "/pengaturan/management-user/prov",
            name: "Kanwil",
          },
          {
            path: "/pengaturan/management-user/kabkota",
            name: "Kankemenag",
          },
          {
            path: "/pengaturan/management-user/madrasah",
            name: "Madrasah",
          },
        ],
      },
      {
        path: "/referensi/rekening-belanja",
        name: "Rekening Bank Madrasah",
      },
    ],
  },
  {
    icon: "FolderOutlined",
    name: "Referensi",
    routes: [
      // submenu
      {
        path: "/referensi/snp",
        name: "Program dan Kegiatan",
      },
      {
        path: "/referensi/tahun",
        name: "Tahun",
      },
      // {
      //   path: "/referensi/rekening-belanja",
      //   name: "Rekening Bank Madrasah",
      // },
      {
        path: "/referensi/komponen-biaya",
        name: "Komponen Biaya",
      },
      {
        path: "/referensi/kegiatan",
        name: "Kegiatan",
      },
      {
        path: "/referensi/sub-kegiatan",
        name: "Sub Kegiatan",
      },
      {
        path: "/referensi/kegiatan-bos",
        name: "Kegiatan BOS",
      },
      // {
      //   path: "/referensi/kegiatan-bop",
      //   name: "Kegiatan BOP",
      // },
      {
        path: "/referensi/sumber-dana-madrasah",
        name: "Sumber Dana Madrasah",
      },
      // {
      //   path: "/referensi/alokasi-bop",
      //   name: "Alokasi BOP",
      // },
      // {
      //   path: "/referensi/alokasi-bos",
      //   name: "Alokasi BOS",
      // },
    ],
  },
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "Laporan RKAKL",
          },
          {
            path: "/laporan/rkakl-konsolidasi-min",
            name: "Laporan RKAKL Konsolidasi Min",
          },
          {
            path: "/laporan/laporan-rapbm",
            name: "Laporan RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          {
            path: "/laporan/buku-kas-umum-konsolidasi-min",
            name: "Laporan BKU Konsolidasi Min",
          },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
];

//PENANGGUNG JAWAB TEKNIS PUSAT  //PERLU DI REVISI
export const penanggung_jawab_teknis_pusat = [
  {
    path: "/dashboard", // the url
    icon: "HomeOutlined", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/edm", // the url
    icon: "EditOutlined", // the component being exported from icons/index.js
    name: "Evaluasi Diri Madrasah", // name that appear in Sidebar
  },
  {
    icon: "SettingOutlined",
    name: "Pengaturan",
    routes: [
      {
        icon: "TeamOutlined",
        name: "Manajemen User",
        routes: [
          // submenu
          {
            path: "/pengaturan/management-user/pusat",
            name: "Pusat",
          },
          {
            path: "/pengaturan/management-user/prov",
            name: "Kanwil",
          },
          {
            path: "/pengaturan/management-user/kabkota",
            name: "Kankemenag",
          },
          {
            path: "/pengaturan/management-user/madrasah",
            name: "Madrasah",
          },
        ],
      },
      {
        path: "/pengaturan/rekening-bank",
        name: "Rekening Bank",
      },
      // {
      //   path: "/pengaturan/penerima",
      //   name: "Penerima",
      // },
    ],
  },
  {
    icon: "FolderOutlined",
    name: "Referensi",
    routes: [
      // submenu
      {
        path: "/referensi/snp",
        name: "Program dan Kegiatan",
      },
      {
        path: "/referensi/tahun",
        name: "Tahun",
      },
      {
        path: "/referensi/rekening-belanja",
        name: "Rekening Bank Madrasah",
      },
      {
        path: "/referensi/komponen-biaya",
        name: "Komponen Biaya",
      },
      {
        path: "/referensi/kegiatan",
        name: "Kegiatan",
      },
      {
        path: "/referensi/sub-kegiatan",
        name: "Sub Kegiatan",
      },
      {
        path: "/referensi/kegiatan-bos",
        name: "Kegiatan BOS",
      },
      // {
      //   path: "/referensi/kegiatan-bop",
      //   name: "Kegiatan BOP",
      // },
      {
        path: "/referensi/sumber-dana-madrasah",
        name: "Sumber Dana Madrasah",
      },
      // {
      //   path: "/referensi/alokasi-bop",
      //   name: "Alokasi BOP",
      // },
      // {
      //   path: "/referensi/alokasi-bos",
      //   name: "Alokasi BOS",
      // },
    ],
  },
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "Laporan RKAKL",
          },
          {
            path: "/laporan/rkakl-konsolidasi-min",
            name: "Laporan RKAKL Konsolidasi Min",
          },
          {
            path: "/laporan/laporan-rapbm",
            name: "Laporan RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          {
            path: "/laporan/buku-kas-umum-konsolidasi-min",
            name: "Laporan BKU Konsolidasi Min",
          },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
];

//PEMBUAT KEBIJAKAN PUSAT  //PERLU DI REVISI
export const pembuat_kebijakan_pusat = [
  {
    path: "/dashboard", // the url
    icon: "HomeOutlined", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "Laporan RKAKL",
          },
          {
            path: "/laporan/rkakl-konsolidasi-min",
            name: "Laporan RKAKL Konsolidasi Min",
          },
          {
            path: "/laporan/laporan-rapbm",
            name: "Laporan RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          {
            path: "/laporan/buku-kas-umum-konsolidasi-min",
            name: "Laporan BKU Konsolidasi Min",
          },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
];

//AUDITOR PUSAT  //PERLU DI REVISI
export const auditor_pusat = [
  {
    path: "/dashboard", // the url
    icon: "HomeOutlined", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/edm", // the url
    icon: "EditOutlined", // the component being exported from icons/index.js
    name: "Evaluasi Diri Madrasah", // name that appear in Sidebar
  },
  {
    icon: "SettingOutlined",
    name: "Pengaturan",
    routes: [
      {
        icon: "TeamOutlined",
        name: "Manajemen User",
        routes: [
          // submenu
          {
            path: "/pengaturan/management-user/pusat",
            name: "Pusat",
          },
          {
            path: "/pengaturan/management-user/prov",
            name: "Kanwil",
          },
          {
            path: "/pengaturan/management-user/kabkota",
            name: "Kankemenag",
          },
          {
            path: "/pengaturan/management-user/madrasah",
            name: "Madrasah",
          },
        ],
      },
      // {
      //   path: "/pengaturan/rekening-bank",
      //   name: "Rekening Bank",
      // },
      {
        path: "/referensi/rekening-belanja",
        name: "Rekening Bank Madrasah",
      },
      // {
      //   path: "/pengaturan/penerima",
      //   name: "Penerima",
      // },
    ],
  },
  {
    icon: "FolderOutlined",
    name: "Referensi",
    routes: [
      // submenu
      {
        path: "/referensi/snp",
        name: "Program dan Kegiatan",
      },
      {
        path: "/referensi/tahun",
        name: "Tahun",
      },
      {
        path: "/referensi/komponen-biaya",
        name: "Komponen Biaya",
      },
      {
        path: "/referensi/kegiatan",
        name: "Kegiatan",
      },
      {
        path: "/referensi/sub-kegiatan",
        name: "Sub Kegiatan",
      },
      {
        path: "/referensi/kegiatan-bos",
        name: "Kegiatan BOS",
      },
      // {
      //   path: "/referensi/kegiatan-bop",
      //   name: "Kegiatan BOP",
      // },
      {
        path: "/referensi/sumber-dana-madrasah",
        name: "Sumber Dana Madrasah",
      },
    ],
  },
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "Laporan RKAKL",
          },
          {
            path: "/laporan/rkakl-konsolidasi-min",
            name: "Laporan RKAKL Konsolidasi Min",
          },
          {
            path: "/laporan/laporan-rapbm",
            name: "Laporan RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          {
            path: "/laporan/buku-kas-umum-konsolidasi-min",
            name: "Laporan BKU Konsolidasi Min",
          },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
];

//PEMBUAT KEBIJAKAN   //PERLU DI REVISI
export const pembuat_kebijakan = [
  {
    path: "/dashboard", // the url
    icon: "HomeOutlined", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "Laporan RKAKL",
          },
          {
            path: "/laporan/rkakl-konsolidasi-min",
            name: "Laporan RKAKL Konsolidasi Min",
          },
          {
            path: "/laporan/laporan-rapbm",
            name: "Laporan RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          {
            path: "/laporan/buku-kas-umum-konsolidasi-min",
            name: "Laporan BKU Konsolidasi Min",
          },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
];

//Auditor   //PERLU DI REVISI
export const auditor_pusat_internal = [
  {
    path: "/dashboard", // the url
    icon: "HomeOutlined", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "Laporan RKAKL",
          },
          {
            path: "/laporan/rkakl-konsolidasi-min",
            name: "Laporan RKAKL Konsolidasi Min",
          },
          {
            path: "/laporan/laporan-rapbm",
            name: "Laporan RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          {
            path: "/laporan/buku-kas-umum-konsolidasi-min",
            name: "Laporan BKU Konsolidasi Min",
          },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
  {
    path: "/komentar", // the url
    icon: "MessageOutlined", // the component being exported from icons/index.js
    name: "Komentar", // name that appear in Sidebar
  },
];

//Pengawas   //PERLU DI REVISI
export const pengawas_pusat = [
  {
    icon: "FundOutlined",
    name: "Laporan",
    routes: [
      // submenu
      {
        // path: "/laporan/laporan-rkam",
        name: "Laporan Rencana",
        routes: [
          {
            path: "/laporan/laporan-rkam",
            name: "RKAM",
          },
          {
            path: "/laporan/laporan-rkakl",
            name: "Laporan RKAKL",
          },
          {
            path: "/laporan/rkakl-konsolidasi-min",
            name: "Laporan RKAKL Konsolidasi Min",
          },
          {
            path: "/laporan/laporan-rapbm",
            name: "Laporan RAPBM",
          },
          {
            path: "/laporan/apbm",
            name: "APBM",
          },
        ],
      },
      {
        name: "Laporan Penatausahaan",
        routes: [
          {
            path: "/laporan/buku-kas-umum",
            name: "Laporan BKU",
          },
          {
            path: "/laporan/buku-kas-umum-konsolidasi-min",
            name: "Laporan BKU Konsolidasi Min",
          },
          {
            path: "/laporan/buku-pembantu-pajak",
            name: "Laporan Pembantu Pajak",
          },
          {
            path: "/laporan/buku-pembantu-kas-tunai",
            name: "Laporan Pembantu Buku Kas Tunai",
          },
          {
            path: "/laporan/pertanggung-jawaban",
            name: "Laporan Pertanggung Jawaban",
          },
        ],
      },

      {
        // path: "/laporan/laporan-realisasi",
        name: "Laporan Realisasi",
        routes: [
          {
            path: "/laporan/laporan-keuangan-realisasi",
            name: "Laporan Keuangan Realisasi",
          },
          {
            path: "/laporan/output-kegiatan",
            name: "Laporan Output Kegiatan",
          },
        ],
      },
    ],
  },
  {
    path: "/komentar", // the url
    icon: "MessageOutlined", // the component being exported from icons/index.js
    name: "Komentar", // name that appear in Sidebar
  },
];
