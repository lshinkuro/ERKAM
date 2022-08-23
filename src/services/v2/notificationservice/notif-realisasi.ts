import { Stomp } from "@stomp/stompjs";
import { notificationService } from "../constant"
import api from "../../../utils/api";

const basePath = `${notificationService}`;

const url = "wss://localhost:3000/api/v2/message-broker-services/socket"
const client = Stomp.client(url)
const topicRealisasi = "/message"

const connect_callback = function() {
  console.log(`${new Date()} - WS on Realisasi Just Connected...`)
  client.subscribe(topicRealisasi, realisasi_callback)
}

const realisasi_callback = async (message) => {
  if (message.body) {
    const msg = JSON.parse(message.body)
    if(msg.notificationPage === "PINDAH_BUKU"){
      console.log("PINDAH_BUKU message" + message.body)
      // Insert To DB Via API
      try{
        await api.post(`${basePath}/notification`, msg)
        let currentNotif = JSON.parse(localStorage.getItem("notification") || "")
        currentNotif.push(msg)
        localStorage.setItem('notification', JSON.stringify(currentNotif))
      }catch(err){
        console.log("ERROR POST NOTIF TO SERVICE", err)
      }
    }
  } else {
    console.log("got empty message");
  }
}

export const NotifRealisasi = async () => {
  await client.connect("", "", connect_callback)
  client.reconnect_delay = 5000
}

