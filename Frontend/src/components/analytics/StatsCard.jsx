const StatsCard = ({ title, value, icon }) => {

    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 
        rounded-3xl p-6 shadow-2xl hover:scale-105 transition duration-300">

            <div className="flex justify-between items-center">

                <div>
                    <h2 className="text-gray-300 text-sm">
                        {title}
                    </h2>

                    <h1 className="text-3xl font-bold text-white mt-2">
                        {value}
                    </h1>
                </div>

                <div className="text-4xl">
                    {icon}
                </div>

            </div>

        </div>
    );
};

export default StatsCard;