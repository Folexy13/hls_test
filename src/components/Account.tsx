import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {ArrowLeft} from "lucide-react";
import {Table, Modal, Button, Form, Input, Select, Collapse, Radio} from "antd";

const {Panel} = Collapse;

const Account = () => {
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSubmit = (values: any) => {
        console.log("New Transaction Details:", values);
        setIsModalVisible(false);
    };

    const transactionData = [
        {
            key: "1",
            reference: "TXN12345",
            type: "Withdrawal",
            status: "Completed",
            amount: "₦5,000",
            date: "2025-01-23",
        },
        {
            key: "2",
            reference: "TXN12346",
            type: "Purchase",
            status: "Pending",
            amount: "₦10,000",
            date: "2025-01-24",
        },
    ];

    const transactionColumns = [
        {title: "Transaction Reference", dataIndex: "reference", key: "reference"},
        {title: "Type", dataIndex: "type", key: "type"},
        {title: "Status", dataIndex: "status", key: "status"},
        {title: "Amount", dataIndex: "amount", key: "amount"},
        {title: "Date", dataIndex: "date", key: "date"},
        {
            title: "Action",
            key: "action",
            render: () => <Button type="link">View Details</Button>,
        },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="md:max-w-7xl w-11/12 mx-auto">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mb-6 flex items-center gap-2 text-white rounded bg-green-400 px-6 py-1 text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="w-5 h-5"/>
                    Back to Dashboard
                </button>

                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-sm md:text-2xl lg:text-3xl font-bold">
                            Account Transactions
                        </h1>
                        <p className="text-sm sm:text-lg font-semibold">
                            Account Balance: ₦0
                        </p>
                    </div>

                    {/* Accordion for Small Screens */}
                    <div className="block md:hidden">
                        <Collapse accordion expandIconPosition="end">
                            {transactionData.map((transaction) => (
                                <Panel header={transaction.reference} key={transaction.key}>
                                    <p><strong>Type:</strong> {transaction.type}</p>
                                    <p><strong>Status:</strong> {transaction.status}</p>
                                    <p><strong>Amount:</strong> {transaction.amount}</p>
                                    <p><strong>Date:</strong> {transaction.date}</p>
                                    <Button
                                        type="link">{transaction.type == "Purchase" ? "Approve" : "View Details"}</Button>
                                </Panel>
                            ))}
                        </Collapse>


                    </div>

                    {/* Table for Larger Screens */}
                    <div className="hidden md:block">
                        <Table
                            columns={transactionColumns}
                            dataSource={[]}
                            pagination={false}
                            className="w-full"
                            scroll={{x: "100%"}}
                        />
                    </div>

                    <div className="flex my-2 flex-col md:flex-row gap-2">
                        <Button type="default" className="bg-transparent border-0">
                            <p>Egazu Points: Free Trial (31 days validity)</p>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modal for Adding Transactions */}
            <Modal
                title="Add New Transaction"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                destroyOnClose
            >
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item
                        label="Transaction Reference"
                        name="reference"
                        rules={[{required: true, message: "Please input the transaction reference!"}]}
                    >
                        <Input placeholder="Enter reference"/>
                    </Form.Item>

                    <Form.Item
                        label="Type"
                        name="type"
                        rules={[{required: true, message: "Please select the transaction type!"}]}
                    >
                        <Select placeholder="Select type">
                            <Select.Option value="Withdrawal">Withdrawal</Select.Option>
                            <Select.Option value="Purchase">Purchase</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{required: true, message: "Please select the transaction status!"}]}
                    >
                        <Select placeholder="Select status">
                            <Select.Option value="Pending">Pending</Select.Option>
                            <Select.Option value="Completed">Completed</Select.Option>
                            <Select.Option value="Failed">Failed</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Amount"
                        name="amount"
                        rules={[{required: true, message: "Please input the transaction amount!"}]}
                    >
                        <Input placeholder="Enter amount"/>
                    </Form.Item>

                    <Form.Item
                        label="Date"
                        name="date"
                        rules={[{required: true, message: "Please input the transaction date!"}]}
                    >
                        <Input placeholder="Enter date"/>
                    </Form.Item>

                    <div className="flex justify-end gap-2">
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button type="primary" htmlType="submit">
                            Add Transaction
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default Account;
