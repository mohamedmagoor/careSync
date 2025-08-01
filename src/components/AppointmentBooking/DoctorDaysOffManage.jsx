import React, { useState, useEffect, useContext } from 'react';
import { Table, Form, Button, Modal, DatePicker, Input, message } from 'antd';
import axios from 'axios';
import { userContext } from "../UserContext/UserContext";
import moment from 'moment';

const DoctorDaysOffManage = () => {
    const { userToken } = useContext(userContext);
    const [daysOff, setDaysOff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchDaysOff();
    }, []);

    const fetchDaysOff = async () => {
        try {
            const response = await axios.get('https://grackle-notable-hardly.ngrok-free.app/api/appointments/doctor/days-off/', {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            console.log('Days Off API Response:', response.data);
            
            // Ensure we have an array for the table
            const daysOffData = Array.isArray(response.data) ? response.data : 
                              Array.isArray(response.data.days_off) ? response.data.days_off :
                              Array.isArray(response.data.results) ? response.data.results :
                              [];
            
            console.log('Processed days off data:', daysOffData);
            setDaysOff(daysOffData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching days off:', error);
            message.error('Failed to fetch days off');
            setLoading(false);
        }
    };

    const handleAddDayOff = () => {
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleSubmit = async (values) => {
        try {
            const formattedValues = {
                ...values,
                date: values.date.format('YYYY-MM-DD'),
            };
            
            const response = await axios.post('https://grackle-notable-hardly.ngrok-free.app/api/doctor/days-off/', formattedValues, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            message.success('Day off added successfully');
            setIsModalVisible(false);
            fetchDaysOff();
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to add day off');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://grackle-notable-hardly.ngrok-free.app/api/doctor/days-off/${id}/`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            message.success('Day off deleted successfully');
            fetchDaysOff();
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to delete day off');
        }
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => moment(date).format('MMMM Do, YYYY'),
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
            render: (reason) => reason || '-',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button danger onClick={() => handleDelete(record.id)}>
                    Delete
                </Button>
            ),
        },
    ];

    const disabledDate = (current) => {
        // Cannot select days before today
        return current && current < moment().startOf('day');
    };

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={handleAddDayOff}>
                    Add Day Off
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={Array.isArray(daysOff) ? daysOff : []}
                rowKey="id"
                loading={loading}
                pagination={false}
            />

            <Modal
                title="Add Day Off"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item
                        name="date"
                        label="Date"
                        rules={[{ required: true, message: 'Please select date' }]}
                    >
                        <DatePicker 
                            style={{ width: '100%' }} 
                            disabledDate={disabledDate}
                        />
                    </Form.Item>

                    <Form.Item
                        name="reason"
                        label="Reason (optional)"
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DoctorDaysOffManage;