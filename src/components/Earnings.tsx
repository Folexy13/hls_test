import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Table, Button } from 'antd';

const Earnings = () => {
  const navigate = useNavigate();
  
  const [earningsData] = useState([
    {
      key: '1',
      reference: 'TXN12345',
      amount: '₦5,000',
      type: 'Commission',
      date: '2025-01-23',
      status: 'Paid',
    },
    {
      key: '2',
      reference: 'TXN12346',
      amount: '₦3,500',
      type: 'Referral Bonus',
      date: '2025-01-22',
      status: 'Pending',
    },
    {
      key: '3',
      reference: 'TXN12347',
      amount: '₦2,000',
      type: 'Sale Earnings',
      date: '2025-01-21',
      status: 'Paid',
    },
    // Add more earnings records here
  ]);

  const columns = [
    { title: 'Transaction Reference', dataIndex: 'reference', key: 'reference' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
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
          <h1 className="text-2xl font-bold mb-6">Earnings</h1>
          <p className="text-gray-600 mb-4">Manage your earnings details below.</p>
          
          {/* Total Earnings Section */}
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700">Total Earnings</h2>
            <p className="text-xl text-gray-900">₦10,500</p>
          </div>

          {/* Add Earnings Button */}
          <Button type="primary" className="mb-6">
            Add Earnings
          </Button>

          {/* Earnings Table */}
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={earningsData}
              pagination={false}
              scroll={{ x: 800 }} // This enables horizontal scrolling
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
