import * as React from 'react';
import type { CarouselProps } from 'antd';
import { Carousel } from 'antd';
import { prefixClass } from './config';
import './Banner.less';

const prefixCls = `${prefixClass}-banner`;

export type BannerItem =
  | {
      src: string;
      link?: string;
      title?: string;
      onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    }
  | React.ReactElement
  | string;

export interface BannerProps {
  data?: BannerItem[]; // 支持单张和多张，配置链接
  carouselProps?: CarouselProps;
  rightContent?: React.ReactNode;
}

const Banner: React.FC<BannerProps> = ({ data = [], carouselProps, rightContent }) => {
  if (!Array.isArray(data) || data.length <= 0) {
    return null;
  }

  return (
    <div className={prefixCls}>
      <Carousel autoplay {...carouselProps}>
        {data.map((itemBanner, index) => {
          const isReactElement = React.isValidElement(itemBanner);

          let src = '';
          let title = '';
          let link, onClick;

          if (!isReactElement) {
            if (typeof itemBanner === 'string') {
              src = itemBanner;
            } else {
              src = itemBanner.src;
              link = itemBanner.link;
              title = itemBanner.title;
              onClick = itemBanner.onClick;
            }
          }

          const key = isReactElement ? itemBanner.key : src + index;

          return (
            <div className={`${prefixCls}-item`} key={key}>
              {isReactElement ? (
                itemBanner
              ) : link || onClick ? (
                <a href={link} title={title} onClick={onClick}>
                  <img src={src} alt={title} />
                </a>
              ) : (
                <img src={src} alt={title} />
              )}
            </div>
          );
        })}
      </Carousel>
      {rightContent && <div className={`${prefixCls}-right`}>{rightContent}</div>}
    </div>
  );
};

export default Banner;