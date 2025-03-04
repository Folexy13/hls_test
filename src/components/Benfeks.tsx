import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Table, Input, Collapse } from "antd";
import { api, apiBaseUrl } from "../service/apiService";

const { Panel } = Collapse;

const BenfeksPage = () => {
  const navigate = useNavigate();
  const [benfeksData, setBenfeksData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    api
        .get(`${apiBaseUrl}/health-conditions/`)
        .then((response) => {
          setBenfeksData(response.data);
          setFilteredData(response.data);
        })
        .catch((error) => console.error("Error fetching benfeks data:", error));

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = (e: any) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = benfeksData.filter((benfek) =>
        benfek.benfek.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const columns = [
    { title: "Code", dataIndex: "code", key: "code" },
    { title: "Name", dataIndex: "benfek", key: "benfek" },
    { title: "Phone Number", dataIndex: "phone", key: "phone" },
    {
      title: "Registered",
      dataIndex: "is_registered",
      key: "is_registered",
      render: (isRegistered: boolean) => (isRegistered ? "Registered" : "Pending"), // Convert boolean to "Yes" or "No"
    },
  ];

  return (
      <div className="min-h-screen sm:block flex items-center justify-center bg-gray-100 p-4">
        <div className="md:max-w-7xl sm:w-11/12 mx-auto w-full">
          <button
              onClick={() => navigate("/dashboard")}
              className="mb-6 flex items-center gap-2 text-white rounded bg-green-400 px-6 py-1 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h1 className="text-2xl font-bold mb-6">Search Benfeks</h1>
            <p className="text-gray-600 mb-4">Find a Benfek by name.</p>
            <Input
                placeholder="Search Benfeks..."
                value={searchTerm}
                onChange={handleSearch}
                className="mb-4"
            />

            {isMobile ? (
                <Collapse accordion className="mt-6">
                  {filteredData.map((benfek) => (
                      <Panel
                          key={benfek.id}
                          header={
                            <div className="flex items-center justify-between gap-2">
                              <span>{benfek.benfek}</span>
                              <span
                                  style={{
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    backgroundColor: benfek.is_registered ? "green" : "orange",
                                  }}
                              ></span>
                            </div>
                          }
                      >
                        <p>
                          <strong>Code:</strong> {benfek.code}
                        </p>
                        <p>
                          <strong>Phone Number:</strong> {benfek.phone}
                        </p>
                        <p>
                          <strong>Registered:</strong>{" "}
                          {benfek.is_registered ? "Registered" : "Pending"}
                        </p>
                      </Panel>
                  ))}
                </Collapse>
            ) : (
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    pagination={false}
                    className="mt-6"
                />
            )}
          </div>
        </div>
      </div>
  );
};

export default BenfeksPage;