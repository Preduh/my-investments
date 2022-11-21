import { Chart } from "react-google-charts";
import { v4 as uuid } from "uuid";
import { useForm, Controller } from "react-hook-form";
import { api } from "../utils/api";
import { useEffect, useState } from "react";
// @ts-expect-error
import CurrencyInput from "react-currency-input";
import { Asset, assets, SelectCode } from "../components/SelectCode";

interface Investment {
  id: string;
  type: string;
  name: string;
  code: string;
  totalNumber: number;
  totalValue: number;
  createdAt: string;
  updatedAt: string;
}

interface Type {
  id: string;
  name: string;
  amount: number;
}

interface CreateFormData {
  asset: Asset;
  totalNumber: number;
  totalValue: string;
}

const typeOptions = {
  title: "Tipos de ativos",
  is3D: false,
  slices: [{ color: "#f0bd44" }, { color: "#8372f2" }, { color: "#e77577" }],
};

const assetOptions = {
  title: "Ativos",
  is3D: false,
};

export default function Home() {
  const { control, handleSubmit, register } = useForm<CreateFormData>({
    defaultValues: {
      asset: assets[0],
    },
  });
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [types, setTypes] = useState<Type[]>([]);

  const onSubmit = async (data: CreateFormData) => {
    const { data: responseData } = await api.post("/investment", {
      type: data.asset.type,
      name: data.asset.name,
      code: data.asset.code,
      totalNumber: Number(data.totalNumber),
      totalValue: Number(data.totalValue.replace("R$ ", "").replace(",", ".")),
    });

    console.log(responseData);
  };

  useEffect(() => {
    api.get<Investment[]>("/investment").then(({ data }) => {
      setInvestments(data);
    });
  }, []);

  useEffect(() => {
    let sharesNumber = 0;
    let fiisNumber = 0;
    let internationalNumber = 0;

    investments.forEach((investment) => {
      if (investment.type === "share") sharesNumber += investment.totalValue;
    });

    investments.forEach((investment) => {
      if (investment.type === "fiis") fiisNumber += investment.totalValue;
    });

    investments.forEach((investment) => {
      if (investment.type === "international")
        internationalNumber += investment.totalValue;
    });

    setTypes([
      { id: uuid(), name: "Ações", amount: sharesNumber },
      { id: uuid(), name: "FIIs", amount: fiisNumber },
      { id: uuid(), name: "International", amount: internationalNumber },
    ]);
  }, [investments]);

  const typeData = [
    ["Investments", "Total value per investment"],
    ...types.map((type) => {
      return [type.name, type.amount];
    }),
  ];

  const assetData = [
    ["Investments", "Total value per investment"],
    ...investments.map((investment) => {
      return [investment.code, investment.totalValue];
    }),
  ];

  return (
    <div className="flex flex-col lg:flex-row h-full lg:h-screen items-center justify-center py-8 space-y-8 md:space-y-0">
      <div className="w-full h-full flex items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md h-full rounded-xl flex flex-col items-center justify-center space-y-8 px-8"
        >
          <h2 className="text-zinc-800 font-bold text-xl">
            Adicionar investimento
          </h2>

          <div className="w-full flex flex-col">
            <label htmlFor="asset" className="text-zinc-700 font-medium mb-1">
              Ativo
            </label>
            <Controller
              control={control}
              name="asset"
              render={({ field }) => {
                return (
                  <SelectCode onChange={field.onChange} value={field.value} />
                );
              }}
            />
          </div>

          <div className="w-full flex flex-col">
            <label
              htmlFor="totalNumber"
              className="text-zinc-700 font-medium mb-1"
            >
              Quantidade
            </label>
            <input
              min={0}
              placeholder="Ex: 1"
              type="number"
              className="placeholder:normal-case px-2 w-full h-12 border border-zinc-300 text-zinc-600 focus:outline-2 focus:outline-blue-500"
              {...register("totalNumber")}
            />
          </div>

          <div className="w-full flex flex-col">
            <label
              htmlFor="totalValue"
              className="text-zinc-700 font-medium mb-1"
            >
              Valor
            </label>

            <Controller
              name="totalValue"
              control={control}
              render={({ field }) => {
                return (
                  <CurrencyInput
                    prefix="R$ "
                    onChangeEvent={field.onChange}
                    decimalSeparator=","
                    thousandSeparator="."
                    type="text"
                    id={field.name}
                    value={field.value}
                    placeholder="R$ 0,00"
                    className="uppercase px-2 w-full h-12 border border-zinc-300 text-zinc-600 focus:outline-2 focus:outline-blue-500"
                  />
                );
              }}
            />
          </div>

          <button
            className="w-full bg-blue-500 hover:bg-blue-600 transition-colors h-12 text-white font-medium text-lg"
            type="submit"
          >
            Adicionar
          </button>
        </form>
      </div>

      <div className="flex flex-col h-full w-full">
        <div className="w-full h-full flex items-center justify-center">
          <Chart
            className="w-screen md:w-[32rem] lg:w-[36rem]"
            chartType="PieChart"
            height="300px"
            data={typeData}
            options={typeOptions}
            formatters={[
              {
                type: "NumberFormat",
                column: 1,
                options: {
                  prefix: "R$ ",
                  decimalSymbol: ",",
                },
              },
            ]}
          />
        </div>

        <div className="w-full h-full flex items-center justify-center">
          <Chart
            className="w-screen md:w-[32rem] lg:w-[36rem]"
            chartType="PieChart"
            height="300px"
            data={assetData}
            options={assetOptions}
            formatters={[
              {
                type: "NumberFormat",
                column: 1,
                options: {
                  prefix: "R$ ",
                  decimalSymbol: ",",
                },
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
