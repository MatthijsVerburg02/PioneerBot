import React, { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

export default function ChartComponent() {
  const [chartData, setChartData] = useState(null);
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState(""); 
  const chartContainerRef = useRef(null); 
  const sensorColors = {
    temperature: { border: "rgba(255, 0, 0, 1)", background: "rgba(255, 0, 0, 0.1)" }, 
    humidity: { border: "rgba(0, 0, 255, 1)", background: "rgba(0, 0, 255, 0.1)" },
    light_intensity: { border: "rgba(0, 128, 0, 1)", background: "rgba(0, 128, 0, 0.1)" }, 
    co2: { border: "rgba(255, 165, 0, 1)", background: "rgba(255, 165, 0, 0.1)" }, 
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const sensor = localStorage.getItem("sensor") || "humidity";
        const location = parseInt(localStorage.getItem("location"), 10) || 1;
        const timestamp1 = localStorage.getItem("timestamp1");
        const timestamp2 = localStorage.getItem("timestamp2");

        const response = await fetch(
          `/api/getData?sensor=${sensor}&location=${location}&timestamp1=${timestamp1}&timestamp2=${timestamp2}`
        );
        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          setAnnouncement("No data available to display.");
          setChartData(null);
          setOptions(null);
          setLoading(false);
          return;
        }

        const labels = data.map((item) => new Date(item.timestamp).toLocaleString());
        const values = data.map((item) => item[sensor]);

        const minValue = Math.min(...values) - (Math.max(...values) - Math.min(...values)); 
        const maxValue = Math.max(...values) + Math.max(...values) - Math.min(...values); 

        setChartData({
          labels,
          datasets: [
            {
              label: `${sensor}`,
              data: values,
              borderColor: sensorColors[sensor]?.border || "rgba(0, 0, 0, 1)",
              backgroundColor: sensorColors[sensor]?.background || "rgba(0, 0, 0, 0.1)",
              fill: true,
              tension: 0.3,
              pointRadius: 3,
              yAxisID: "y-axis-left",
              fill: false,
            },
          ],
        });

        setOptions({
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
          },
          scales: {
            x: {
              type: "category",
              title: {
                display: true,
                text: "Timestamp",
              },
            },
            "y-axis-left": {
              type: "linear",
              position: "left",
              beginAtZero: true,
              min: minValue,
              max: maxValue,
            },
            "y-axis-right": {
              type: "linear",
              position: "right",
              beginAtZero: true,
              min: minValue,
              max: maxValue,
              grid: {
                drawOnChartArea: false, 
              },
            },
          },
        });

        setAnnouncement(""); 
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
        setAnnouncement("Failed to fetch chart data.");
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (chartData && chartContainerRef.current) {
      const container = chartContainerRef.current;
      container.scrollLeft = container.scrollWidth;
    }
  }, [chartData]);

  if (loading) return <p>Loading chart...</p>;

  return (
    <div>
      {announcement ? (
        <p>{announcement}</p>
      ) : (
        <div ref={chartContainerRef} style={{ width: "100%", overflowX: "auto" }}>
          <div style={{ height: "60vh" }}>
            <Line data={chartData} options={options} />
          </div>
        </div>
      )}
    </div>
  );
}
