import { useMutation, useQuery } from "@tanstack/react-query";
import { AiOutlineLoading } from "react-icons/ai";
import axios from "../../../config/axiosInstance";
import { InformationResponse, UpdateInformationDto } from "../../../shared";

export const AdminInformations = () => {
  const { data, refetch } = useQuery({
    queryKey: ["information"],
    queryFn: async () => {
      const { data } = await axios.get<InformationResponse>("/information");
      return data;
    },
    staleTime: 1000 * 60 * 5
  });

  const { mutate, isError, isPending } = useMutation({
    mutationKey: ["updateInformation"],
    mutationFn: async (updatedInfo: UpdateInformationDto) => {
      await axios.patch("/information", updatedInfo);
    },
    onSuccess: () => {
      refetch();
    },
  });

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const importantInfoArray = (
      e.currentTarget.importantInfo.value as string
    ).split(",\n");

    mutate({
      id: 1,
      regularPrice: e.currentTarget.regularPrice.value,
      roundtripPrice: e.currentTarget.roundtripPrice.value,
      importantInfo: importantInfoArray,
    });
  };

  const importantInformations = data?.info?.importantInfo.join(",\n");

  return (
    <div className="flex h-[95%] w-full flex-col items-center justify-center bg-gray-400">
      <form
        onSubmit={onFormSubmit}
        className="flex w-[500px] flex-col gap-5 rounded-xl border-2 border-primaryBlue bg-white p-6"
      >
        <div className="rounded-lg bg-primaryBlue p-5 text-center">
          <h1 className="font-bold text-white">Configuracija informacije</h1>
        </div>

        <div className="flex flex-col gap-5 px-3">
          <div className="flex items-center justify-between">
            <label htmlFor="regularPrice" className="text-lg">
              Cena redovne karte:
            </label>
            <div>
              <input
                type="text"
                id="regularPrice"
                name="regularPrice"
                className="rounded-md border border-primaryBlue p-1 text-center"
                defaultValue={data?.info?.regularPrice}
              />
              <span className="ml-1">RSD</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="roundtripPrice" className="text-lg">
              Cena povratne karte:
            </label>
            <div>
              <input
                type="text"
                id="roundtripPrice"
                name="roundtripPrice"
                className="rounded-md border border-primaryBlue p-1 text-center"
                defaultValue={data?.info?.roundtripPrice}
              />
              <span className="ml-1">RSD</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <label htmlFor="importantInfo" className="text-lg">
              Važne informacije:
            </label>
            <div className="flex w-full flex-col">
              <textarea
                id="importantInfo"
                name="importantInfo"
                className="w-full rounded-md border border-primaryBlue px-2 py-1"
                rows={
                  data?.info?.importantInfo.length &&
                  data?.info?.importantInfo.length > 3
                    ? data?.info?.importantInfo.length
                    : 4
                }
                defaultValue={importantInformations}
              />
              <p className="mt-2 self-center rounded-lg bg-primaryBlue px-3 py-1 text-center text-xs font-semibold text-green-400">
                Nakon svake nove informacije (osim poslednje) morate staviti
                zarez
              </p>
              <p className="mt-1 self-center rounded-lg bg-primaryBlue px-3 py-1 text-center text-xs font-semibold text-green-400">
                Svaka nova informacija mora biti u novom redu.
              </p>
            </div>
          </div>
        </div>

        <button
          disabled={isPending}
          className="flex items-center gap-5 self-center rounded-lg border border-primaryBlue px-4 py-2 font-semibold text-primaryBlue transition-colors hover:bg-primaryBlue hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-primaryBlue"
        >
          SAČUVAJ PROMENE{" "}
          {isPending && <AiOutlineLoading className="animate-spin" />}
        </button>

        {isError && (
          <p className="animate-bounce text-center font-bold text-red-500">
            Došlo je do greške pri čuvanju podataka
          </p>
        )}
      </form>
    </div>
  );
};
