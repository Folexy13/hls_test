import {Button, Select} from "antd";
import {LeftOutlined, RightOutlined} from "@ant-design/icons";

interface PaginationProps {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
    showSizeChanger?: boolean;
    pageSizeOptions?: number[];
}

const Pagination = ({
                        current,
                        pageSize,
                        total,
                        onChange,
                        showSizeChanger = true,
                        pageSizeOptions = [10, 20, 50, 100],
                    }: PaginationProps) => {
    const totalPages = Math.ceil(total / pageSize);

    return (
        <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
                Showing {(current - 1) * pageSize + 1} to{" "}
                {Math.min(current * pageSize, total)} of {total} items
            </div>

            <div className="flex items-center gap-2">
                {showSizeChanger && (
                    <Select
                        value={pageSize}
                        onChange={(value) => onChange(1, value)}
                        options={pageSizeOptions.map((size) => ({
                            value: size,
                            label: `${size} / page`,
                        }))}
                        className="w-32"
                    />
                )}

                <Button
                    icon={<LeftOutlined/>}
                    disabled={current === 1}
                    onClick={() => onChange(current - 1, pageSize)}
                />

                <span className="mx-2">
          Page {current} of {totalPages}
        </span>

                <Button
                    icon={<RightOutlined/>}
                    disabled={current === totalPages}
                    onClick={() => onChange(current + 1, pageSize)}
                />
            </div>
        </div>
    );
};

export default Pagination;