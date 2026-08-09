import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../ui/shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setSingleCompany } from '@/redux/companySlice';

export const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState();
    const dispatch = useDispatch();

    const registerNewCompany = async () => {
        try {
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, {companyName}, {
                headers:{
                    'Content-Type' : 'application/json'
                },
                withCredentials:true
            });
            if(res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId= res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
            
            
        }
    }
  return (
    <div>
        <Navbar/>
        <div className='max-w-4xl mx-auto'>
            <div className='my-10'>
                <h1 className='font-bold text-2xl'>Your Company Name</h1>
                <p>what would you like to give your company name? you can change this later</p>
            </div>
            <Label>Company Name</Label>
            <Input type="text" className="my-2" placeholder="IBM, Microsoft etc." onChange={(e)=> setCompanyName(e.target.value)}>
            </Input>
            <div className='flex items-center gap-2 my-10'>
                <Button  className="border border-gray-300 text-black hover:bg-gray-100 rounded-full px-4 py-2" onClick={()=> navigate("/admin/companies")}>Cancel</Button>
                <Button onClick={registerNewCompany} className="bg-[#202020] hover:bg-[#313131] text-white rounded-full px-4 py-2">Continue</Button>
            </div>

        </div>
    </div>
  )
}
export default CompanyCreate