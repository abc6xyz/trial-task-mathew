import { FC, useEffect, useState } from 'react';
import useAxios from './hooks/useAxios';
import { ICoin } from './types/coin';
import {
  compactCurrencyFormatter,
  currencyFormatter,
  percentageFormatter,
} from './utils/formatter';
import { isPositivePercentage } from './utils/helper';
import { ChartTimeRangeType } from './types/common';
import { getFilterChartTimeRanges } from './constants';
import { FilterChartTimeRange } from './components/FilterChartTimeRange';
import CoinMarketChart from './components/CoinMarketChart';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const ErrorComponent: FC<{ message: string }> = ({ message }) => {
  return (
    <section className="flex h-full w-full items-center justify-center text-red-500 p-2 overflow-hidden">
      <div className="text-sm">
        Coingecko API Request Failed due to <strong>{message}.</strong>
      </div>
    </section>
  );
};

interface CryptoChartProps {
  coinId: string | null;
}

export const CryptoChartWidget: React.FC<CryptoChartProps> = ({coinId}) => {
  const currency = 'usd';
  const { theme } = useTheme()
  const {
    isLoading,
    data: coin,
    refetch,
    error,
  } = useAxios<ICoin>(
    `/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
  );

  const currentDateTime = new Date().getTime();
  const [selectedRange, setSelectedRange] = useState<ChartTimeRangeType>(
    getFilterChartTimeRanges()[1]
  );

  if (!isLoading && error) return <ErrorComponent message={error.message} />;
  if (!isLoading && !coin) return null;

  return (
    <section className="w-full h-full">
      {
        isLoading ?
        <div className='p-5'>
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
        :
        <>
        <div className="flex items-start justify-between h-[22%] p-2">
          <div className="flex flex-col gap-1 h-full">
            <div className="flex gap-2">
              <img
                src={coin!.image.thumb}
                alt={coin!.name}
                className="h-6 w-6"
              />
              <div className="text-md font-semibold">{coin!.name}</div>
            </div>
            <p className="text-2xl font-semibold">
              {currencyFormatter(
                coin!.market_data.current_price[currency],
                currency
              )}
            </p>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <p>
                Gain/loss{' '}
                <span className="lowercase">{selectedRange.label}</span>:
              </p>
              <p
                className={cn("font-semibold",
                    isPositivePercentage(
                      coin!.market_data[selectedRange.pricePercentageId][
                        currency
                      ]
                    )
                    ? 'text-green-500'
                    : 'text-red-500'
                  )}
              >
                {isPositivePercentage(
                  coin!.market_data[selectedRange.pricePercentageId][currency]
                )
                  ? '+'
                  : ''}
                {percentageFormatter(
                  coin!.market_data[selectedRange.pricePercentageId][currency]
                )}
              </p>
            </div>
          </div>
          <FilterChartTimeRange
            selectedRange={selectedRange}
            setSelectedRange={(value) => {
              setSelectedRange(value);
              refetch();
            }}
          />
        </div>
        <div className='w-full h-[65%] flex items-center'>
          <CoinMarketChart
            id={coin!.id}
            currency={currency}
            from={currentDateTime - selectedRange.value}
            to={currentDateTime}
          />
        </div>
        <div className={cn("h-[13%] border-t", theme==='dark'?"border-white":"border-black")}>
          <div className="flex h-full">
            <div className="flex flex-1 flex-col items-center justify-center gap-1 text-sm">
              <div className="whitespace-nowrap text-gray-400">Market Cap</div>
              <div className="font-bold">
                <div
                  className={
                    isPositivePercentage(
                      coin!.market_data.market_cap_change_percentage_24h
                    )
                      ? 'arrow-up'
                      : 'arrow-down'
                  }
                >
                  {compactCurrencyFormatter(
                    coin!.market_data.market_cap[currency],
                    currency
                  )}
                </div>
              </div>
            </div>
            <div className={cn("flex flex-1 flex-col items-center justify-center gap-1 border-x text-sm", theme==='dark'?"border-white":"border-black")}>
              <div className="whitespace-nowrap text-gray-400">Market Cap Rank</div>
              <div className="font-bold">
                {`#${coin!.market_data.market_cap_rank}`}
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-1 text-sm">
              <div className="whitespace-nowrap text-gray-400">Total Volume</div>
              <div className="font-bold">
                {compactCurrencyFormatter(
                  coin!.market_data.total_volume[currency],
                  currency
                )}
              </div>
            </div>
          </div>
        </div>
        </>
      }
    </section>
  );
};
