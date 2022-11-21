import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import {v4 as uuid} from 'uuid'

export interface Asset {
  id: string
  type: string
  name: string
  code: string
}

interface SelectCodeProps {
  onChange: Dispatch<SetStateAction<Asset>>
  value: Asset
}

export const assets: Asset[] = [
  { id: uuid(), name: "ISHARES IBOVESPA FUNDO DE ÍNDICE", code: 'BOVA11', type: 'shares' },
  { id: uuid(), name: "ISHARES S&P 500 FDO INV COTAS FDO INDICE", code: 'IVVB11', type: 'international' },
];

export function SelectCode({ onChange, value }: SelectCodeProps) {
  const [query, setQuery] = useState("");

  const filteredAssets =
    query === ""
      ? assets
      : assets.filter((asset) =>
          asset.code
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <div className="w-full">
      <Combobox value={value} onChange={onChange}>
        <div className="relative mt-1">
          <div>
            <Combobox.Input
              className="placeholder:normal-case px-2 w-full h-12 border border-zinc-300 text-zinc-600 focus:outline-2 focus:outline-blue-500"
              displayValue={(asset: Asset) => asset?.code}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredAssets.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredAssets.map((asset) => (
                  <Combobox.Option
                    key={asset.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-blue-400 hover:cursor-pointer text-white" : "text-gray-900"
                      }`
                    }
                    value={asset}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {asset.code}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-blue-400 hover:cursor-pointer"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
