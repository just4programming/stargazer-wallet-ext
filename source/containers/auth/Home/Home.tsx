import React from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

import Header from 'containers/common/Header';
import Button from 'components/Button';
import FullSelect from 'components/FullSelect';
import { useController } from 'hooks/index';
import { useFiat } from 'hooks/usePrice';
import { RootState } from 'state/store';
import TxsPanel from './TxsPanel';

import styles from './Home.scss';
import { formatNumber } from '../helpers';

const Home = () => {
  const controller = useController();
  const getFiatAmount = useFiat();
  const { accounts, activeIndex } = useSelector(
    (state: RootState) => state.wallet
  );

  const handleRefresh = () => {
    controller.wallet.account.getLatestUpdate();
    controller.stateUpdater();
  };

  return (
    <div className={styles.wrapper}>
      {accounts[activeIndex] ? (
        <>
          <Header showLogo />
          <section className={styles.account}>
            {Object.keys(accounts).length > 1 ? (
              <FullSelect
                value={String(activeIndex)}
                options={accounts}
                onChange={(val: string) =>
                  controller.wallet.switchWallet(Number(val))
                }
              />
            ) : (
              accounts[activeIndex].label
            )}
          </section>
          <section className={styles.center}>
            <h3>
              {formatNumber(accounts[activeIndex].balance)} <small>DAG</small>
            </h3>
            <small>≈ {getFiatAmount(accounts[activeIndex].balance)}</small>
            <IconButton className={styles.refresh} onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
            <div className={styles.actions}>
              <Button
                type="button"
                theme="primary"
                variant={styles.button}
                linkTo="/send"
              >
                Send
              </Button>
              <Button
                type="button"
                theme="primary"
                variant={styles.button}
                linkTo="/receive"
              >
                Receive
              </Button>
            </div>
          </section>
          <TxsPanel
            address={accounts[activeIndex].address}
            transactions={accounts[activeIndex].transactions}
          />
        </>
      ) : (
        <section
          className={clsx(styles.mask, {
            [styles.hide]: accounts[activeIndex],
          })}
        >
          <CircularProgress className={styles.loader} />
        </section>
      )}
    </div>
  );
};

export default Home;