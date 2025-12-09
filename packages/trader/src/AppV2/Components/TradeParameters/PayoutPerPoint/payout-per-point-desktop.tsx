import React, { useCallback, useRef, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { getCurrencyDisplayCode } from '@deriv/shared';
import { TextField } from '@deriv-com/quill-ui';
import { Localize } from '@deriv-com/translations';

import { useTraderStore } from 'Stores/useTraderStores';

import { InputPopover } from '../../InputPopover';
import { TTradeParametersProps } from '../trade-parameters';

const PayoutPerPointDesktop = observer(({ is_minimized }: TTradeParametersProps) => {
    const { currency, is_market_closed, payout_choices, payout_per_point, setPayoutPerPoint } = useTraderStore();

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const inputRef = useRef<HTMLDivElement>(null);

    const currency_display_code = getCurrencyDisplayCode(currency);
    const payout_per_point_list = [...payout_choices]
        .sort((a, b) => Number(a) - Number(b))
        .map((payout: string) => ({
            value: payout,
            label: `${payout} ${currency_display_code}`,
        }));

    const handleOpenPopover = useCallback(() => {
        setIsPopoverOpen(true);
    }, []);

    const handleClosePopover = useCallback(() => {
        setIsPopoverOpen(false);
    }, []);

    const handlePayoutSelect = useCallback(
        (payout: string) => {
            setPayoutPerPoint(payout);
            handleClosePopover();
        },
        [setPayoutPerPoint, handleClosePopover]
    );

    return (
        <>
            <div ref={inputRef}>
                <TextField
                    variant='fill'
                    readOnly
                    label={
                        <Localize
                            i18n_default_text='Payout per point'
                            key={`payout-per-point${is_minimized ? '-minimized' : ''}`}
                        />
                    }
                    value={`${payout_per_point} ${currency_display_code}`}
                    noStatusIcon
                    disabled={is_market_closed}
                    className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
                    onClick={handleOpenPopover}
                />
            </div>

            <InputPopover
                isOpen={isPopoverOpen}
                onClose={handleClosePopover}
                triggerRef={inputRef}
                className='payout-per-point-popover'
                popoverWidth={160}
            >
                <div className='payout-per-point-popover__content'>
                    {payout_per_point_list.map(({ value, label }) => {
                        const isSelected = value === payout_per_point;

                        return (
                            <button
                                key={value}
                                type='button'
                                className={clsx('payout-per-point-popover__option', {
                                    'payout-per-point-popover__option--selected': isSelected,
                                })}
                                onClick={() => handlePayoutSelect(value)}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </InputPopover>
        </>
    );
});

export default PayoutPerPointDesktop;
