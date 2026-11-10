
import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '../ui/table';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import store from '@/redux/store';
import { toast } from 'sonner';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';

const shortlistingStatus = ["Accepted", "Rejected"];

export const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const [downloadingId, setDownloadingId] = useState(null);

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;

            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/status/${id}/update`,
                { status }
            );

            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                'Unable to update application status.'
            );
        }
    };

    const handleResumeDownload = async (applicationId) => {
        let resumeWindow = null;

        try {
            setDownloadingId(applicationId);

            // Open a blank tab immediately to avoid popup blocking.
            resumeWindow = window.open('', '_blank');

            if (!resumeWindow) {
                toast.error(
                    'Please allow pop-ups in your browser to download resumes.'
                );
                return;
            }

            const res = await axios.get(
                `${APPLICATION_API_END_POINT}/resume/${applicationId}`,
                { withCredentials: true }
            );

            if (!res.data.success || !res.data.downloadUrl) {
                throw new Error('Unable to generate resume download link.');
            }

            resumeWindow.location.href = res.data.downloadUrl;

        } catch (error) {
            if (resumeWindow && !resumeWindow.closed) {
                resumeWindow.close();
            }

            console.error('Applicant resume download error:', error);

            toast.error(
                error.response?.data?.message ||
                'Unable to download this resume. Please try again.'
            );
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <div>
            <Table>
                <TableCaption>
                    A list of your recent applied users
                </TableCaption>

                <TableHeader>
                    <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="float-right cursor-pointer">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {applicants?.applications?.map((item) => (
                        <TableRow key={item._id}>
                            <TableCell>
                                {item?.applicant?.fullname}
                            </TableCell>

                            <TableCell>
                                {item?.applicant?.email}
                            </TableCell>

                            <TableCell>
                                {item?.applicant?.phoneNumber}
                            </TableCell>

                            <TableCell>
                                {item?.applicant?.profile?.resume ? (
                                    <button
                                        type="button"
                                        onClick={() => handleResumeDownload(item._id)}
                                        disabled={downloadingId === item._id}
                                        className="text-blue-600 hover:underline cursor-pointer disabled:opacity-50"
                                    >
                                        {downloadingId === item._id
                                            ? 'Preparing...'
                                            : item?.applicant?.profile?.resumeOriginalName || 'Download Resume'}
                                    </button>
                                ) : (
                                    <span>NA</span>
                                )}
                            </TableCell>

                            <TableCell>
                                {item?.applicant?.createdAt
                                    ? item.applicant.createdAt.split("T")[0]
                                    : 'NA'}
                            </TableCell>

                            <TableCell className="text-right">
                                <Popover>
                                    <PopoverTrigger>
                                        <MoreHorizontal />
                                    </PopoverTrigger>

                                    <PopoverContent className="w-28 bg-white">
                                        {shortlistingStatus.map((status, index) => (
                                            <div
                                                onClick={() => statusHandler(status, item?._id)}
                                                key={index}
                                                className="flex w-fit items-center my-2 cursor-pointer"
                                            >
                                                <span>{status}</span>
                                            </div>
                                        ))}
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ApplicantsTable;
