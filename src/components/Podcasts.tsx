import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Upload, Button, List } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

function Podcasts() {
    const navigate = useNavigate();
    const [fileList, setFileList] = useState<any[]>([]);

    const handleUploadChange = ({ fileList }: any) => {
        setFileList(fileList);
    };

    const handleDelete = (file: any) => {
        // Remove the file from the fileList
        const updatedFileList = fileList.filter((f) => f.uid !== file.uid);
        setFileList(updatedFileList);
    };

    return (
        <div className="min-h-screen sm:block flex items-center justify-center bg-gray-100 p-4">
            <div className="md:max-w-7xl w-11/12 mx-auto">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="mb-6 flex items-center gap-2 text-white rounded bg-green-400 px-6 py-1 hover:text-gray-900"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </button>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h1 className="text-2xl font-bold mb-6">Podcasts</h1>

                    {/* Upload Button */}
                    <Upload
                        fileList={fileList}
                        onChange={handleUploadChange}
                        beforeUpload={() => false}
                        multiple={false}
                        showUploadList={false}
                        accept="video/*"
                    >
                        <Button icon={<UploadOutlined />}>Upload Podcast</Button>
                    </Upload>

                    {/* List of Uploaded Podcasts */}
                    {fileList.length > 0 && (
                        <List
                            className="mt-4"
                            bordered
                            dataSource={fileList}
                            renderItem={(file: any) => (
                                <List.Item>
                                    <div className="flex items-center justify-between w-full">
                                        {/* Podcast Thumbnail and Name */}
                                        <div className="flex items-center space-x-4">
                                            <video
                                                src={URL.createObjectURL(file.originFileObj)}
                                                className="w-10 h-10 sm:w-24 sm:h-16 object-cover rounded"
                                                controls={false}
                                            />
                                            <span>{file.name}</span>
                                        </div>

                                        {/* Delete Button */}
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleDelete(file)}
                                        />
                                    </div>
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