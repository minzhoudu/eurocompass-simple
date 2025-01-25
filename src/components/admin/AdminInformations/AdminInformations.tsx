import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../../../config/axiosInstance";
import { Information, InformationResponse } from "../../../shared";

export const AdminInformations = () => {
  const { data, refetch } = useQuery({
    queryKey: ["information"],
    queryFn: async () => {
      const { data } = await axios.get<InformationResponse>("/information");
      return data;
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["updateInformation"],
    mutationFn: async (updatedInfo: Information) => {
      await axios.patch("/information", updatedInfo);
    },
    onSuccess: () => {
      refetch();
    },
  });

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate({
      id: 1,
      regularPrice: e.currentTarget.regularPrice.value,
      roundtripPrice: e.currentTarget.roundtripPrice.value,
      importantInfo: data?.info?.importantInfo || [],
    });
  };

  return (
    <div className="flex h-[95%] w-full flex-col items-center justify-center">
      <form
        onSubmit={onFormSubmit}
        className="flex w-[500px] flex-col gap-5 rounded-xl border-2 border-primaryBlue p-6"
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
        </div>

        <button className="self-center rounded-lg border border-primaryBlue px-4 py-2 font-semibold text-primaryBlue transition-colors hover:bg-primaryBlue hover:text-white">
          Sačuvaj promene
        </button>
      </form>
    </div>
  );
};
