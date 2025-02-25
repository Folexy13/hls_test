import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Table,
  Modal,
  Button,
  Form,
  Input,
  DatePicker,
  Upload,
  Dropdown,
  Menu,
  Collapse,
} from "antd";
import { UploadOutlined, MoreOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { api, apiBaseUrl } from "../service/apiService";

const { Panel } = Collapse;

const Supplements = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSupplement, setEditingSupplement] = useState<any>(null);
  const [form] = Form.useForm();
  const [supplements, setSupplements] = useState<any[]>([]);
  const [, setIsMobile] = useState(window.innerWidth < 768);
  const handleEdit = (record: any) => {
    setEditingSupplement(record);
    form.setFieldsValue({
      name: record.name,
      price: record.price,
      expiry: dayjs(record.expiry),
      image: record.image ? [{ url: record.image }] : [],
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`${apiBaseUrl}/supplements/${id}`);
      setSupplements((prev) => prev.filter((supplement) => supplement.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      await api.post(`${apiBaseUrl}/supplements/`, values);
      setSupplements(prevSupplements => [...prevSupplements, values]);
    } catch (e) {
      console.log(e);
    }
  }


  useEffect(() => {
    const fetchSupplements = async () => {
      try {
        const response = await api.get(`${apiBaseUrl}/supplements/`);
        setSupplements(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSupplements();

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text: string) => (
        <img
          src={text}
          alt="Supplement"
          className="w-12 h-12 object-cover rounded"
        />
      ),
    },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Price (NGN)",
      dataIndex: "price",
      key: "price",
      render: (price: number) => price.toLocaleString(),
    },
    {
      title: "Expiry Date",
      dataIndex: "expiry",
      key: "expiry",
      render: (expiry: string) => {
        const expiryDate = dayjs(expiry);
        return <span className="font-bold">{expiryDate.format("MMM D, YYYY")}</span>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item onClick={() => handleEdit(record)}>Edit</Menu.Item>
              <Menu.Item onClick={() => handleDelete(record.id)}>Delete</Menu.Item>
            </Menu>
          }
        >
          <Button icon={<MoreOutlined />} className="border-0 bg-transparent" />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center">
      <div className="md:max-w-7xl w-11/12 mx-auto">
        <button
            onClick={() => navigate('/dashboard')}
            className="mb-6 flex items-center gap-2 text-white rounded bg-green-400 px-6 py-1 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Supplements</h1>
          <Button type="primary" onClick={() => setIsModalVisible(true)} className="mb-4">
            Add Supplement
          </Button>

          {/* Table for larger screens */}
          <div className="hidden md:block">
            <Table columns={columns} dataSource={supplements} pagination={false} />
          </div>

          {/* Accordion for smaller screens */}
          <div className="block md:hidden">
            <Collapse accordion>
              {supplements.map((supplement) => (
                <Panel
                  header={
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{supplement.name}</span>
                      <span className="text-gray-500">{dayjs(supplement.expiry).format("MMM D, YYYY")}</span>
                    </div>
                  }
                  key={supplement.id}
                >
                  <div className="flex flex-col gap-2">
                    <img src={supplement.image} alt={supplement.name} className="w-full h-40 object-cover rounded-lg" />
                    <p><strong>Price:</strong> ₦{supplement.price.toLocaleString()}</p>
                    <div className="flex justify-between">
                      <Button size="small" onClick={() => handleEdit(supplement)}>Edit</Button>
                      <Button size="small" danger onClick={() => handleDelete(supplement.id)}>Delete</Button>
                    </div>
                  </div>
                </Panel>
              ))}
            </Collapse>
          </div>
        </div>
      </div>

      {/* Modal for adding/editing */}
      <Modal
        title={editingSupplement ? "Edit Supplement" : "Add New Supplement"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true, message: "Enter name!" }]}>
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item label="Price (NGN)" name="price" rules={[{ required: true, message: "Enter price!" }]}>
            <Input placeholder="Enter price" />
          </Form.Item>

          <Form.Item label="Expiry Date" name="expiry" rules={[{ required: true, message: "Select expiry date!" }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Image" name="image" valuePropName="fileList" 
  getValueFromEvent={(e) => e?.fileList || []} >
            <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingSupplement ? "Save Changes" : "Add Supplement"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Supplements;
