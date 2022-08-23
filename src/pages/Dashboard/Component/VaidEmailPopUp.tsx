import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Input
} from "@windmill/react-ui";
import {
  Button
} from "rsuite";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { useHistory } from "react-router-dom";
import * as uService from "../../../services/users";
import {emailVerify, gantiEmail} from "../../../services/v2/usermanservice/validemail";

type PageHeaderProps = {
  isOpen: boolean;
};

const ValidEmailPopUp : React.FC<PageHeaderProps> = ({
  isOpen
})  => {
  const notifDelay = 3000;
  const settingNotif: any = {
    position: "top-right",
    autoClose: notifDelay,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
  const [email, setEmail] = React.useState<any>("");
  const [emailBaru, setEmailBaru] = React.useState<any>("");
  const [btnLoading, setBtnLoading] = React.useState<any>(false);
  const [openTab, setOpenTab] = React.useState(1);
  const [uuid, setUUID] = React.useState('');

  const route = useHistory();

  React.useEffect(() => {
    const tmpAuth: any = JSON.parse(localStorage.getItem("auth")!) || [];
    // console.log(tmpAuth);
    setEmail(tmpAuth.profile.user.email);
    setEmailBaru(tmpAuth.profile.user.email);
    setUUID(tmpAuth.role_user_id);
  }, []);


  const logOut = async () => {
    setBtnLoading(true);
    try {
      await uService.deletUser();
      setBtnLoading(true);
      localStorage.clear();
      route.push("/login");
    } catch {
      console.log("err");
      setBtnLoading(false);
    }
  };

  const cekEmailFormat = (inputToCheck) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(inputToCheck).toLowerCase());
  }

  const verifyEmail = async () => {
    setBtnLoading(true);
    emailVerify().then(data => {
      toast.success('Berhasil Kirim LInk Verifikasi Email', settingNotif);
    }).catch( (error) => {toast.error(error.response.data.error ? error.response.data.error : error.response.data.return, settingNotif);});
    // setBtnLoading(false);
  }

  const emailGanti = async () => {
    setBtnLoading(true);
    const params = {
      email: emailBaru,
      id: uuid
    }
    gantiEmail(uuid, params).then(data => {
      setEmail(emailBaru);
      emailVerify().then(data => {
        toast.success('Berhasil Ubah Email &amp; Kirim Link Verifikasi Email', settingNotif);
      }).catch( (error) => {toast.error(error.response.data.error ? error.response.data.error : error.response.data.return, settingNotif);});
    }).catch( (error) => {
      toast.error(error.response.data.error ? error.response.data.error : error.response.data.return, settingNotif); 
    });
    // setBtnLoading(false);
  }

  return(
    <>
    <ToastContainer
      position="top-right"
      autoClose={notifDelay}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    <Modal isOpen={isOpen} onClose={() => {}}>
      <ModalHeader>
        Verifikasi Email
      </ModalHeader>
      <ModalBody>
        <ul className="flex mb-0 list-none pt-3 pb-4 " role="tablist">
          <li className="-mb-px mr-2 last:mr-0 text-center ">
            <a
              href={'#status'}
              className={
                "text-sm font-bold hover:no-underline px-5 py-3 block leading-normal transition duration-500 ease-in-out " +
                (openTab === 1
                  ? "text-blue-600 border-b-2 hover:text-blue-500 border-indigo-200 "
                  : "text-gray-400 bg-white hover:text-blue-500")
              }
              onClick={(e) => {
                e.preventDefault();
                setOpenTab(1);
              }}
              data-toggle="tab"
              role="tablist"
            >
              Status
            </a>
          </li>
          <li className="-mb-px mr-2 last:mr-0 text-center w-25">
            <a
              href={'#ganti-email'}
              className={
                "text-sm font-bold hover:no-underline px-5 py-3 block leading-normal transition duration-500 ease-in-out " +
                (openTab === 2
                  ? "text-blue-600 hover:text-blue-500 border-b-2 border-indigo-200"
                  : "text-gray-400 bg-white hover:text-blue-500")
              }
              onClick={(e) => {
                e.preventDefault();
                setOpenTab(2);
              }}
              data-toggle="tab"
              role="tablist"
            >
              Ganti Email
            </a>
          </li>
        </ul>
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
					<div className="px-4 py-5 flex-auto">
						<div className="tab-content tab-space">
							<div className={openTab === 1 ? "block" : "hidden"} id="link1">
                <p>
                  <strong>Email :</strong> {email}
                  <br />
                  <br />
                </p>
                <p>
                  <strong>Status Verifikasi :</strong> Belum Valid
                </p>
                <br />
                <Button 
                  className="square-button"
                  onClick={() => {verifyEmail()}} 
                  color="blue" 
                  // loading={btnLoading}
                  disabled={btnLoading}>
                    Kirim Link Verifikasi
                </Button>
              </div>
              <div className={openTab === 2 ? "block" : "hidden"} id="link2">
              <Label className="mb-2">
                {" "}
                <div>
                  Email Baru <span className="text-red-500">*</span>
                </div>
                <Input
                  onChange={(e) => { setEmailBaru(e.currentTarget.value) }}
                  defaultValue={emailBaru}
                  className="mt-1"
                  placeholder="Silakan Isi Nilai Pendapatan"
                  valid={cekEmailFormat(emailBaru) ? true : false}
                />
              </Label>
              <Button 
                className="square-button"
                onClick={() => {emailGanti()}} 
                color="blue" 
                // loading={btnLoading}
                disabled={btnLoading}>
                  Kirim Link untuk Email Baru
              </Button>
              </div>
            </div>
          </div>
        </div> 
      </ModalBody>
      <ModalFooter>
        <Button 
          className="square-button"
          onClick={() => {logOut()}} 
          color="red" >
            Logout
        </Button>
      </ModalFooter>
    </Modal>
    </>
  );
}

export default ValidEmailPopUp;