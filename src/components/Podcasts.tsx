import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Upload, Button, List } from "antd";
import { UploadOutlined } from "@ant-design/icons";

function Podcasts() {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  return (
      <div className="min-h-screen sm:block flex items-center justify-center bg-gray-100 p-4">
        <div className="md:max-w-7xl w-11/12 mx-auto">
          <button
              onClick={() => navigate("/dashboard")}
              className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-2xl font-bold mb-6">Podcasts</h1>

            <Upload
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={() => false}
                multiple
            >
              <Button icon={<UploadOutlined />}>Upload Podcast</Button>
            </Upload>

            {fileList.length > 0 && (
                <List
                    className="mt-4"
                    bordered
                    dataSource={fileList}
                    renderItem={(file:any) => (
                        <List.Item>
                          <span>{file.name}</span>
                        </List.Item>
                    )}
                />
            )}
          </div>
        </div>
      </div>
  );
}

export default Podcasts;
