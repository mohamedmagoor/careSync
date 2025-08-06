import React, { useState, useEffect, useContext } from 'react';
import { Table, Form, Button, Modal, message, Select, Switch, TimePicker, InputNumber, DatePicker, Radio } from 'antd';
import axios from 'axios';
import { userContext } from "../UserContext/UserContext";
import moment from 'moment';

const daysOfWeek = [
    { id: 0, name: 'Monday' },
    { id: 1, name: 'Tuesday' },
    { id: 2, name: 'Wednesday' },
    { id: 3, name: 'Thursday' },
    { id: 4, name: 'Friday' },
    { id: 5, name: 'Saturday' },
    { id: 6, name: 'Sunday' },
];

class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-fallback" style={{ padding: '20px', color: 'red' }}>
                    <h2>Something went wrong</h2>
                    <p>{this.state.error?.message || 'Unknown error'}</p>
                    <Button type="primary" onClick={() => window.location.reload()}>
                        Reload Page
                    </Button>
                </div>
            );
        }
        return this.props.children;
    }
}

const DoctorScheduleManage = () => {
    const { userToken } = useContext(userContext);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [currentWeek, setCurrentWeek] = useState(moment().startOf('week'));

    useEffect(() => {
        fetchSchedules();
    }, [currentWeek]);

    const safeMomentFormat = (date, formatString, fallback = '') => {
        try {
            if (!date) return fallback;
            const momentObj = moment.isMoment(date) ? date : moment(date);
            return momentObj.isValid() ? momentObj.format(formatString) : fallback;
        } catch (error) {
            console.error('Date formatting error:', error);
            return fallback;
        }
    };

    const fetchSchedules = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                'https://grackle-notable-hardly.ngrok-free.app/api/appointments/doctor/schedule/', 
                {
                    params: {
                        week: currentWeek.format('YYYY-MM-DD')
                    },
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        'ngrok-skip-browser-warning': 'true'
                    },
                }
            );
            
            const formattedSchedules = response.data.map(schedule => ({
                ...schedule,
                start_time: schedule.start_time ? moment(schedule.start_time, 'HH:mm:ss') : null,
                end_time: schedule.end_time ? moment(schedule.end_time, 'HH:mm:ss') : null,
                week_start_date: schedule.week_start_date ? moment(schedule.week_start_date) : null
            }));
            
            setSchedules(formattedSchedules);
        } catch (error) {
            console.error('Error fetching schedules:', error);
            message.error(error.response?.data?.message || 'Failed to fetch schedules');
        } finally {
            setLoading(false);
        }
    };

    const handleWeekChange = (date) => {
        if (!date) return;
        setCurrentWeek(date.startOf('week'));
    };

    const handleAddSchedule = () => {
        form.resetFields();
        form.setFieldsValue({
            is_working_day: true,
            appointment_duration: 30,
            is_recurring: false,
            week_start_date: currentWeek,
            start_time: moment('09:00', 'HH:mm'),
            end_time: moment('17:00', 'HH:mm')
        });
        setIsModalVisible(true);
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            
            let weekStartDate = values.week_start_date;
            if (values.is_recurring) {
                // For recurring schedules, use the default date (2000-01-01)
                weekStartDate = moment('2000-01-01');
            } else if (!moment.isMoment(weekStartDate)) {
                // If not a moment object, try to parse it
                weekStartDate = moment(weekStartDate);
                if (!weekStartDate.isValid()) {
                    throw new Error('Please select a valid week start date');
                }
            }

            const postData = {
                ...values,
                start_time: values.start_time ? values.start_time.format('HH:mm:ss') : '09:00:00',
                end_time: values.end_time ? values.end_time.format('HH:mm:ss') : '17:00:00',
                week_start_date: weekStartDate.format('YYYY-MM-DD'),
                is_recurring: values.is_recurring || false
            };

            if (values.id) {
                const response = await axios.put(
                    `https://grackle-notable-hardly.ngrok-free.app/api/appointments/doctor/schedule/${values.id}/`, 
                    postData,
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true'
                        },
                    }
                );
                
                setSchedules(prev => prev.map(s => 
                    s.id === values.id ? { 
                        ...s, 
                        ...response.data,
                        start_time: response.data.start_time ? moment(response.data.start_time, 'HH:mm:ss') : null,
                        end_time: response.data.end_time ? moment(response.data.end_time, 'HH:mm:ss') : null,
                        week_start_date: response.data.week_start_date ? moment(response.data.week_start_date) : null
                    } : s
                ));
                message.success('Schedule updated successfully');
            } else {
                const response = await axios.post(
                    'https://grackle-notable-hardly.ngrok-free.app/api/appointments/doctor/schedule/', 
                    postData,
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true'
                        },
                    }
                );
                
                const newSchedule = {
                    ...response.data,
                    start_time: response.data.start_time ? moment(response.data.start_time, 'HH:mm:ss') : null,
                    end_time: response.data.end_time ? moment(response.data.end_time, 'HH:mm:ss') : null,
                    week_start_date: response.data.week_start_date ? moment(response.data.week_start_date) : null
                };
                
                setSchedules(prev => [...prev, newSchedule]);
                message.success('Schedule added successfully');
            }
            
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error:', error);
            let errorMessage = 'Failed to save schedule';
            if (error.response) {
                errorMessage = error.response.data?.message || 
                             (typeof error.response.data === 'object' 
                              ? JSON.stringify(error.response.data) 
                              : error.response.data) || 
                             errorMessage;
            } else if (error.message) {
                errorMessage = error.message;
            }
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        Modal.confirm({
            title: 'Confirm Delete',
            content: 'Are you sure you want to delete this schedule?',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    setLoading(true);
                    await axios.delete(
                        `https://grackle-notable-hardly.ngrok-free.app/doctor/schedule/${id}/`,  // Updated URL
                        {
                            headers: {
                                Authorization: `Bearer ${userToken}`,
                                'ngrok-skip-browser-warning': 'true'
                            },
                        }
                    );
                    
                    setSchedules(prev => prev.filter(schedule => schedule.id !== id));
                    message.success('Schedule deleted successfully');
                } catch (error) {
                    console.error('Error deleting schedule:', error);
                    if (error.response?.status === 404) {
                        message.error('Schedule not found or already deleted');
                    } else {
                        message.error(error.response?.data?.message || 'Failed to delete schedule');
                    }
                } finally {
                    setLoading(false);
                }
            }
        });
    };
    const columns = [
        {
            title: 'Week',
            dataIndex: 'week_start_date',
            key: 'week',
            render: (date) => safeMomentFormat(date, 'MMM D, YYYY', 'Recurring'),
        },
        {
            title: 'Day',
            dataIndex: 'day_of_week',
            key: 'day',
            render: (day) => daysOfWeek.find(d => d.id === day)?.name || day,
        },
        {
            title: 'Working',
            dataIndex: 'is_working_day',
            key: 'working',
            render: (isWorking) => (isWorking ? 'Yes' : 'No'),
        },
        {
            title: 'Hours',
            key: 'hours',
            render: (_, record) => (
                record.is_working_day 
                    ? `${safeMomentFormat(record.start_time, 'HH:mm')} - ${safeMomentFormat(record.end_time, 'HH:mm')}`
                    : 'Day Off'
            ),
        },
        {
            title: 'Duration',
            dataIndex: 'appointment_duration',
            key: 'duration',
            render: (duration) => `${duration} min`,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button 
                    danger 
                    onClick={() => handleDelete(record.id)}
                    disabled={loading}
                >
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <ErrorBoundary>
            <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Doctor Schedule Management</h2>
                    <div>
                        <DatePicker 
                            picker="week" 
                            value={currentWeek} 
                            onChange={handleWeekChange}
                            style={{ marginRight: 16 }}
                            disabledDate={(current) => current && current < moment().startOf('week')}
                        />
                        <Button 
                            type="primary" 
                            onClick={handleAddSchedule}
                            loading={loading}
                        >
                            Add Schedule
                        </Button>
                    </div>
                </div>

                <Table
                    columns={columns}
                    dataSource={schedules}
                    rowKey="id"
                    pagination={false}
                    bordered
                    loading={loading}
                />

                <Modal
                    title="Add/Edit Schedule"
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    onOk={() => form.submit()}
                    okText="Save"
                    cancelText="Cancel"
                    confirmLoading={loading}
                    width={800}
                    destroyOnClose
                >
                    <Form 
                        form={form} 
                        onFinish={handleSubmit} 
                        layout="vertical"
                    >
                        <Form.Item name="id" hidden>
                            <InputNumber />
                        </Form.Item>
                        
                        <Form.Item
                            name="is_recurring"
                            label="Schedule Type"
                            rules={[{ required: true }]}
                        >
                            <Radio.Group>
                                <Radio.Button value={false}>Weekly Schedule</Radio.Button>
                                <Radio.Button value={true}>Recurring Schedule</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        
                        <Form.Item
                            noStyle
                            shouldUpdate={(prev, current) => prev.is_recurring !== current.is_recurring}
                        >
                            {({ getFieldValue }) => !getFieldValue('is_recurring') && (
                               <Form.Item
                               name="week_start_date"
                               label="Week Starting"
                               rules={[
                                   { required: true },
                                   ({ getFieldValue }) => ({
                                       validator(_, value) {
                                           if (getFieldValue('is_recurring')) return Promise.resolve();
                                           if (!value) return Promise.reject('Please select a week');
                                           const date = moment.isMoment(value) ? value : moment(value);
                                           if (!date.isValid()) return Promise.reject('Invalid date');
                                           return Promise.resolve();
                                       },
                                   }),
                               ]}
                           >
                               <DatePicker 
                                   style={{ width: '100%' }} 
                                   disabledDate={(current) => current && current < moment().startOf('week')}
                               />
                           </Form.Item>
                            )}
                        </Form.Item>

                        <Form.Item
                            name="day_of_week"
                            label="Day of Week"
                            rules={[{ required: true }]}
                        >
                            <Select>
                                {daysOfWeek.map(day => (
                                    <Select.Option key={day.id} value={day.id}>
                                        {day.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="is_working_day"
                            label="Is Working Day"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>

                        <Form.Item
                            noStyle
                            shouldUpdate={(prev, current) => prev.is_working_day !== current.is_working_day}
                        >
                            {({ getFieldValue }) => getFieldValue('is_working_day') && (
                                <>
                                    <Form.Item
                                        name="start_time"
                                        label="Start Time"
                                        rules={[{ required: true }]}
                                    >
                                        <TimePicker 
                                            format="HH:mm" 
                                            style={{ width: '100%' }} 
                                            minuteStep={15}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="end_time"
                                        label="End Time"
                                        rules={[
                                            { required: true },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    const start = getFieldValue('start_time');
                                                    if (!value || !start || value.isAfter(start)) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject('End time must be after start time');
                                                },
                                            }),
                                        ]}
                                    >
                                        <TimePicker 
                                            format="HH:mm" 
                                            style={{ width: '100%' }} 
                                            minuteStep={15}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="appointment_duration"
                                        label="Appointment Duration (minutes)"
                                        rules={[
                                            { required: true },
                                            { type: 'number', min: 10, max: 120 }
                                        ]}
                                    >
                                        <InputNumber 
                                            min={10} 
                                            max={120} 
                                            style={{ width: '100%' }} 
                                        />
                                    </Form.Item>
                                </>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </ErrorBoundary>
    );
};

export default DoctorScheduleManage;