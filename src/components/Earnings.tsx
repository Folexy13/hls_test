import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {Table, Button, Collapse} from 'antd';
const { Panel } = Collapse;
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

  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const toggleDetails = (key: string) => {
    setExpandedRow(expandedRow === key ? null : key);
  };

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
      <div className="md:max-w-7xl w-11/12 mx-auto">
        <button
            onClick={() => navigate('/dashboard')}
            className="mb-6 flex items-center gap-2 text-white rounded bg-green-400 px-6 py-1 text-gray-600 hover:text-gray-900"
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
            <p className="text-xl text-gray-900">₦0</p>
          </div>


          {/* Earnings Table */}
          <div className="hidden md:block">
            <Table
              columns={columns}
              dataSource={[]}
              pagination={false}
              scroll={{ x: 800 }} // This enables horizontal scrolling
              className="w-full"
            />
          </div>
          {/* Accordion for smaller screens */}
          <div className="block md:hidden">
            <Collapse accordion>
              {[].map((earnings:any) => (
                  <Panel
                      header={`${earnings.receiptNumber} - ₦${earnings.totalPurchase}`}
                      key={earnings.key}
                  >
                    <p><strong>Date:</strong> {earnings.date}</p>
                    <Button type="link" onClick={() => toggleDetails(earnings.key)}>
                      {expandedRow === earnings.key ? 'Hide Details' : 'Explicit Detail'}
                    </Button>
                    {expandedRow === earnings.key && (
                        <div className="mt-2">
                          <p><strong>Benfek Name:</strong> {earnings.benfekName}</p>
                          <p><strong>Items:</strong> {earnings.items.join(', ')}</p>
                        </div>
                    )}
                  </Panel>
              ))}
            </Collapse>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
