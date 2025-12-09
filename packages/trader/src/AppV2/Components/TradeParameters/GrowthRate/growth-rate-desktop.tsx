import React, { useCallback, useRef, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { getGrowthRatePercentage } from '@deriv/shared';
import { TextField } from '@deriv-com/quill-ui';
import { Localize } from '@deriv-com/translations';

import { useTraderStore } from 'Stores/useTraderStores';

import { InputPopover } from '../../InputPopover';
import { TTradeParametersProps } from '../trade-parameters';

const GrowthRateDesktop = observer(({ is_minimized }: TTradeParametersProps) => {
    const { accumulator_range_list, growth_rate, has_open_accu_contract, is_market_closed, onChange } =
        useTraderStore();

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const inputRef = useRef<HTMLDivElement>(null);

    const handleOpenPopover = useCallback(() => {
        setIsPopoverOpen(true);
    }, []);

    const handleClosePopover = useCallback(() => {
        setIsPopoverOpen(false);
    }, []);

    const handleRateSelect = useCallback(
        (rate: number) => {
            onChange({ target: { name: 'growth_rate', value: rate } });
            handleClosePopover();
        },
        [onChange, handleClosePopover]
    );

    return (
        <>
            <div ref={inputRef}>
                <TextField
                    variant='fill'
                    readOnly
                    label={
                        <Localize
                            i18n_default_text='Growth rate'
                            key={`growth-rate${is_minimized ? '-minimized' : ''}`}
                        />
                    }
                    value={`${getGrowthRatePercentage(growth_rate)}%`}
                    noStatusIcon
                    disabled={has_open_accu_contract || is_market_closed}
                    className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
                    onClick={handleOpenPopover}
                />
            </div>

            <InputPopover
                isOpen={isPopoverOpen}
                onClose={handleClosePopover}
                triggerRef={inputRef}
                className='growth-rate-popover'
                popoverWidth={160}
            >
                <div className='growth-rate-popover__content'>
                    {accumulator_range_list.map(rate => {
                        const percentage = getGrowthRatePercentage(rate);
                        const isSelected = rate === growth_rate;

                        return (
                            <button
                                key={rate}
                                type='button'
                                className={clsx('growth-rate-popover__option', {
                                    'growth-rate-popover__option--selected': isSelected,
                                })}
                                onClick={() => handleRateSelect(rate)}
                            >
                                {percentage}%
                            </button>
                        );
                    })}
                </div>
            </InputPopover>
        </>
    );
});

export default GrowthRateDesktop;
