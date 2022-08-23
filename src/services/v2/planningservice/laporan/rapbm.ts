import api from '../../../../utils/api';
import { planningService } from '../../constant';

const basePathPlanning = `${planningService}`;

interface IParams {
  tahun: string,
  madrasahId: string
}

export const browse = async ({ tahun, madrasahId }: IParams): Promise<any> => {
  try {
    const response = await api.get(
      `${basePathPlanning}/laporan-rapbm-rekap?tahun=${tahun}&madrasahId=${madrasahId}`
    );
    return response.data.return;
  } catch(e){
    console.log("e ", e)
    return {}
  }
};