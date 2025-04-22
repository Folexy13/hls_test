
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {Table, Collapse, Radio} from 'antd';

const { Panel } = Collapse;

// Sample data for purchases

const paymentColumns = [
  { title: "Payment Reference", dataIndex: "reference", key: "reference" },
  { title: "Pack Name", dataIndex: "packName", key: "packName" },
  {
    title: "Reveal Detail",
    key: "details",
    render: (_: any, record: any) => (
        <Collapse expandIconPosition="end">
          <Panel header="Reveal Details" key={record.key}>
            <p>{record.details}</p>
          </Panel>
        </Collapse>
    ),
  },
  {
    title: "Approve Transaction",
    key: "approve",
    render: () => (
        <Radio.Group>
          <Radio value="yes">Yes</Radio>
          <Radio value="no">No</Radio>
        </Radio.Group>
    ),
  },
];

const paymentData = [
  {
    key: "1",
    reference: "PAY12345",
    packName: "Gold Package",
    details: "Details about the Gold Package",
  },
  {
    key: "2",
    reference: "PAY12346",
    packName: "Silver Package",
    details: "Details about the Silver Package",
  },
];

const Purchases = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="md:max-w-7xl w-11/12 mx-auto">
        <button
            onClick={() => navigate('/dashboard')}
            className="mb-6 flex items-center gap-2 text-white rounded bg-green-400 px-6 py-1 text-gray-600 hover:text-gray-900"
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
                columns={paymentColumns}
                dataSource={[]}
                pagination={false}
                scroll={{ x: "100%" }}
                className="w-full mt-6"
            />
          </div>

          {/* Accordion for smaller screens */}
          <div className="block md:hidden">
            <Collapse accordion expandIconPosition="end" className="mt-4">
              {[].map((payment) => (
                  <Panel header={payment.packName} key={payment.key}>
                    <p><strong>Details:</strong> {payment.details}</p>
                    <Radio.Group>
                      <Radio value="yes">Yes</Radio>
                      <Radio value="no">No</Radio>
                    </Radio.Group>
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
