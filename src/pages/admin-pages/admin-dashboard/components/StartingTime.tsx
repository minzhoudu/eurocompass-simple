import { useState } from "react";

export type StartingTimeId = "krusevac" | "beograd";

type StartingTimeProps = {
  id: StartingTimeId;
  title: string;
  times?: string[];
  isLoading: boolean;
  handleAddTime: (id: StartingTimeId, time: string) => void;
  handleDeleteTime: (id: StartingTimeId, time: string) => void;
};

export const StartingTime = ({
  id,
  title,
  times,
  isLoading,
  handleAddTime,
  handleDeleteTime,
}: StartingTimeProps) => {
  const [newTime, setNewTime] = useState("");

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-bold">{title}</h2>

      <div className="flex flex-col gap-2">
        {times && times.length ? (
          times.sort().map((time, idx) => (
            <div className="flex items-center justify-between" key={time + idx}>
              <p className="rounded-md bg-primaryBlue px-2 py-1 text-white">
                {time}
              </p>
              <button
                onClick={() => handleDeleteTime(id, time)}
                className="rounded-md border border-red-600 bg-white px-2 py-1 text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-red-600"
                disabled={isLoading}
              >
                Obriši
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-primaryBlue">Nema polaznih vremena.</p>
        )}
      </div>

      <div className="flex justify-between">
        <input
          type="time"
          className="rounded-md p-2"
          onChange={(e) => setNewTime(e.target.value)}
        />
        <button
          onClick={() => handleAddTime(id, newTime)}
          className="rounded-md border border-primaryBlue bg-white p-2 text-primaryBlue transition-colors hover:bg-primaryBlue hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-primaryBlue"
          disabled={!newTime || isLoading}
        >
          Dodaj
        </button>
      </div>
    </div>
  );
};
