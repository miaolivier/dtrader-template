import React, { useCallback, useRef, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { TextField } from '@deriv-com/quill-ui';
import { Localize } from '@deriv-com/translations';

import { useTraderStore } from 'Stores/useTraderStores';

import { InputPopover } from '../../InputPopover';
import { TTradeParametersProps } from '../trade-parameters';

const MultiplierDesktop = observer(({ is_minimized }: TTradeParametersProps) => {
    const { multiplier, multiplier_range_list, is_market_closed, onChange } = useTraderStore();

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const inputRef = useRef<HTMLDivElement>(null);

    const handleOpenPopover = useCallback(() => {
        setIsPopoverOpen(true);
    }, []);

    const handleClosePopover = useCallback(() => {
        setIsPopoverOpen(false);
    }, []);

    const handleMultiplierSelect = useCallback(
        (selected_multiplier: number) => {
            onChange({ target: { name: 'multiplier', value: selected_multiplier } });
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
                            i18n_default_text='Multiplier'
                            key={`multiplier${is_minimized ? '-minimized' : ''}`}
                        />
                    }
                    value={`x${multiplier}`}
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
                className='multiplier-popover'
                popoverWidth={160}
            >
                <div className='multiplier-popover__content'>
                    {multiplier_range_list.map(mult => {
                        const mult_text = mult.text;
                        const mult_value = Number(mult_text.slice(1));
                        const isSelected = mult_value === multiplier;

                        return (
                            <button
                                key={mult_value}
                                type='button'
                                className={clsx('multiplier-popover__option', {
                                    'multiplier-popover__option--selected': isSelected,
                                })}
                                onClick={() => handleMultiplierSelect(mult_value)}
                            >
                                {mult_text}
                            </button>
                        );
                    })}
                </div>
            </InputPopover>
        </>
    );
});

export default MultiplierDesktop;
