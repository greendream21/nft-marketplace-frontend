import { useIntl } from 'umi';
import { Button } from 'antd';
import styles from './styles.less';
import { useState } from 'react';
import IconFont from '@/components/icon-font';
import BscAddress from '@/components/bsc-address';
import useBnbusd from '@/hooks/useBnbusd';
import Countdown from '@/components/bid-countdown';
import Web3 from 'web3';

export interface IAssetInfoProps {
  img: string;
  imageType: string;
  name: string;
  description: string;
  owner: string;
  account?: string | null;
  collectName: string;
  countdown: number;
  priceSymbol?: string;
  highestBidder: string;
  bidderPrice: string;
  isFinish: boolean;
  onPlaceBid?: () => void;
  onWithdraw?: () => void;
}

const PlaceBidPanel = (props: any) => {
  const {
    owner,
    account,
    onPlaceBid,
    countdown,
    bidderPrice,
    highestBidder,
    isFinish,
    onWithdraw,
  } = props;
  // const bnbusd = useBnbusd();
  console.log('bidderPrice', bidderPrice);

  const renderButton = () => {
    console.log('renderButton');
    // 拍卖已结束
    if (isFinish) {
      // 未参与
      // 或者中拍
      if (bidderPrice === '0' || owner === account) {
        return (
          <Button type="primary" size="large" block disabled>
            Place Bid
          </Button>
        );
      } else {
        // 已参与：取回质押BNB
        return (
          <Button type="primary" size="large" block onClick={onWithdraw}>
            Retrieve the tender amoun
          </Button>
        );
      }
    }

    // 拍卖中
    return (
      <Button
        className={styles.btnPlaceBid}
        type="primary"
        block
        size="large"
        onClick={onPlaceBid}
      >
        Place Bid
      </Button>
    );
  };

  return (
    <div className={styles.placeBidPanel}>
      <div className={styles.header}>
        <span className={styles.timeLeftLabel}>Time left</span>
        <span className={styles.wrapCountdown}>
          <Countdown key={countdown} countdown={countdown} />
        </span>

        <div className={styles.myLastBid}>
          <span className={styles.bnbPrice}>
            {' '}
            {Web3.utils.fromWei(bidderPrice)} BNB
          </span>
          <span className={styles.text}>My last bid</span>
        </div>
      </div>

      <div
        className={`${styles.wrapBidPrice} ${
          isFinish ? styles.wrapBidPriceFinished : ''
        }`}
      >
        <div className={styles.wrapPriceValue}>
          <span className={styles.bnbPrice}>
            {Web3.utils.fromWei(highestBidder)}
          </span>
          <span className={styles.symbol}>BNB</span>
          {/* <span className={styles.usdPrice}>
            /${parseFloat(Web3.utils.fromWei(highestBidder)) * bnbusd}
          </span> */}
        </div>
        <div className={styles.text}>Current high price</div>
      </div>

      {renderButton()}
    </div>
  );
};

export default (props: IAssetInfoProps) => {
  const intl = useIntl();
  const {
    img,
    imageType,
    collectName,
    owner,
    account,
    name,
    description,
    priceSymbol,
    countdown,
    highestBidder,
    bidderPrice,
    isFinish,

    onPlaceBid,
    onWithdraw,
  } = props;

  return (
    <div className={styles.assetInfo}>
      <div className={styles.imgBox}>
        {imageType === 'image' && !!img && (
          <img src={img} alt="img" className={styles.img} />
        )}
        {imageType === 'video' && (
          <video controls className={styles.video}>
            <source src={img} type="video/mp4"></source>
          </video>
        )}
        {imageType === 'audio' && (
          <audio src={img} controls className={styles.audio}></audio>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.name}>{name}</div>

        <div className={styles.description}>{description}</div>

        <div className={styles.tagsWrap}>
          <span className={styles.chainTag}>
            <IconFont type="icon-bsc" />
            {priceSymbol || 'BSC'}
          </span>
          {!!collectName && (
            <span className={styles.collectName}>#{collectName}#</span>
          )}
        </div>

        <div className={styles.ownerWrap}>
          <span className={styles.text}>
            {intl.formatMessage({
              id: 'assetInfo_ownedBy',
              defaultMessage: 'Owned by',
            })}
          </span>
          <BscAddress value={owner} short></BscAddress>
        </div>

        <PlaceBidPanel
          owner={owner}
          account={account}
          countdown={countdown}
          highestBidder={highestBidder}
          bidderPrice={bidderPrice}
          isFinish={isFinish}
          onPlaceBid={onPlaceBid}
          onWithdraw={onWithdraw}
        />
      </div>
    </div>
  );
};
