import { useEffect, useState } from "react";
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
  message,
  UploadFile,
  Select,
} from "antd";
import { UploadOutlined, MoreOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { api, apiBaseUrl, getContentType } from "../service/apiService";

const { Panel } = Collapse;

const Supplements = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSupplement, setEditingSupplement] = useState<any>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [supplements, setSupplements] = useState<any[]>([]);
  const [fileList, setFileList] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [, setIsMobile] = useState(window.innerWidth < 768);
  const isPharmacy = JSON.parse(localStorage.getItem("isPharmacy") || "false");
const [drugCategory, setDrugCategory] = useState(""); // State for drug category selection

  // Filter supplements based on search term
  const filteredSupplements = supplements.filter((supplement) =>
    supplement.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (record: any) => {
    try {
      setEditingSupplement(record);
      setIsModalVisible(true);

      // Populate the form with existing values
      form.setFieldsValue({
        name: record.name,
        price: record.price,
        expiry: dayjs(record.expiry),
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`${apiBaseUrl}/supplements/${id}`);
      setSupplements((prev) =>
        prev.filter((supplement) => supplement.id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("expiry", values.expiry.toISOString());
    formData.append("drug_category", values.drugCategory);

    // Include the image file only if it exists
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("image", fileList[0].originFileObj);
    }
    if (!formData.get("image")) {
      message.error("Image cannot be empty");
      setLoading(false);
      return;
    }

    try {
      let response: any;
      if (editingSupplement) {
        // Update existing supplement
        response = await api.put(
          `${apiBaseUrl}/supplements/${editingSupplement.id}/`,
          formData,
          {
            headers: getContentType("multipart/form-data"),
          }
        );
        setSupplements((prev) =>
          prev.map((item) =>
            item.id === editingSupplement.id ? response.data : item
          )
        );
        message.success("Supplement updated successfully");
      } else {
        // Create new supplement
        response = await api.post(`${apiBaseUrl}/supplements/`, formData, {
          headers: getContentType("multipart/form-data"),
        });
        setSupplements((prev) => [...prev, response.data]);
        message.success("Supplement added successfully");
      }

      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
      setEditingSupplement(null);
    } catch (error) {
      console.error(error);
      alert(JSON.stringify(error))
      message.error(
        editingSupplement
          ? "Failed to update supplement"
          : "Failed to add supplement"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // Update search term
  };

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
        return (
          <span className="font-bold">{expiryDate.format("MMM D, YYYY")}</span>
        );
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
              <Menu.Item onClick={() => handleDelete(record.id)}>
                Delete
              </Menu.Item>
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
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center gap-2 text-white rounded bg-green-400 px-6 py-1 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">
            {isPharmacy ? "Medications" : "Supplements"}
          </h1>

          {/* Search Input */}
          <Input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearch}
            className="mb-4"
          />

          {/* Table for larger screens */}
          <div className="hidden md:block">
            <Table columns={columns} dataSource={filteredSupplements} />
          </div>

          {/* Accordion for smaller screens */}
          <div className="block md:hidden">
            <Collapse accordion>
              {filteredSupplements.map((supplement) => (
                <Panel
                  header={
                    <div className="flex items-center justify-between">
                      <span>
                        <img
                          src={supplement.image}
                          alt={supplement.name}
                          className="w-8 h-8 object-cover rounded-lg"
                        />
                      </span>
                      <span className="font-semibold">{supplement.name}</span>
                      <span>₦{supplement.price.toLocaleString()}</span>
                    </div>
                  }
                  key={supplement.id}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between mt-2">
                      <Button
                        size="small"
                        onClick={() => handleEdit(supplement)}
                      >
                        Edit
                      </Button>
                      <p className="flex flex-col">
                        <span className="text-red-600">
                          {dayjs(supplement.expiry).format("MMM D, YYYY")}
                        </span>
                      </p>
                      <Button
                        size="small"
                        danger
                        onClick={() => handleDelete(supplement.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Panel>
              ))}
            </Collapse>
          </div>

          {/* Add Supplement Button at the Bottom */}
          <Button
            type="primary"
            onClick={() => setIsModalVisible(true)}
            className="mt-4"
          >
            {isPharmacy ? "Add Medication" : "Add Supplement"}
          </Button>
        </div>

        {/* Modal for adding/editing */}
        <Modal
          title={
            editingSupplement
              ? `Edit ${isPharmacy ? "Medication" : "Supplement"}`
              : `Add New ${isPharmacy ? "Medication" : "Supplement"}`
          }
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          destroyOnClose
        >
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Enter name!" }]}
            >
              <Input placeholder="Enter name" />
            </Form.Item>

            <Form.Item
              label="Brand"
              name="brand"
              rules={[{ required: true, message: "Enter brand!" }]}
            >
              <Input placeholder="Enter brand" />
            </Form.Item>

            <Form.Item
              label="Price (NGN)"
              name="price"
              rules={[{ required: true, message: "Enter price!" }]}
            >
              <Input placeholder="Enter price" />
            </Form.Item>

            <Form.Item
              label="Expiry Date"
              name="expiry"
              rules={[{ required: true, message: "Select expiry date!" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            {isPharmacy && (
              <Form.Item
                label="Drug Category"
                name="drugCategory"
                rules={[{ required: true, message: "Select drug category!" }]}
              >
                <Select
                  value={drugCategory}
                  onChange={(value) => setDrugCategory(value)}
                  placeholder="Select Drug Category"
                >
                  <Select.Option value="RX meds">RX meds</Select.Option>
                  <Select.Option value="OTC">OTC</Select.Option>
                  <Select.Option value="supplements">Supplements</Select.Option>
                </Select>
              </Form.Item>
            )}

            <Form.Item label="Image" name="image">
              <Upload
                listType="picture"
                maxCount={1}
                beforeUpload={() => false} // Prevent auto-upload
                fileList={fileList}
                onChange={handleFileChange}
                accept="image/jpeg,image/png"
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>

            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={loading}
              >
                {editingSupplement
                  ? "Save Changes"
                  : isPharmacy
                  ? "Add Medications"
                  : "Add Supplement"}
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Supplements;
