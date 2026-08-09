import React, { useState } from 'react'
import Navbar from '../ui/shared/Navbar'
import { Label } from '@radix-ui/react-label'
import { Input } from '../ui/input'
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { Select, SelectContent, SelectGroup, SelectItem, SelectValue } from '../ui/select';
import { SelectTrigger } from '@radix-ui/react-select';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';


const companyArray = [];
export const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { companies } = useSelector(store => store.company);
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };
    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company) => company.name.toLowerCase() == value);
        setInput({...input, companyId: selectedCompany._id});
    };
    const submitHandler = async (e) => {
        e.preventDefault();
        console.log(input);
        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if(res.data.success){
                toast.success(res.data.message);
                navigate("/admin/jobs");

            }
        } catch (error) {
            toast.error(error.response.data.message);
            
        } finally{
            setLoading(false);
        }
    }
    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-5'>
                <form onSubmit={submitHandler}className='p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md'>


                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <Label>Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1">
                            </Input>
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1">
                            </Input>
                        </div>
                        <div>
                            <Label>Requirements</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1">
                            </Input>
                        </div>
                        <div>
                            <Label>Salary</Label>
                            <Input
                                type="text"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1">
                            </Input>
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1">
                            </Input>
                        </div>
                        <div>
                            <Label>Job Type</Label>
                            <Input
                                type="text"
                                name="jobType"
                                value={input.jobType}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1">
                            </Input>
                        </div>
                        <div>
                            <Label>Experience Level</Label>
                            <Input
                                type="text"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1">
                            </Input>
                        </div>
                        <div>
                            <Label>Number of Positions</Label>
                            <Input
                                type="number"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1">
                            </Input>
                        </div>
                        {
                            companies.length > 0 && (
                                <Select onValueChange={selectChangeHandler}>
                                    <SelectTrigger className="w-[180px] border border-gray-300 rounded-md flex items-center justify-between px-3 focus:ring focus:ring-gray-400 focus:border-gray-400">
                                        <SelectValue placeholder="Select a company" />
                                        {/* Dropdown arrow */}
                                        <span className="text-gray-500">▼</span>
                                    </SelectTrigger>
                                    <SelectContent className="bg-white text-black shadow-md rounded-lg">
                                        <SelectGroup>
                                            {
                                                companies.map((company)=>{
                                                    return(
                                                        <SelectItem  className="flex items-center gap-2" value={company?.name?.toLowerCase()}>{company.name}</SelectItem>
                                                    )
                                                })
                                            }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>



                            )
                        }
                    </div>{

                loading ? <Button className="w-full my-4 bg-[#202020] text-white hover:bg-[#313131]
                 focus:outline-none"><Loader2 className='mr-2 h-4 w-4 animate-spin'></Loader2>Please Wait</Button> : <Button type="submit" 
                 className="w-full my-4 bg-[#202020]
                text-white py-2 rounded-md hover:bg-[#313131]
                 focus:outline-none">Post New Job
                 </Button>
}
                 {
                        companies.length == 0 && <p className='text-xs text-red-600 font-bold text-center my-3'>*Please register a company first, before posting a job </p>
                    }
                </form>




            </div>
        </div>
    )
}
export default PostJob