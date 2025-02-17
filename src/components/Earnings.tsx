import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Table, Button } from 'antd';

const Earnings = () => {
  const navigate = useNavigate();
  
  const [earningsData] = useState([
    {
      key: '1',
      receiptNumber: 'BNF-20250101',
      date: '2025-01-01',
      totalPurchase: 4500,
      benfekName: 'Benfek A',
      items: ['Item 1', 'Item 2', 'Item 3'],
    },
    {
      key: '2',
      receiptNumber: 'BNF-20250110',
      date: '2025-01-10',
      totalPurchase: 6200,
      benfekName: 'Benfek B',
      items: ['Item 4', 'Item 5'],
    },
    {
      key: '3',
      receiptNumber: 'BNF-20250112',
      date: '2025-01-12',
      totalPurchase: 8000,
      benfekName: 'Benfek C',
      items: ['Item 6', 'Item 7', 'Item 8', 'Item 9'],
    },
    // Add more earnings records here
  ]);


  const columns = [
    { title: 'Receipt Number', dataIndex: 'receiptNumber', key: 'receiptNumber' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Total Purchase (₦)', dataIndex: 'totalPurchase', key: 'totalPurchase' },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
          <Button type="link" onClick={() => toggleDetails(record.key)}>
            {expandedRow === record.key ? 'Hide Details' : 'Explicit Detail'}
          </Button>
      ),
    },
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
