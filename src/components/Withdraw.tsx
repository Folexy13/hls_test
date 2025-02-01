import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, Table, Input, Modal, notification } from 'antd';

const Withdraw = () => {
  const navigate = useNavigate();
  const [walletBalance, setWalletBalance] = useState(5000); // Initial wallet balance
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState<number>(0);

  const handleModalOpen = (type: 'deposit' | 'withdraw') => {
    setTransactionType(type);
    setIsModalVisible(true);
  };

  const handleTransaction = () => {
    if (amount <= 0) {
      notification.error({ message: 'Amount must be greater than zero' });
      return;
    }

    if (transactionType === 'withdraw' && amount > walletBalance) {
      notification.error({ message: 'Insufficient funds' });
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
      setWalletBalance(walletBalance - amount);
    }

    setAmount(0);
    setIsModalVisible(false);
    notification.success({ message: `${transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!` });
  };

  const columns = [
    { title: 'Transaction Type', dataIndex: 'type', key: 'type' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  return (
    <div className="min-h-screen sm:block flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Withdraw</h1>
          <p className="text-gray-600 mb-6">Manage your wallet transactions here.</p>

          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700">Wallet Balance</h2>
            <p className="text-xl text-gray-900">₦{walletBalance}</p>
          </div>

          
          <Button type="primary" danger onClick={() => handleModalOpen('withdraw')}>
            Withdraw Funds
          </Button>

          <div className="overflow-x-auto mt-6">
            <Table
              columns={columns}
              dataSource={transactions}
              pagination={false}
              scroll={{ x: 800 }} // Enables horizontal scrolling
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Modal for deposit/withdraw */}
      <Modal
        title={`${transactionType === 'deposit' ? 'Add Funds to' : 'Withdraw from'} Wallet`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleTransaction}
        okText={transactionType === 'deposit' ? 'Add Funds' : 'Withdraw'}
      >
        <div className="flex flex-col space-y-4">
          <Input
            type="number"
            placeholder={`Enter amount to ${transactionType === 'deposit' ? 'deposit' : 'withdraw'}`}
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            min={1}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Withdraw;
