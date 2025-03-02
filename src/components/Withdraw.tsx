import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowLeft} from 'lucide-react';
import {Button, Input, Modal, notification, Form, message} from 'antd';
import {jwtDecode} from "jwt-decode";
import {api, apiBaseUrl} from "../service/apiService.ts";

const Withdraw = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [transactionType, setTransactionType] = useState<'deposit' | 'withdraw'>('deposit');
    const [myWallet, setMyWallet] = useState<{ balance: number }>({balance: 0});
    const [walletBalance, setWalletBalance] = useState(myWallet.balance ?? 0); // Initial wallet balance
    const [withDrawalCount, setWithDrawalCount] = useState<number | null>(null);
    const [form] = Form.useForm(); // Use Form hook to manage form state
    useEffect(() => {
        const fetchWIthdrawalCount = async () => {
            const resp = await api.get(`${apiBaseUrl}/wallet/withdrawals/count/`)
            setWithDrawalCount(resp.data.withdrawals_count);
        }
        fetchWIthdrawalCount()
    }, []);

    const handleModalOpen = (type: 'deposit' | 'withdraw') => {
        setTransactionType(type);
        setIsModalVisible(true);
    };

    const fetchWallet = async () => {
        // Get the auth token from localStorage
        const authToken = localStorage.getItem("authToken") ?? "";
        // Decode the token
        const decoded: { user_id: string } = jwtDecode(authToken);

        const resp = await api.get(apiBaseUrl + "/wallets/" + decoded.user_id,);
        setMyWallet(resp.data);
    };
    useEffect(() => {

        fetchWallet();
    }, []);
    const handleTransaction = async (amount: any) => {

        if (amount <= 0) {
            notification.error({message: 'Amount must be greater than zero'});
            return;
        }

        if (transactionType === 'withdraw' && amount > walletBalance) {
            notification.error({message: 'Insufficient funds'});
            return;
        }

        const newTransaction = {
            key: transactions.length + 1,
            type: transactionType === 'deposit' ? 'Deposit' : 'Withdrawal',
            amount: `₦${amount}`,
            date: new Date().toLocaleString(),
            status: 'Completed',
        };


        setTransactions([...transactions, newTransaction]);

        // Update wallet balance based on transaction type
        if (transactionType === 'deposit') {
            setWalletBalance(walletBalance + amount);
        } else if (transactionType === 'withdraw') {

            await api.post(`${apiBaseUrl}/wallets/withdraw_funds`, {amount})

            message.success("Operation Successful")
            setWalletBalance(walletBalance - amount);
        }

        setIsModalVisible(false);
        notification.success({message: `${transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!`});
    };

    // const columns = [
    //     {title: 'Transaction Type', dataIndex: 'type', key: 'type'},
    //     {title: 'Amount', dataIndex: 'amount', key: 'amount'},
    //     {title: 'Date', dataIndex: 'date', key: 'date'},
    //     {title: 'Status', dataIndex: 'status', key: 'status'},
    // ];

    return (
        <div className="sm:block flex items-center justify-center bg-gray-100 p-4">
            <div className="md:max-w-7xl w-11/12 mx-auto">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mb-6 flex items-center gap-2 text-white rounded bg-green-400 px-6 py-1 text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="w-5 h-5"/>
                    Back to Dashboard
                </button>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h1 className="text-2xl font-bold mb-6 flex items-center justify-between">
                        <span>Withdraw</span>
                        <span className={"text-xs"}> {withDrawalCount} / 2 withdrawals left</span>
                    </h1>
                    <p className="text-gray-600 mb-6">Manage your wallet transactions here.</p>

                    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-700">Wallet Balance</h2>
                        <p className="text-xl text-gray-900">₦{walletBalance}</p>
                    </div>


                    <Button type="primary" disabled={withDrawalCount == null || withDrawalCount <=100} danger
                            onClick={() => handleModalOpen('withdraw')}>
                        Withdraw Funds
                    </Button>

                    {/*<div className="overflow-x-auto mt-6">*/}
                    {/*    <Table*/}
                    {/*        columns={columns}*/}
                    {/*        dataSource={transactions}*/}
                    {/*        pagination={false}*/}
                    {/*        scroll={{x: 800}} // Enables horizontal scrolling*/}
                    {/*        className="w-full"*/}
                    {/*    />*/}
                    {/*</div>*/}
                </div>
            </div>

            {/* Modal for deposit/withdraw */}
            <Modal
                title={`${transactionType === 'deposit' ? 'Add Funds to' : 'Withdraw from'} Wallet`}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => handleTransaction(form.getFieldValue("amount"))}
                okText={transactionType === 'deposit' ? 'Add Funds' : 'Withdraw'}
            >
                <Form form={form} className="flex flex-col space-y-4">
                    <Form.Item
                        name="amount"
                        rules={[
                            {
                                required: true,
                                message: `Please enter the amount to ${transactionType === 'deposit' ? 'deposit' : 'withdraw'}`,
                            },
                        ]}
                    >
                        <Input
                            type="number"
                            placeholder={`Enter amount to ${transactionType === 'deposit' ? 'deposit' : 'withdraw'}`}
                            min={1}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Withdraw;
