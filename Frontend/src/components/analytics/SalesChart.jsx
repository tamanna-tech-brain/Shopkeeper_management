import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";

const SalesChart = ({ data }) => {

    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 
        rounded-3xl p-6 shadow-2xl">

            <h1 className="text-white text-2xl font-bold mb-6">
                Monthly Sales
            </h1>

            <ResponsiveContainer width="100%" height={300}>

                <LineChart data={data}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="#ec4899"
                        strokeWidth={4}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>
    );
};

export default SalesChart;