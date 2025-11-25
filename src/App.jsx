import { useState } from "react";

export default function App() {
  const [cityInput, setCityInput] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!cityInput) return;

    setLoading(true);

    const geo = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${cityInput}&count=1`
    ).then((r) => r.json());

    const lat = geo?.results?.[0]?.latitude;
    const lon = geo?.results?.[0]?.longitude;

    const result = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
    ).then((r) => r.json());

    setWeather({ ...result, city: geo.results[0] });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#eef1f6] flex flex-col items-center px-5 py-10 text-gray-700">
      <h1 className="text-4xl font-extrabold mb-8 tracking-wide text-gray-800">
        Weather App
      </h1>

      <div
        className="flex w-full max-w-xl bg-[#eef1f6] rounded-3xl overflow-hidden 
                      shadow-[6px_6px_15px_#cdd1d8,-6px_-6px_15px_#ffffff]"
      >
        <input
          className="flex-1 bg-transparent px-5 py-3 outline-none text-lg"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          placeholder="Search a city..."
        />

        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-[#eef1f6] hover:brightness-95 transition 
                     shadow-[4px_4px_10px_#cdd1d8,-4px_-4px_10px_#ffffff] font-semibold cursor-pointer"
        >
          Search
        </button>
      </div>

      {loading && (
        <p className="mt-6 text-blue-600 text-lg animate-pulse">
          Loading weather…
        </p>
      )}

      {weather && (
        <>
          <div
            className="w-full max-w-xl mt-10 bg-white p-8 rounded-3xl 
                          shadow-lg border border-gray-200"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-6xl font-bold text-[#1e40af]">
                  {weather.current.temperature_2m}°C
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Feels like {weather.current.apparent_temperature}°C
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xl font-semibold text-gray-800">
                {weather.city.name}, {weather.city.country}
              </p>
              <p className="text-sm text-gray-500">Updated just now</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-7">
              <div className="bg-[#f4f6fa] p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-500">HUMIDITY</p>
                <p className="text-xl font-semibold text-[#1e40af]">
                  {weather.current.relative_humidity_2m}%
                </p>
              </div>

              <div className="bg-[#f4f6fa] p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-500">WIND</p>
                <p className="text-xl font-semibold text-[#1e40af]">
                  {weather.current.wind_speed_10m} km/h
                </p>
              </div>

              <div className="bg-[#f4f6fa] p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-500">FEELS LIKE</p>
                <p className="text-xl font-semibold text-[#1e40af]">
                  {weather.current.apparent_temperature}°C
                </p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-xl mt-10">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Upcoming Forecast
            </h3>

            <div className="space-y-4">
              {weather.daily.time.map((day, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 p-4 rounded-xl shadow-md 
                  flex justify-between items-center hover:bg-[#f7f9fc] transition"
                >
                  <p className="text-sm text-gray-500">
                    {new Date(day).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>

                  <div className="text-right">
                    <p className="text-xl font-bold text-[#1e40af]">
                      {weather.daily.temperature_2m_max[i]}°C
                    </p>
                    <p className="text-sm text-gray-500">
                      {weather.daily.temperature_2m_min[i]}°C
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
