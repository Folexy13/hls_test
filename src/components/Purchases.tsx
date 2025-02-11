import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Table, Button, Collapse } from 'antd';

const { Panel } = Collapse;

// Sample data for purchases
const initialPurchases = [
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
];

const Purchases = () => {
  const navigate = useNavigate();
  const [purchases] = useState(initialPurchases);
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
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">Purchases</h1>
          <p className="text-gray-600 mb-4">View your Benfek receipts below.</p>

          {/* Table for larger screens */}
          <div className="hidden md:block">
            <Table
              columns={columns}
              dataSource={purchases}
              pagination={false}
              className="mt-6"
            />
          </div>

          {/* Accordion for smaller screens */}
          <div className="block md:hidden">
            <Collapse accordion>
              {purchases.map((purchase) => (
                <Panel
                  header={`${purchase.receiptNumber} - ₦${purchase.totalPurchase}`}
                  key={purchase.key}
                >
                  <p><strong>Date:</strong> {purchase.date}</p>
                  <Button type="link" onClick={() => toggleDetails(purchase.key)}>
                    {expandedRow === purchase.key ? 'Hide Details' : 'Explicit Detail'}
                  </Button>
                  {expandedRow === purchase.key && (
                    <div className="mt-2">
                      <p><strong>Benfek Name:</strong> {purchase.benfekName}</p>
                      <p><strong>Items:</strong> {purchase.items.join(', ')}</p>
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

export default Purchases;
