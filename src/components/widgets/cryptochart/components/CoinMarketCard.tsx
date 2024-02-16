import { FC, useState } from 'react';
import useAxios from '../hooks/useAxios';
import { ICoin } from '../types/coin';
import {
  compactCurrencyFormatter,
  currencyFormatter,
  percentageFormatter,
} from '../utils/formatter';
import { isPositivePercentage } from '../utils/helper';
import { ChartTimeRangeType } from '../types/common';
import { getFilterChartTimeRanges } from '../constants';
import { FilterChartTimeRange } from './FilterChartTimeRange';
import CoinMarketChart from './CoinMarketChart';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

const ErrorComponent: FC<{ message: string }> = ({ message }) => {
  return (
    <section className="flex h-full w-full items-center justify-center p-2">
      <div className="flex items-center justify-center text-red-500">
        <div className="text-xl">
          Coingecko API Request Failed due to <strong>{message}.</strong>
        </div>
      </div>
    </section>
  );
};

const CoinMarketCard: FC = () => {
  const currency = 'usd';
  const {
    isLoading,
    data: coin,
    refetch,
    error,
  } = useAxios<ICoin>(
    `/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
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
        <></>
        :
        <>
        <div className="flex items-start justify-between h-[22%]">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <img
                src={coin!.image.thumb}
                alt={coin!.name}
                className="h-6 w-6"
              />
              <div className="flex items-center justify-start gap-1">
                <div className="text-xl font-semibold">{coin!.name}</div>
                <div className="mt-1 text-base font-bold uppercase">
                  ({coin!.symbol})
                </div>
              </div>
            </div>
            <p className="text-3xl font-semibold">
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
                className={`${
                  isPositivePercentage(
                    coin!.market_data[selectedRange.pricePercentageId][
                      currency
                    ]
                  )
                    ? 'text-green-500'
                    : 'text-red-500'
                } font-semibold`}
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
        <div className="h-[13%] border-t border-black">
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
            <div className="flex flex-1 flex-col items-center justify-center gap-1 border-x border-black text-sm">
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

export default CoinMarketCard;
