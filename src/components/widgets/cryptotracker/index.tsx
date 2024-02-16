import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type ICoin = {
  id                                  : string,
  symbol                              : string,
  name                                : string,
  image                               : string,
  current_price                       : number,
  market_cap                          : number,
  market_cap_rank                     : number,
  fully_diluted_valuation             : number,
  total_volume                        : number,
  high_24h                            : number,
  low_24h                             : number,
  price_change_24h                    : number,
  price_change_percentage_24h         : number,
  market_cap_change_24h               : number,
  market_cap_change_percentage_24h    : number,
  circulating_supply                  : number,
  total_supply                        : number,
  max_supply                          : number,
  ath                                 : number,
  ath_change_percentage               : number,
  ath_date                            : string,
  atl                                 : number,
  atl_change_percentage               : number,
  atl_date                            : string,
  roi                                 : null,
  last_updated                        : string
}

export function CryptoTrakerWidget() {
  const [coins, setCoins] = useState<ICoin[] | null>([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
      ).then(res => {
        setCoins(res.data);
      }).catch(error => console.log(error));
    }, 5000); // Interval runs every 5 seconds

    // Clean up the interval when the component is unmounted
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <ScrollArea className="h-full w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Change</TableHead>
            <TableHead className="text-right">Mkt Cap</TableHead>
          </TableRow>
        </TableHeader>
        {
          coins?
          <TableBody>
            {coins?.map((coin) => (
              <TableRow key={coin.id}>
                <TableCell className='p-1'>
                  <div className='flex justify-center'>
                    <img
                      key={coin.id} 
                      src={coin.image}
                      alt={coin.symbol}
                      className='h-6 w-6'
                    />
                  </div>
                </TableCell>
                <TableCell>{coin.name}</TableCell>
                <TableCell className='uppercase'>{coin.symbol}</TableCell>
                <TableCell>${coin.current_price}</TableCell>
                <TableCell className={cn(coin.price_change_percentage_24h<0?"text-red-500":"text-green-500")}>{coin.price_change_percentage_24h}</TableCell>
                <TableCell className="text-right">{coin.market_cap}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          :
          <></>
        }
        <TableFooter>
        </TableFooter>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
