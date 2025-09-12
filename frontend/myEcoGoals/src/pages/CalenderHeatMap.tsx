import { type Habit } from "../types";

interface HeatmapData {
  date: string;
  streak: number;
}

interface CalendarHeatmapProps {
  habits: Habit[];
  data?: HeatmapData[];
}

const CalendarHeatmap = ({ habits, data = [] }: CalendarHeatmapProps) => {
  // ✅ Collect all completed dates from habits
  const allDates = habits.flatMap((h) => h.completedDates);

  // ✅ Generate last 30 days dynamically
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i)); // most recent last
    return d;
  });

  // ✅ Month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className="space-y-4 w-full max-w-2xl mx-auto">
      {/* Month labels row */}
      <div className="grid grid-cols-7 sm:grid-cols-14 text-xs text-gray-500 font-medium">
        {last30Days.map((date, i) => {
          const prev = last30Days[i - 1];
          const showMonth = i === 0 || date.getMonth() !== prev.getMonth();
          return (
            <div key={i} className="text-center col-span-1">
              {showMonth ? monthNames[date.getMonth()] : ""}
            </div>
          );
        })}
      </div>

      {/* Last 30 days grid */}
      <div className="grid grid-cols-7 sm:grid-cols-14 gap-1">
        {last30Days.map((date, i) => {
          const done = allDates.some(
            (d) => new Date(d).toDateString() === date.toDateString()
          );

          return (
            <div
              key={i}
              className={`aspect-square rounded-md flex items-center justify-center text-[10px] transition-colors duration-200
                ${
                  done
                    ? "bg-green-500 hover:bg-green-600 text-white shadow-sm"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-500"
                }`}
              title={`${date.toDateString()} ${
                done ? "✅ Habit completed" : "❌ No habit completed"
              }`}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>

      {/* Streak history */}
      <div>
        {data.length > 0 ? (
          <div className="grid grid-cols-7 gap-1">
            {data.map((item, idx) => (
              <div
                key={idx}
                className={`aspect-square rounded-md transition-colors duration-200
                  ${
                    item.streak >= 5
                      ? "bg-green-700"
                      : item.streak >= 3
                      ? "bg-green-500"
                      : item.streak > 0
                      ? "bg-green-300"
                      : "bg-gray-200"
                  }`}
                title={`${item.date} — Streak: ${item.streak}`}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm italic text-center">
            No streak history yet
          </p>
        )}
      </div>
    </div>
  );
};

export default CalendarHeatmap;
