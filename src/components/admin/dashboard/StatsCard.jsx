import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function StatsCards({ stats = [] }) {
    return (
        <div className="mb-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-4 min-w-max">
                {stats.map((item) => (
                    <div
                        key={item.title}
                        className="w-64 sm:w-70 bg-white rounded-2xl p-5 shadow-sm shrink-0"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                                <FontAwesomeIcon icon={item.icon} />
                            </div>
                        </div>

                        <p className="text-xs uppercase tracking-widest text-gray-400 font-bold truncate">
                            {item.title}
                        </p>

                        <h2 className="text-xl font-bold mt-1 truncate whitespace-nowrap">
                            {item.value}
                        </h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatsCards;