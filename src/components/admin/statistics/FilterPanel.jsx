import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMagnifyingGlass,
    faRotateRight,
} from "@fortawesome/free-solid-svg-icons";

function FilterPanel({
    filters,
    setFilters,
    months = [],
    years = [],
    onSearch,
    onReset,
}) {
    const isMonth = filters.period === "month";
    const isYear = filters.period === "year";

    return (
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
            <div className="flex flex-col xl:flex-row xl:items-end gap-4">
                {/* Selects */}
                <div
                    className={`grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 
                        ${isMonth
                            ? "xl:grid-cols-[1fr_180px_180px]"
                            : isYear ? "xl:grid-cols-[1fr_220px]" : "xl:grid-cols-1"
                        }
                    `}
                >
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Loại thống kê</label>

                        <select
                            value={filters.period}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    period: e.target.value,
                                }))
                            }
                            className="mt-2 w-full h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-orange-500"
                        >
                            <option value="week">Theo tuần</option>
                            <option value="month">Theo tháng</option>
                            <option value="year">Theo năm</option>
                        </select>
                    </div>

                    {isMonth && (
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Tháng</label>

                            <select
                                value={filters.month}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        month: Number(e.target.value),
                                    }))
                                }
                                className="mt-2 w-full h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-orange-500"
                            >
                                {months.map((month) => (
                                    <option key={month} value={month}>
                                        Tháng {month}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {(isMonth || isYear) && (
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Năm</label>

                            <select
                                value={filters.year}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        year: Number(e.target.value),
                                    }))
                                }
                                className="mt-2 w-full h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-orange-500"
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 xl:justify-end xl:shrink-0">
                    <button
                        onClick={onSearch}
                        className="h-11 px-5 rounded-xl bg-black text-white text-sm font-bold hover:opacity-90 transition whitespace-nowrap"
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2" />
                        Xem thống kê
                    </button>

                    <button
                        onClick={onReset}
                        className="h-11 px-5 rounded-xl border border-gray-200 text-gray-500 text-sm font-bold hover:bg-gray-50 transition whitespace-nowrap"
                    >
                        <FontAwesomeIcon icon={faRotateRight} className="mr-2" />
                        Đặt lại
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FilterPanel;