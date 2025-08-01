import React from 'react';
import { Tabs } from 'antd';
import DoctorScheduleManage from './DoctorScheduleManage';
import DoctorDaysOffManage from './DoctorDaysOffManage';

const DoctorAvailabilityManagement = () => {
    const items = [
        {
            key: '1',
            label: 'Weekly Schedule',
            children: <DoctorScheduleManage />,
        },
        {
            key: '2',
            label: 'Days Off',
            children: <DoctorDaysOffManage />,
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <h1>Manage Availability</h1>
            <Tabs defaultActiveKey="1" items={items} />
        </div>
    );
};

export default DoctorAvailabilityManagement;