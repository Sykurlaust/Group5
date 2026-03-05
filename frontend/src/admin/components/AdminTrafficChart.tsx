import type { ApexOptions } from "apexcharts"
import ReactApexChart from "react-apexcharts"

type AdminTrafficChartProps = {
  title: string
}

const options: ApexOptions = {
  chart: {
    fontFamily: "Space Grotesk, sans-serif",
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  colors: ["#047857"],
  dataLabels: { enabled: false },
  grid: {
    borderColor: "#e5e7eb",
    strokeDashArray: 4,
  },
  stroke: {
    curve: "smooth",
    width: 3,
  },
  xaxis: {
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    labels: { style: { colors: "#6b7280" } },
  },
  yaxis: {
    labels: { style: { colors: "#6b7280" } },
  },
}

const series = [
  {
    name: "Visits",
    data: [34, 48, 39, 67, 52, 71, 64],
  },
]

const AdminTrafficChart = ({ title }: AdminTrafficChartProps) => {
  return (
    <section className="flex h-[413px] w-full flex-col overflow-hidden rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <h2 className="text-lg font-semibold text-[#1f1f1f]">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">Weekly traffic trend for this dashboard.</p>
      <div className="mt-4 min-h-0 flex-1">
        <ReactApexChart height="100%" options={options} series={series} type="line" />
      </div>
    </section>
  )
}

export default AdminTrafficChart
