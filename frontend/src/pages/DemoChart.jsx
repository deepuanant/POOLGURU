import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { TrendingUpIcon, DownloadIcon, MapPinIcon } from 'lucide-react';

const DemoChart = () => {
    const chartOptions = {
        chart: {
            type: 'donut',
            animations: {
                speed: 1000,
                animateGradually: { enabled: true, delay: 150 },
                dynamicAnimation: { enabled: true, speed: 350 }
            },
            background: 'transparent'
        },
        labels: ['Andhra Pradesh', 'Karnataka', 'Tamil Nadu'],
        colors: ['#6366F1', '#10B981', '#F59E0B'],
        dataLabels: { enabled: false },
        legend: {
            show: false,
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '75%',
                    background: 'transparent',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '22px',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 600,
                            color: '#1F2937',
                            offsetY: -10
                        },
                        value: {
                            show: true,
                            fontSize: '28px',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 700,
                            color: '#1F2937',
                            offsetY: 5,
                            formatter: (val) => val + "%"
                        },
                        total: {
                            show: true,
                            showAlways: true,
                            label: 'Total',
                            fontSize: '18px',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 600,
                            color: '#6B7280'
                        }
                    }
                }
            }
        },
        stroke: { show: false },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: { width: 300 },
                legend: { position: 'bottom' }
            }
        }]
    };
    
    const series = [38.43, 32.28, 29.29];

    return (
        <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl p-10 max-w-4xl mx-auto transition-all duration-300 hover:shadow-3xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-4xl font-extrabold text-gray-800 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Pool Summary</h2>
                    <p className="text-sm text-gray-600">Comprehensive view of financial information trends</p>
                </div>
                <div className="flex space-x-4">
                    <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-full transition-all duration-200 flex items-center shadow-md hover:shadow-lg">
                        <DownloadIcon size={18} className="mr-2" />
                        Export
                    </button>
                    <div className="bg-white text-indigo-600 p-4 rounded-full shadow-md">
                        <TrendingUpIcon size={24} />
                    </div>
                </div>
            </div>
            <div className="mb-10">
                <h3 className="text-2xl font-bold text-gray-700 mb-6">Top State Concentration</h3>
                <div className="bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                    <ReactApexChart 
                        options={chartOptions}
                        series={series}
                        type="donut"
                        height={400}
                    />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-8 text-center">
                {['Andhra Pradesh', 'Karnataka', 'Tamil Nadu'].map((state, index) => (
                    <div key={state} className="bg-white rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:scale-105 transform">
                        <div className="flex items-center justify-center mb-4">
                            <MapPinIcon size={24} className={`mr-2 ${index === 0 ? 'text-indigo-500' : index === 1 ? 'text-emerald-500' : 'text-amber-500'}`} />
                            <p className="text-lg font-semibold text-gray-700">{state}</p>
                        </div>
                        <p className={`text-3xl font-bold ${index === 0 ? 'text-indigo-500' : index === 1 ? 'text-emerald-500' : 'text-amber-500'}`}>{series[index]}%</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DemoChart;
