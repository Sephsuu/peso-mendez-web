"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useEffect, useMemo, useState } from "react";
import { SectionLoader } from "@/components/ui/loader";
import { ReportService } from "@/services/report.service";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell,
} from "recharts";
import { FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";

function TabButton({ label, selected, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "px-3 py-2 text-sm font-semibold transition",
                selected
                    ? "text-primary px-4 rounded-full bg-blue-50"
                    : "text-slate-500 hover:text-slate-700",
            ].join(" ")}
        >
            {label}
        </button>
    );
}

function CitmunTable({ data }) {
    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
                <thead className="bg-slate-100">
                    <tr>
                        <th className="w-14 px-3 py-3 text-left font-extrabold text-slate-700">
                            #
                        </th>
                        <th className="px-3 py-3 text-left font-semibold text-slate-700">
                            City / Municipality
                        </th>
                        <th className="w-40 px-3 py-3 text-left font-semibold text-slate-700">
                            Total Count
                        </th>
                    </tr>
                </thead>

                <tbody className="bg-white">
                    {data.map((row, idx) => (
                        <tr
                            key={row?.citmun ?? idx}
                            className="border-t border-slate-100"
                        >
                            <td className="px-3 py-3 text-slate-700">
                                {idx + 1}
                            </td>
                            <td className="px-3 py-3 font-semibold text-slate-900">
                                {row?.citmun ?? "N/A"}
                            </td>
                            <td className="px-3 py-3 font-semibold text-slate-900">
                                {String(row?.total ?? 0)}
                            </td>
                        </tr>
                    ))}

                    {data.length === 0 && (
                        <tr>
                            <td
                                colSpan={3}
                                className="px-3 py-10 text-center text-slate-400"
                            >
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

function CitmunBarChart({ data }) {
    const chartData = useMemo(() => {
        return data.map((d) => ({
            name: d?.citmun ?? "N/A",
            total: Number(d?.total ?? 0),
        }));
    }, [data]);

    const minWidth = useMemo(() => {
        return Math.max(700, chartData.length * 120);
    }, [chartData.length]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) return null;

        return (
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">{label}</div>
                <div className="text-slate-700">
                    Total: <span className="font-bold">{payload[0].value}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="h-[280px] sm:h-[340px] md:h-[420px]">
                <div className="h-full overflow-x-auto">
                    <div style={{ width: `${minWidth}px`, height: "100%" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 10, right: 20, left: 10, bottom: 60 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="name"
                                    interval={0}
                                    angle={-35}
                                    textAnchor="end"
                                    height={70}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar
                                    dataKey="total"
                                    radius={[6, 6, 0, 0]}
                                    maxBarSize={44}
                                >
                                    {chartData.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill="#1c398e"
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="mt-3 text-xs text-slate-500">
                Tip: scroll sideways if there are many categories.
            </div>
        </div>
    );
}

export function CitmunDistribution() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [selectedTab, setSelectedTab] = useState("table");

    useEffect(() => {
        let mounted = true;

        async function run() {
            try {
                const res = await ReportService.getCitmunCounts();
                if (!mounted) return;
                setData(Array.isArray(res) ? res : []);
            } catch (e) {
                console.error("Citmun Chart Error:", e);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        run();
        return () => {
            mounted = false;
        };
    }, []);

    const handleExportPdf = () => {
        if (!data || data.length === 0) return;

        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("City/Municipality Report", 14, 20);

        const tableBody = data.map((row) => [
            row.citmun ?? "N/A",
            String(row.total ?? 0),
        ]);

        const pageWidth = doc.internal.pageSize.getWidth();
        const marginLeft = 14;
        const marginRight = 14;
        const tableWidth = pageWidth - marginLeft - marginRight;

        autoTable(doc, {
            startY: 30,
            head: [["City/Municipality", "Total Count"]],
            body: tableBody,
            theme: "grid",
            styles: {
                font: "helvetica",
                fontSize: 10,
                textColor: 0,
                cellPadding: 3,
                lineWidth: 0.3,
                lineColor: [0, 0, 0],
            },
            headStyles: {
                fillColor: [230, 230, 230],
                textColor: 0,
                fontStyle: "bold",
                halign: "center",
            },
            bodyStyles: {
                fillColor: [255, 255, 255],
            },
            columnStyles: {
                0: { cellWidth: tableWidth * 0.75, halign: "left" },
                1: { cellWidth: tableWidth * 0.25, halign: "center" },
            },
            margin: { left: marginLeft, right: marginRight },
        });

        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(9);

        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(
                `${i}/${pageCount}`,
                pageWidth / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: "center" }
            );
        }

        doc.save("city-municipality-report.pdf");
    };

    if (loading) return <SectionLoader />;

    if (!data || data.length === 0) {
        return (
            <div className="text-center text-slate-500 py-10">
                No city / municipality data available
            </div>
        );
    }

    return (
        <section className="w-full">
            <div className="px-2 py-1">
                <h2 className="text-lg font-semibold text-slate-900">
                    City / Municipality Distribution
                </h2>
            </div>

            <div className="px-2 mt-2 flex items-end gap-3 flex-wrap">
                <TabButton
                    label="Table"
                    selected={selectedTab === "table"}
                    onClick={() => setSelectedTab("table")}
                />
                <TabButton
                    label="Graph"
                    selected={selectedTab === "graph"}
                    onClick={() => setSelectedTab("graph")}
                />
                <Button
                    type="button"
                    onClick={handleExportPdf}
                    className="ml-2 inline-flex items-center gap-2 bg-primary text-sm font-bold text-white shadow-sm hover:opacity-90 active:scale-[0.99]"
                    variant="sm"
                >
                    <FileUp /> Export PDF
                </Button>
            </div>

            <div className="mt-4 px-2">
                {selectedTab === "table" && <CitmunTable data={data} />}
                {selectedTab === "graph" && <CitmunBarChart data={data} />}
            </div>
        </section>
    );
}
