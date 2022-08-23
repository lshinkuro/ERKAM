import api from "../../../../utils/api";
import { planningService } from "../../constant"

const basePathPlanning = `${planningService}`;

export const browse = async (tahun: string, madrasahId: string): Promise<any> => {
  try {
    const response = await api.get(
      `${basePathPlanning}/laporan-erkam?tahun=${tahun}&madrasahId=${madrasahId}`
    );
    return response.data.return;
  } catch(e){
    console.log("e ", e)
    return {}
  }
};