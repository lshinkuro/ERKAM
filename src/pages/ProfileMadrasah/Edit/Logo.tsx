/** @format */

import React, { useState } from "react";
import { UploadIcon } from "../../../icons";
import { Typography, Button, Divider, Space } from "antd";
import ImageUploading, { ImageListType } from "react-images-uploading";

import { useHistory } from "react-router";
import { baseURL } from "../../../utils/api";
import notifAlert from "../../../components/NotifAlert";
import { useDispatch, useSelector } from "react-redux";
import { editLogoMadrasah } from "../../../services/v2/usermanservice/madrasahservices";
import { getProfile } from "../../../services/v2/usermanservice/profileservices";
import { setStore } from "../../../redux/actions";
const { Title } = Typography;
function Logo() {
  const route = useHistory();
  const dispatch = useDispatch();
  const store = useSelector((state: any) => state.store);
  const madrasah = store.profile.madrasah || [];
  const [images, setImages] = useState([]);
  const [file, setFile] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [disableBtnTambah, setDisableBtnTambah] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const maxNumber = 69;
  const onChange = (imageList: ImageListType) => {
    if (imageList.length !== 0) {
      setIsOpen(true);
      setImages(imageList as never[]);
      let photo: any = new FormData();
      photo.append("logo", imageList[0].file);
      setFile(photo);
      setDisableBtnTambah(false);
    } else {
      setIsOpen(false);
      setImages([]);
    }
  };

  const handleUploadPhoto = async () => {
    setIsLoading(true);
    try {
      let payload = {
        data: file,
        id: madrasah.id,
      };
      await editLogoMadrasah(payload);
      notifAlert({ type: "success", description: "Data Berhasil di simpan" });
      setTimeout(async () => {
        const profile = await getProfile();
        const dataProfile = { profile };
        dispatch(setStore(dataProfile));
      }, 100);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="p-4">
        <Title level={5}>Logo Madrasah</Title>
        <div id="empty-cover-art" className=" border-2 border-gray-500 p-5 ">
          <div className="py-4">
            {/** */}
            <ImageUploading
              multiple
              value={images}
              onChange={onChange}
              maxNumber={maxNumber}>
              {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
              }) => (
                // write your building UI
                <div className="upload__image-wrapper">
                  {isOpen ? (
                    imageList.map((image, index) => (
                      <div key={index} className="image-item">
                        <div className="mb-4">
                          <img src={image.dataURL} alt="" width="100" />
                        </div>
                        <Space>
                          <Button
                            type="primary"
                            onClick={() => {
                              setDisableBtnTambah(true);
                              onImageUpdate(index);
                            }}>
                            Ganti
                          </Button>
                          <Button
                            danger
                            onClick={() => {
                              onImageRemove(index);
                              setDisableBtnTambah(true);
                            }}>
                            Hapus
                          </Button>
                        </Space>
                      </div>
                    ))
                  ) : madrasah.logo ? (
                    <div className="image-item">
                      <div className="mb-4">
                        <img
                          src={
                            `${baseURL}/v2/user-services/logo/` + madrasah.logo
                          }
                          alt=""
                          width="100"
                        />
                      </div>
                      <div className="image-item__btn-wrapper flex justify-center">
                        <Button type="primary" onClick={() => onImageUpdate(0)}>
                          Ganti
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="mb-4">
                        <UploadIcon
                          className="w-full"
                          style={isDragging ? { color: "red" } : undefined}
                          onClick={onImageUpload}
                          {...dragProps}
                        />
                      </div>
                      <Button
                        type="primary"
                        shape="round"
                        style={isDragging ? { color: "red" } : undefined}
                        onClick={onImageUpload}
                        {...dragProps}>
                        Upload Photo
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </ImageUploading>
            {/** */}
          </div>
        </div>
        <Divider />
        <Space className="">
          <Button
            onClick={() => {
              route.push("/profile-madrasah");
            }}>
            Batal
          </Button>
          <Button
            type="primary"
            onClick={handleUploadPhoto}
            disabled={disableBtnTambah}
            loading={isLoading}>
            Simpan
          </Button>
        </Space>
      </div>
    </>
  );
}

export default Logo;
