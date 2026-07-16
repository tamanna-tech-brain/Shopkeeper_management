import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const COLORS = ["#ec4899", "#8b5cf6", "#06b6d4"];

const PieChartBox = ({ data }) => {

    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 
        rounded-3xl p-6 shadow-2xl">

            <h1 className="text-white text-2xl font-bold mb-6">
                Inventory Distribution
            </h1>

            <ResponsiveContainer width="100%" height={300}>

                <PieChart>

                    <Pie
                        data={data}
                        dataKey="value"
                        outerRadius={120}
                        label
                    >
                        {data.map((entry,index)=>(
                            <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>

                    <Tooltip />

                </PieChart>

            </ResponsiveContainer>

        </div>
    );
};

export default PieChartBox;