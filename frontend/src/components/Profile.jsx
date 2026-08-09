import React, { useState } from 'react';
import Navbar from './ui/shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import { UpdateProfileDialog } from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import store from '@/redux/store';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';

//const skills = ["Html", "css", "Javascript", "Reactjs"];
const isResume = true;

export const Profile = () => {
  useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const {user} = useSelector(store => store.auth);
  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.profile?.profilePhoto}></AvatarImage>
            </Avatar>
            <div>
              <h1 className="text-md font-bold">{user?.fullname}</h1>
              <p>{user?.profile?.bio}</p>
            </div>
          </div>
          <Button onClick={()=> setOpen(true)} className="text-right border border-gray-300 rounded-md">
            <Pen />
          </Button>
        </div>
        <div className="my-5">
          <div className="flex items-center gap-3 my-2">
            <Mail />
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center gap-3 my-2">
            <Contact />
            <span>{user?.phoneNumber}</span>
          </div>
        </div>
        <div className="my-5">
          <h1 className="text-md font-bold mb-3">Skills</h1>
          <div className="flex items-center gap-2 flex-wrap">
            {
            user?.profile?.skills.length !== 0 ? (
              user?.profile?.skills.map((item, index) => (
                <Badge
                  key={index}
                  className="bg-[#5931a0] text-white rounded-full px-3 py-1 transition-colors duration-300 hover:bg-[#432477]"
                >
                  {item}
                </Badge>
              ))
            ) : (
              <span>NA</span>
            )}
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="text-md font-bold">Resume</Label>
          {
          isResume ? (
            <a
              target="blank"
              href={user?.profile?.resume}
              className="text-blue-500 w-full hover:underline cursor-pointer"
            >
              {user?.profile?.resumeOriginalName}
            </a>
          ) : (
            <span>NA</span>
          )}
        </div>
      </div>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl">
        <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
        <AppliedJobTable />
      </div>
      <UpdateProfileDialog open={open} setOpen={setOpen}/>
    </div>
  );
};

export default Profile;
