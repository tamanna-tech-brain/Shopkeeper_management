import StatsCard from "../components/analytics/StatsCard";
import SalesChart from "../components/analytics/SalesChart";
import PieChartBox from "../components/analytics/PieChartBox";
import { useEffect, useState } from "react";
import socket from "../socket";
import {
    FaUsers,
    FaBox,
    FaMoneyBill,
    FaShoppingCart
} from "react-icons/fa";
import { getDashboardStats } from "../apis/api.js";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);

    const salesData = [
        { month:"Jan", sales:4000 },
        { month:"Feb", sales:3000 },
        { month:"Mar", sales:5000 },
        { month:"Apr", sales:7000 },
        { month:"May", sales:6000 },
    ];

    const pieData = [
        { name:"Products", value:400 },
        { name:"Sales", value:300 },
        { name:"Customers", value:200 },
    ];

    const fetchStats = async () => {
        try {
            const res = await getDashboardStats();
            setStats(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchStats();

        socket.on("new-order", (order) => {
            alert(`New Order: ₹${order.totalAmount}`);
            fetchStats();
        });

        return () => {
            socket.off("new-order");
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-tr 
        from-indigo-900 via-purple-900 to-pink-900 p-8">

            <h1 className="text-4xl font-bold text-white mb-10">
                Admin Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <StatsCard
                    title="Total Users"
                    value={stats?.totalUsers || 0}
                    icon={<FaUsers className="text-cyan-400" />}
                />

                <StatsCard
                    title="Total Products"
                    value={stats?.totalProducts || 0}
                    icon={<FaBox className="text-pink-400" />}
                />

                <StatsCard
                    title="Total Sales"
                    value={stats?.totalSales || 0}
                    icon={<FaShoppingCart className="text-yellow-400" />}
                />

                <StatsCard
                    title="Revenue"
                    value={`₹${stats?.revenue || 0}`}
                    icon={<FaMoneyBill className="text-green-400" />}
                />

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">

                <SalesChart data={salesData} />

                <PieChartBox data={pieData} />

            </div>

        </div>
    );
};

export default AdminDashboard;