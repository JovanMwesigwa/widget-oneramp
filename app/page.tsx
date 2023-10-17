"use client";

import { Callout, Container, Flex } from "@radix-ui/themes";
import Image from "next/image";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import Tabs from "./Tabs";

import { countryPhonePrefixes } from "@/data";
import { OneRamp } from "@oneramp/sdk";
import { ethers } from "ethers";
import { useEffect, useRef, useState } from "react";
import cUSDToken from "../assets/tokens/cusd.png";
import ExchangeRates from "./ExchangeRates";
import SelectCurrency from "./SelectCurrency";
import Spinner from "./Spinner";

const clientPub = process.env.NEXT_ONERAMP_CLIENT!;
const secretKey = process.env.NEXT_ONERAMP_SECRET!;

export default function Home() {
  const [amount, setAmount] = useState<number | string>(1);
  const [selectedCurrency, setSelectedCurrency] = useState("UGX");
  const [phone, setPhone] = useState<string>("");
  const [code, setCode] = useState(countryPhonePrefixes["UGX"]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [provider, setProvider] = useState<any>();

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth", // Optional, for a smooth scrolling animation
      });
    }

    // Ensure MiniPay provider is available
    if (window.ethereum && window.ethereum.isMiniPay) {
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      const provider = new ethers.BrowserProvider(window.ethereum);

      setProvider(provider);
    } else {
      console.error("MiniPay provider not detected");
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (!phone || phone.length < 10) {
        setError(
          "Invalid entries, Please verify that you've entered the correct phone number and amount."
        );
      }

      const { ethereum } = window;

      const provider = new ethers.BrowserProvider(ethereum);

      const signer = await provider.getSigner();

      const oneramp = new OneRamp(
        "celo",
        clientPub,
        secretKey,
        provider,
        signer
      );

      const result = await oneramp.offramp("stable", Number(amount), phone);

      if (result.success) {
        setLoading(false);
        setSuccess(true);
      } else {
        setLoading(false);
        setError("Transaction approval failed!");
      }
    } catch (error) {
      setLoading(false);
      setError("Process failed!, something went wrong");
    }
  };

  return (
    <div className="h-screen w-full overflow-y-auto p-5" ref={containerRef}>
      <Container
        size="1"
        p="3"
        className=" h-full flex items-center justify-center"
      >
        <form onSubmit={handleSubmit}>
          {success && (
            <Callout.Root color="green" mb="3">
              <Callout.Text>
                🎉 Success! Your withdraw to mobile money was successful
              </Callout.Text>
            </Callout.Root>
          )}

          {error && (
            <Callout.Root color="red" mb="3">
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          )}

          <Flex gap="7">
            <Tabs />
          </Flex>

          <div className="flex mt-14 flex-1 ">
            <div className="flex flex-row items-center w-full gap-4">
              <div className="bg-neutral-100 flex w-1/3 px-7 border gap-4 border-neutral-500 rounded-md items-center justify-center h-full">
                <Image
                  src={cUSDToken}
                  style={{ width: 25, height: 25 }}
                  alt="cUSD token"
                />
                <h3 className="hidden md:block font-medium text-sm md:text-base">
                  cUSD
                </h3>
              </div>
              <input
                type="number"
                className="w-full border bg-neutral-100 p-4 rounded-md border-neutral-500"
                onBlur={() => setError("")}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full flex flex-col items-center justify-center h-12 mt-3">
            <SlArrowUp />
            <SlArrowDown />
          </div>

          <p className="text-center mb-4 text-xs md:text-base">
            Select your currency
          </p>
          <div className="flex  flex-1 ">
            <div className="flex flex-row items-center w-full gap-4">
              <SelectCurrency
                setSelectedCurrency={setSelectedCurrency}
                setCode={setCode}
              />

              <input
                type="tel"
                className="w-full border bg-neutral-100 p-4 rounded-md border-neutral-500"
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => setError("")}
              />
            </div>
          </div>

          <ExchangeRates
            currency={selectedCurrency}
            token="cUSD"
            amount={Number(amount)}
          />

          <button
            // onClick={handleSubmit}
            type="submit"
            disabled={loading || !phone || Number(amount) <= 0}
            className={`w-full flex items-center justify-center p-4 ${
              loading || !phone || Number(amount) <= 0
                ? "bg-neutral-200"
                : "bg-black"
            }  text-sm md:text-base rounded-full text-white font-bold`}
          >
            {loading ? <Spinner /> : "Confirm"}
          </button>
        </form>
      </Container>

      <div className="w-full flex items-center justify-center">
        <p className="mr-1 font-light text-sm md:text-base">Powered by</p>
        <Image
          priority
          src="/logo-light.svg"
          height={60}
          width={60}
          alt="By oneramp.io"
        />
      </div>
    </div>
  );
}
