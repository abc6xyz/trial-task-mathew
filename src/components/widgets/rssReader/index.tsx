import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import React, { useState, useEffect } from 'react';
import Parser from 'rss-parser';

interface RssItem {
  enclosure: {
    url: string;
  };
  guid: string;
  link: string;
  title: string;
  content: string;
  pubDate: string;
}

interface RssFeed {
  title: string;
  description: string;
  items: RssItem[];
}

interface RssReaderProps {
  url: string | null;
}

export const RssReader: React.FC<RssReaderProps> = ({ url }) => {
  const [feed, setFeed] = useState<RssFeed | null>(null);

  useEffect(() => {
    if (!url) return
    const fetchRssFeed = async () => {
      try {
        const parser = new Parser();
        const feedData = await parser.parseURL(url);
        setFeed(feedData as RssFeed);
      } catch (error) {
        console.error('Error fetching RSS feed:', error);
      }
    };
    if (feed) setFeed(null)
    fetchRssFeed();
  }, [url]);

  return (
    <ScrollArea className="h-full w-full">
      <div className='p-2'>
      {url? feed ? (
        <>
          <h2 className='flex justify-center font-bold text-xl'>{feed.description}</h2>
          <ul className='space-y-5'>
            {feed.items.map((item) => (
              <div key={item.guid} className='space-y-5 border border-black p-2 rounded-md'>
                <div>
                  <img 
                    src={item?.enclosure?.url}
                    alt={item.title}
                    key={item.guid}
                    className='w-full h-full'
                  />
                </div>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className='flex justify-center font-bold'
                >
                  {item.title}
                </a>
                <p>
                  {item.content}
                </p>
              </div>
            ))}
          </ul>
          </>
      ) : (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[250px] w-full rounded-xl" />
          <div className="space-y-2 w-full">
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
          </div>
        </div>
      )
      :"Missing rss feed url"
    }
    </div>
    </ScrollArea>
  );
};
