import { countryPhonePrefixes } from "@/data";

const SelectCurrency = ({
  setSelectedCurrency,
  setCode,
}: {
  setSelectedCurrency: (currency: string) => void;

  setCode: (code: string) => void;
}) => {
  return (
    <select
      defaultValue="UGX"
      onChange={(e) => {
        setSelectedCurrency(e.target.value);
      }}
      className="bg-neutral-100 w-1/2 md:w-1/3 md:text-base cursor-pointer flex md:px-7 border text-sm px-2 border-neutral-500 rounded-md items-center justify-center h-full"
    >
      <option value="UGX">UGX</option>
      <option value="KES">KES</option>
    </select>
  );
};

export default SelectCurrency;
