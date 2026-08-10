import { setCompanies } from '@/redux/companySlice';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const useGetAllCompanies = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const url = `${COMPANY_API_END_POINT}/get?refresh=${Date.now()}`;

                console.log("COMPANY API REQUEST:", url);

                const res = await axios.get(url, {
                    withCredentials: true,
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                });

                console.log("COMPANY API RESPONSE:", res.data);
                console.log("COMPANIES RECEIVED:", res.data.companies);

                if (res.data.success) {
                    dispatch(setCompanies(res.data.companies));
                }
            } catch (error) {
                console.log("COMPANY API ERROR:", error);
                console.log("ERROR RESPONSE:", error.response?.data);
            }
        };

        fetchCompanies();
    }, [dispatch]);
};

export default useGetAllCompanies;