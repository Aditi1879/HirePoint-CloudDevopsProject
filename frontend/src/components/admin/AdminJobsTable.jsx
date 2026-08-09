import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


export const AdminJobsTable = () => {
    const {allAdminJobs, SearchJobByText} = useSelector(store=>store.job);
    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();

    useEffect(()=> {
        console.log('called');
        const filteredJobs = allAdminJobs.filter((job)=>{
            if(!SearchJobByText){
                return true;
            };
            return job?.title?.toLowerCase().includes(SearchJobByText.toLowerCase()) || job?.company?.name.toLowerCase().includes(SearchJobByText.toLowerCase());

        });
        setFilterJobs(filteredJobs);

    },[allAdminJobs,SearchJobByText])
    return (
        <div>
            <Table>
                <TableCaption>A list of recent posted jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterJobs?.map((job) => (
                            <tr>
                                    <TableCell>{job?.company?.name}</TableCell>
                                    <TableCell>{job?.title}</TableCell>
                                    <TableCell>{job?.createdAt.split("T")[0]}</TableCell>
                                    <TableCell className="text-right cursor-pointer">
                                        <Popover>
                                            <PopoverTrigger><MoreHorizontal></MoreHorizontal></PopoverTrigger>
                                            <PopoverContent className="w-22 bg-white">
                                                <div onClick={()=> navigate(`/admin/companies/${job._id}`)} className='flex items-center gap-2 w-fit cursor-pointer'>
                                                    <Edit2 className='w-4 bg-white' />
                                                    <span>Edit</span>
                                                </div>
                                                <div onClick={()=> navigate(`/admin/jobs/${job._id}/applicants`)} className='flex items-center w-fit gap-2 cursor-pointer mt-2 bg-white'>
                                                    <Eye className='w-4 bg-white'></Eye>
                                                    <span>Applicants</span>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                            </tr>
                ))
                        
                    }

            </TableBody>
        </Table>
        </div >
    )
}
export default AdminJobsTable
