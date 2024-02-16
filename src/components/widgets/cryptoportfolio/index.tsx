import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Mobula } from "mobula-api-sdk";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useEffect, useState, useTransition } from "react";
import { useAccount } from "wagmi";

const EChart = dynamic(() => import("./charts"), {
  ssr: false,
});

export const CryptoPotfolioWidget = () => {
  const { theme } = useTheme()
  const [portfolio, setPortfolio] = useState([]);
  const [balanceHistory, setBalanceHistory] = useState([]);
  const [ isLoading, startTransition ] = useTransition()
  const { isConnected, address } = useAccount()
  const mobula = new Mobula(process.env.MOBULA_API_KEY || "");

  const fetchData = () => {
    if (address) {
      startTransition(async () => {
        mobula
          .fetchWalletHistoryBalance({
            wallet: address,
          })
          .then((res: any) => {
            if (res.body) {
              const r = JSON.parse(res.body);
              setBalanceHistory(r.data);
            }
          });

        mobula.fetchWalletHoldings({ wallet: address }).then((res: any) => {
          if (res.body) {
            const r = JSON.parse(res.body);
            console.log(r);
            setPortfolio(r.data);
          }
        });
      })
    }
  };

  useEffect(() => {
    if(isConnected) fetchData();
  }, [address]);

  return (
    <ScrollArea className="w-full h-full">
      {isConnected?
      <>
      <div className="w-full">
        <div>
          <div className="p-3">
            <strong>
              Balance:{" "}
              {(portfolio as any)?.total_wallet_balance?.toFixed(2)} USD
            </strong>
          </div>
        </div>
        {!isLoading ? (
        <div className="p-2 w-full">
          <EChart
            data={
              (balanceHistory as any)?.balance_history || [
                [124343, 1434],
                [126434, 1343],
                [127434, 1675],
                [128434, 1233],
                [129434, 1943],
                [130434, 1343],
                [131434, 1675],
                [132434, 1233],
                [133434, 1943],
              ]
            }
            timeframe="ALL"
            width={"100%"}
            height={"400px"}
            textColor={theme==='dark'?"rgba(255, 255, 255, 0.8)":"rgba(0, 0, 0, 0.8)"}
          />
        </div>
        ) : (
          "Loading..."
        )}
      </div>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Name</TableCell>
            <TableCell>USD Balance</TableCell>
            <TableCell>Token Amount</TableCell>
            <TableCell>Price Bought</TableCell>
            <TableCell>Price</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(portfolio as any)?.assets?.map((asset: any) => (
            <TableRow key={asset?.asset?.name}>
              <TableCell className="p-1">
                <div className='flex justify-center'>
                  <img
                    src={asset?.asset?.logo}
                    alt={asset?.asset?.name}
                    className="h-6 w-6"
                  />
                </div>
              </TableCell>
              <TableCell>
                {asset?.asset?.symbol}
              </TableCell>
              <TableCell>
                {asset?.estimated_balance?.toFixed(2)}
              </TableCell>
              <TableCell>
                  {asset?.token_balance?.toFixed(2) +
                  " " +
                  asset?.asset?.symbol}
              </TableCell>
              <TableCell>
                {asset?.price_bought?.toFixed(2)}
              </TableCell>
              <TableCell>
                {asset?.price?.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </>
      :
      <>Please connect your wallet...</>
      }
    </ScrollArea>
  );
};
