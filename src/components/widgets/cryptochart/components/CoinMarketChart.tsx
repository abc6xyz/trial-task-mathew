import { FC, useMemo } from 'react';
import useAxios from '../hooks/useAxios';
import { dateFormatter } from '../utils/formatter';
import { convertDateMsToSecond } from '../utils/helper';
import { AreaChart } from './Charts/Area';
import { Skeleton } from '@/components/ui/skeleton';

interface IMarketChartResponse {
  prices: [number, number][];
}

const RenderChartElement: FC<{ coin: IMarketChartResponse; id: string }> = ({
  coin,
  id,
}) => {
  const coinChartData = useMemo(() => {
    const result = {
      labels: [] as Array<string>,
      data: [] as Array<number>,
    };
    coin.prices.forEach(([x, y]) => {
      result.labels.push(dateFormatter(x));
      result.data.push(+y.toFixed(2));
    });
    return result;
  }, [coin]);

  return (
    <AreaChart
      labels={coinChartData.labels}
      datasets={[
        {
          data: coinChartData.data,
          label: id.slice(0, 1).toUpperCase() + id.slice(1),
        },
      ]}
    />
  );
};

interface ICoinMarketChartProps {
  id: string;
  currency: string;
  from: number;
  to: number;
}

const CoinMarketChart: FC<ICoinMarketChartProps> = ({
  id,
  currency,
  from,
  to,
}) => {
  const params = new URLSearchParams();
  params.append('vs_currency', currency);
  params.append('from', convertDateMsToSecond(from).toString());
  params.append('to', convertDateMsToSecond(to).toString());

  const url = `/coins/${id}/market_chart/range?${params.toString()}`;
  const { data, isLoading } = useAxios<IMarketChartResponse>(url);

  if (isLoading) {
    return <Skeleton className="w-full h-full" />;
  }

  if (!data) return <div className="h-4/6 w-full" />;
  return <RenderChartElement coin={data} id={id} />;
};

export default CoinMarketChart;
