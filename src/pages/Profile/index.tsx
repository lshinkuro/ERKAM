/** @format */

import React from "react";
import { BreadCrumb } from "../../components";
import { useHistory } from "react-router";
import { Row, Col, Card, Avatar, Divider, Button, Typography } from "antd";
import {
  UserOutlined,
  MailOutlined,
  AimOutlined,
  EditOutlined,
} from "@ant-design/icons";
import eRKAMlogo from "../../assets/img/user.jpg";
import { baseURL } from "../../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { getReferenceAll } from "../../services/v2/referenceservice";
import { setStore } from "../../redux/actions";

const { Text } = Typography;

const Profile = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/profil", breadcrumbName: "Profil" },
    { path: "/profil/akun", breadcrumbName: "Akun" },
  ];
  const route = useHistory();
  const dispatch = useDispatch();
  const store = useSelector((state: any) => state.store);
  const profile: any = store.profile || [];
  const provinsi: any = store.provinsi || [];
  const kabkota: any = store.kabkota || [];
  const kecamatan: any = store.kecamatan || [];
  // const kelurahan: any = store.kelurahan || [];
  const [refKelurahan, setRefKelurahan] = React.useState<any>([]);

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
  }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Profil Akun" />
      <div className="p-5 mb-1">
        <Row gutter={[16, 16]}>
          <Col
            className="gutter-row"
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 8 }}
            lg={{ span: 8 }}
            xl={{ span: 8 }}>
            <Card className="default w-full" title="">
              <div className="flex flex-col items-center justify-center">
                <div className="mb-1">
                  <Avatar
                    size={{
                      xs: 150,
                      sm: 150,
                      md: 150,
                      lg: 150,
                      xl: 150,
                      xxl: 150,
                    }}
                    src={
                      profile?.profile?.avatar !== null
                        ? `${baseURL}/api/v2/user-services/logo/` +
                          profile?.profile?.avatar
                        : eRKAMlogo
                    }
                  />
                </div>

                <Text strong>{profile?.profile?.nama}</Text>
                <div className="mb-2">{profile?.nama_role}</div>
              </div>
              <div className="mb-1 flex items-center">
                <UserOutlined className="mr-2" /> {profile?.profile?.nik}
              </div>
              <div className="mb-1 flex items-center overflow-ellipsis overflow-hidden ">
                <MailOutlined className="mr-2" /> {profile?.profile?.user.email}
              </div>
              <div className="mb-1 flex items-center overflow-ellipsis overflow-hidden">
                <AimOutlined className="mr-2" />
                {profile?.profile?.kode_provinsi
                  ? provinsi?.length &&
                    provinsi
                      .filter(
                        (e: any) => e.kode === profile?.profile?.kode_provinsi,
                      )
                      .map((e: any) => e.nama)
                  : "-"}
                ,
                {profile?.profile?.kode_kabkota
                  ? kabkota?.length &&
                    kabkota
                      .filter(
                        (e: any) => e.kode === profile?.profile?.kode_kabkota,
                      )
                      .map((e: any) => e.nama)
                  : "-"}
              </div>
              <Divider />
              <Button
                type="primary"
                onClick={() => route.push("/profil/edit")}
                block>
                <EditOutlined /> Edit Profil
              </Button>
            </Card>
          </Col>
          <Col
            className="gutter-row"
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 16 }}
            lg={{ span: 16 }}
            xl={{ span: 16 }}>
            <Card className="default w-full" title="Profil">
              <Row gutter={[16, 16]}>
                <Col
                  xs={{ span: 12 }}
                  sm={{ span: 12 }}
                  md={{ span: 8 }}
                  xl={{ span: 8 }}>
                  <Text strong>Nama:</Text>
                  <p>{profile?.profile?.nama}</p>
                </Col>

                <Col
                  xs={{ span: 12 }}
                  sm={{ span: 12 }}
                  md={{ span: 8 }}
                  xl={{ span: 8 }}>
                  <Text strong>NIK:</Text>
                  <p>{profile?.profile?.nik}</p>
                </Col>

                <Col
                  xs={{ span: 12 }}
                  sm={{ span: 12 }}
                  md={{ span: 8 }}
                  xl={{ span: 8 }}>
                  <Text strong>Email:</Text>
                  <p className="overflow-ellipsis overflow-hidden">
                    {profile?.profile?.user.email}
                  </p>
                </Col>

                <Col
                  xs={{ span: 12 }}
                  sm={{ span: 12 }}
                  md={{ span: 8 }}
                  xl={{ span: 8 }}>
                  <Text strong>Provinsi:</Text>
                  <p>
                    {profile?.profile?.kode_provinsi
                      ? provinsi?.length &&
                        provinsi
                          .filter(
                            (e: any) =>
                              e.kode === profile?.profile?.kode_provinsi,
                          )
                          .map((e: any) => e.nama)
                      : ""}
                  </p>
                </Col>
                <Col
                  xs={{ span: 12 }}
                  sm={{ span: 12 }}
                  md={{ span: 8 }}
                  xl={{ span: 8 }}>
                  <Text strong>Kabupaten/Kota:</Text>
                  <p>
                    {profile?.profile?.kode_kabkota
                      ? kabkota?.length &&
                        kabkota
                          .filter(
                            (e: any) =>
                              e.kode === profile?.profile?.kode_kabkota,
                          )
                          .map((e: any) => e.nama)
                      : ""}
                  </p>
                </Col>

                <Col
                  xs={{ span: 12 }}
                  sm={{ span: 12 }}
                  md={{ span: 8 }}
                  xl={{ span: 8 }}>
                  <Text strong>Kecamatan:</Text>
                  <p>
                    {profile?.profile?.kode_kecamatan
                      ? kecamatan?.length &&
                        kecamatan
                          .filter(
                            (e: any) =>
                              e.kode === profile?.profile?.kode_kecamatan,
                          )
                          .map((e: any) => e.nama)
                      : ""}
                  </p>
                </Col>

                <Col
                  xs={{ span: 12 }}
                  sm={{ span: 12 }}
                  md={{ span: 8 }}
                  xl={{ span: 8 }}>
                  <Text strong>Kelurahan/Desa:</Text>
                  <p>
                    {profile?.profile?.kode_kelurahan
                      ? refKelurahan?.length &&
                        refKelurahan
                          .filter(
                            (e: any) =>
                              e.kode === profile?.profile?.kode_kelurahan,
                          )
                          .map((e: any) => e.nama)
                      : ""}
                  </p>
                </Col>

                <Col
                  xs={{ span: 12 }}
                  sm={{ span: 12 }}
                  md={{ span: 8 }}
                  xl={{ span: 8 }}>
                  <Text strong>RT:</Text>
                  <p>{profile?.profile?.rt}</p>
                </Col>

                <Col
                  xs={{ span: 12 }}
                  sm={{ span: 12 }}
                  md={{ span: 8 }}
                  xl={{ span: 8 }}>
                  <Text strong>RW:</Text>
                  <p>{profile?.profile?.rw}</p>
                </Col>

                <Col
                  xs={{ span: 12 }}
                  sm={{ span: 12 }}
                  md={{ span: 12 }}
                  xl={{ span: 12 }}>
                  <Text strong>Alamat Jalan:</Text>
                  <p>{profile?.profile?.alamat_jalan}</p>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default Profile;
